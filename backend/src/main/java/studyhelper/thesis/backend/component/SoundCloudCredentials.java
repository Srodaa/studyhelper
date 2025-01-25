package studyhelper.thesis.backend.component;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import studyhelper.thesis.backend.entity.SoundCloudCredentialsEntity;
import studyhelper.thesis.backend.repository.SoundCloudCredentialsRepository;

import java.nio.charset.StandardCharsets;
import java.util.Map;

@Component
public class SoundCloudCredentials {

    private static final Logger logger = LoggerFactory.getLogger(SoundCloudCredentials.class);

    private static final String TOKEN_URL = "https://secure.soundcloud.com/oauth/token";
    @Value("${soundcloud.clientId}")
    private String clientId;
    @Value("${soundcloud.clientSecret}")
    private String clientSecret;
    private String accessToken;
    private String refreshToken;

    @Autowired
    private SoundCloudCredentialsRepository sccRepository;

    @PostConstruct
    public void init() {
        getAccessToken();
    }

    private void getAccessToken(){
        RestTemplate restTemplate = new RestTemplate();

        //Base64
        String auth = clientId + ":" + clientSecret;
        String encodedAuth = java.util.Base64.getEncoder().encodeToString(auth.getBytes());
        String authHeader = "Basic " + encodedAuth;

        //HTTP Headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.set("Authorization", authHeader);
        headers.setAcceptCharset(java.util.List.of(StandardCharsets.UTF_8));

        //Body
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "client_credentials");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(TOKEN_URL, request, Map.class);

            // Response
            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> responseBody = response.getBody();
                assert responseBody != null;
                accessToken = (String) responseBody.get("access_token");
                refreshToken = (String) responseBody.get("refresh_token");
                SoundCloudCredentialsEntity sccEntity = sccRepository.findById("SOUNDCLOUD")
                        .orElseGet(() -> {
                            SoundCloudCredentialsEntity newEntity = new SoundCloudCredentialsEntity();
                            newEntity.setId("SOUNDCLOUD");
                            newEntity.setAccessToken(null);
                            newEntity.setRefreshToken(null);
                            return sccRepository.save(newEntity);
                        });
                sccEntity.setAccessToken(accessToken);
                sccEntity.setRefreshToken(refreshToken);
                sccRepository.save(sccEntity);
                logger.info("Backend indítás SoundCloud Credentials lekérés: \n Access Token lekérve: " + accessToken + " - " + "Refresh Token lekérve: " + refreshToken);
            } else {
                throw new RuntimeException("Failed to fetch access token. Status code: " + response.getStatusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error while fetching access token: " + e.getMessage(), e);
        }
    }
}