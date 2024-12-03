package studyhelper.thesis.backend.service;

import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

public class GoogleOauthService {
    private static final String TOKEN_URL = "https://oauth2.googleapis.com/token";

    public String getNewAccessToken(String refreshToken) {
        String clientId = "YOUR_CLIENT_ID";
        String clientSecret = "YOUR_CLIENT_SECRET";

        // Kérési paraméterek
        String requestUrl = UriComponentsBuilder.fromHttpUrl(TOKEN_URL)
                .queryParam("client_id", clientId)
                .queryParam("client_secret", clientSecret)
                .queryParam("refresh_token", refreshToken)
                .queryParam("grant_type", "refresh_token")
                .toUriString();

        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.postForObject(requestUrl, null, String.class);

        return response;
    }

}
