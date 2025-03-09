package studyhelper.thesis.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import studyhelper.thesis.backend.entity.UserEntity;
import studyhelper.thesis.backend.repository.UserRepository;


import java.util.Map;

@Service
public class TokenRefreshService {

    private static final Logger logger = LoggerFactory.getLogger(TokenRefreshService.class);

    private static final String TOKEN_URL = "https://oauth2.googleapis.com/token";

    @Autowired
    private RestTemplate restTemplate;

    @Value("${google.client.id}")
    private String clientID;

    @Value("${google.client.secret}")
    private String clientSecret;

    @Autowired
    UserRepository userRepository;

    public void refreshAccessToken(String googleId, String refreshToken) {
        try {
            // Request body
            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("client_id", clientID);
            body.add("client_secret", clientSecret);
            body.add("refresh_token", refreshToken);
            body.add("grant_type", "refresh_token");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED); // header XDDD

            HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);

            // Google API request to get the new access token
            ResponseEntity<Map> response = restTemplate.exchange(
                    TOKEN_URL,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            Map<String, String> responseBody = response.getBody();
            String newAccessToken = responseBody != null ? responseBody.get("access_token") : null;

            if (newAccessToken != null) {
                UserEntity user = userRepository.findByGoogleID(googleId).orElseThrow(() -> new IllegalArgumentException("User not found"));
                user.setAccessToken(newAccessToken);
                userRepository.save(user);

                logger.info("New access token received: {} - {}", user.getEmail(), newAccessToken);
            } else {
                logger.error("Error: No access token received.");
            }

        } catch (HttpClientErrorException e) {
            logger.error("Error refreshing access token: {}", e.getMessage());
        }
    }
}
