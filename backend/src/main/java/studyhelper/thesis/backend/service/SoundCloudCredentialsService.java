package studyhelper.thesis.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import studyhelper.thesis.backend.entity.SoundCloudCredentialsEntity;
import studyhelper.thesis.backend.repository.SoundCloudCredentialsRepository;

import java.util.Map;
import java.util.Optional;

@Service
public class SoundCloudCredentialsService {
    private static final Logger logger = LoggerFactory.getLogger(SoundCloudCredentialsService.class);


    private static final String TOKEN_URL = "https://secure.soundcloud.com/oauth/token";
    @Value("${soundcloud.clientId}")
    private String clientId;
    @Value("${soundcloud.clientSecret}")
    private String clientSecret;

    private SoundCloudCredentialsRepository credentialsRepository;

    public SoundCloudCredentialsService(SoundCloudCredentialsRepository tokenRepository) {
        this.credentialsRepository = tokenRepository;
    }

    public String getTokens() {
        Optional<SoundCloudCredentialsEntity> tokenEntityOpt = credentialsRepository.findById("SOUNDCLOUD");
        refreshTokens(tokenEntityOpt.orElse(null));
        return credentialsRepository.findById("SOUNDCLOUD").orElseThrow().getRefreshToken();
    }

    private void refreshTokens(SoundCloudCredentialsEntity existingToken) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "refresh_token");
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("refresh_token", existingToken.getRefreshToken());

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(TOKEN_URL, request, Map.class);
            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> responseBody = response.getBody();
                assert responseBody != null;

                String newAccessToken = (String) responseBody.get("access_token");
                String newRefreshToken = (String) responseBody.get("refresh_token");

                SoundCloudCredentialsEntity tokenEntity = existingToken;
                tokenEntity.setAccessToken(newAccessToken);
                tokenEntity.setRefreshToken(newRefreshToken);

                credentialsRepository.save(tokenEntity);
                logger.info("SoundCloud tokens: accessToken: " + tokenEntity.getAccessToken() + " refreshToken: " + tokenEntity.getRefreshToken());
            } else {
                throw new RuntimeException("Failed to refresh access token. Status code: " + response.getStatusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error while refreshing access token: " + e.getMessage(), e);
        }
    }
}
