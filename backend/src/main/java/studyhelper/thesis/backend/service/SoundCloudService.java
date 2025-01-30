package studyhelper.thesis.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import studyhelper.thesis.backend.DTO.SCTrackDetailsDTO;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Objects;

@Service
public class SoundCloudService {

    private static final Logger logger = LoggerFactory.getLogger(SoundCloudCredentialsService.class);

    private final String API_URL = "https://api.soundcloud.com";

    public SCTrackDetailsDTO getTrackDetails(String trackId, String accessToken) {
        HttpClient client = HttpClient.newHttpClient();
        String url = API_URL + "/tracks/%s";
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(String.format(url, trackId)))
                .header("Accept", "application/json; charset=utf-8")
                .header("Authorization", "OAuth " + accessToken)
                .GET()
                .build();

        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(response.body());
            String title = rootNode.has("title") ? rootNode.get("title").asText() : "N/A";
            String username = rootNode.has("user") && rootNode.get("user").has("username")
                    ? rootNode.get("user").get("username").asText()
                    : "N/A";
            String permalinkUrl = rootNode.has("permalink_url") ? rootNode.get("permalink_url").asText() : "N/A";
            String streamUrl = rootNode.has("stream_url") ? rootNode.get("stream_url").asText() : "N/A";
            if (Objects.equals(streamUrl, "N/A") || streamUrl == null) {
                logger.error("Stream URL not found for track: {}", title);
                return new SCTrackDetailsDTO("N/A", "N/A", "N/A", "N/A");
            }
            String extractStreamUrl = fetchStreamURL(streamUrl, accessToken);
            logger.info("SoundCloud track details: {} by {} - {} - {}", title, username, permalinkUrl, extractStreamUrl);
            return new SCTrackDetailsDTO(title, username, permalinkUrl, extractStreamUrl);
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
        return new SCTrackDetailsDTO("N/A", "N/A", "N/A", "N/A");
    }

    public String fetchStreamURL(String streamURL, String accessToken) {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(String.format(streamURL)))
                .header("Accept", "application/json; charset=utf-8")
                .header("Authorization", "OAuth " + accessToken)
                .GET()
                .build();

        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(response.body());
            logger.info("SoundCloud stream URL: {}", rootNode.get("location").asText());
            return rootNode.has("location") ? rootNode.get("location").asText() : null;

        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
        return null;
    }

}
