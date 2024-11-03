package studyhelper.thesis.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import studyhelper.thesis.backend.entity.CalendarEvent;
import studyhelper.thesis.backend.entity.CalendarEventsResponse;

import java.util.List;

@Service
public class CalendarService {

    @Value("${google.calendar.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;

    @Autowired
    public CalendarService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<CalendarEvent> getEvents(String accessToken) {
        String url = "https://www.googleapis.com/calendar/v3/calendars/primary/events?access_token=" + accessToken;

        // Hívás a Google Calendar API-ra
        ResponseEntity<CalendarEventsResponse> response = restTemplate.exchange(url, HttpMethod.GET, null,
                CalendarEventsResponse.class);

        System.out.println(apiUrl);
        // A válasz feldolgozása
        return response.getBody().getItems();
    }

    public void deleteEvent(String accessToken, String eventId) {
        RestTemplate restTemplate = new RestTemplate();
        // Headerök megadása
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        // Http entity
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        // Request
        restTemplate.exchange(
                apiUrl + "/" + eventId,
                HttpMethod.DELETE,
                entity,
                Void.class
        );
        System.out.println("Delete: " + apiUrl+"/"+eventId);
    }

    public void updateEvent(String accessToken, String eventId, CalendarEvent updateEvent){
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<CalendarEvent> entity = new HttpEntity<>(updateEvent, headers);

        ResponseEntity<CalendarEvent> response = restTemplate.exchange(
                apiUrl + "/" + eventId,
                HttpMethod.PUT,
                entity,
                CalendarEvent.class
        );

        System.out.println("Update: " + apiUrl+"/"+eventId);
    }

    public CalendarEvent createEvent(String accessToken, CalendarEvent newEvent) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<CalendarEvent> entity = new HttpEntity<>(newEvent, headers);

        ResponseEntity<CalendarEvent> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                entity,
                CalendarEvent.class
        );

        System.out.println("Create: " + apiUrl);
        return response.getBody();
    }
}

