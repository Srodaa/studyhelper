package studyhelper.thesis.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import studyhelper.thesis.backend.DTO.CalendarEvent;
import studyhelper.thesis.backend.DTO.CalendarEventsResponse;
import studyhelper.thesis.backend.entity.EventDetailsEntity;
import studyhelper.thesis.backend.entity.UserEntity;
import studyhelper.thesis.backend.repository.EventDetailsRepository;
import studyhelper.thesis.backend.repository.UserRepository;

import java.util.List;

@Service
public class CalendarService {

    private static final Logger logger = LoggerFactory.getLogger(CalendarService.class);


    @Value("${google.calendar.api.url}")
    private String apiUrl;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventDetailsRepository eventDetailsRepository;

    @Autowired
    private EventDetailsService eventDetailsService;

    @Autowired
    public CalendarService(RestTemplate restTemplate, UserRepository userRepository, EventDetailsRepository eventDetailsRepository, EventDetailsService eventDetailsService) {
        this.restTemplate = restTemplate;
        this.userRepository = userRepository;
        this.eventDetailsRepository = eventDetailsRepository;
        this.eventDetailsService = eventDetailsService;
    }

    private <T> ResponseEntity<T> sendRequest(String url, HttpMethod method, HttpEntity<?> entity, Class<T> responseType) {
        return restTemplate.exchange(url, method, entity, responseType);
    }

    public List<CalendarEvent> getEvents(String accessToken) {
        String url = apiUrl + "?access_token=" + accessToken;
        ResponseEntity<CalendarEventsResponse> response = sendRequest(url, HttpMethod.GET, null, CalendarEventsResponse.class);
        logger.info("Lekérdezve: {}", url);
        return response.getBody().getItems();
    }

    public void deleteEvent(String accessToken, String eventId) {
        HttpHeaders headers = new HttpHeaders();
        String url = apiUrl + "/" + eventId;
        headers.setBearerAuth(accessToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        sendRequest(url, HttpMethod.DELETE, entity, Void.class);
        System.out.println("Törölve: " + url);
    }

    public CalendarEvent updateEventWithSubjectAndDuration(UserEntity user, String accessToken, String eventId, CalendarEvent updateEvent) {
        String subject = updateEvent.getSubject();
        int duration = updateEvent.getDuration();
        // Calendar event update
        updateEvent(accessToken, eventId, updateEvent);

        // db update
        EventDetailsEntity eventDetailsEntity = eventDetailsRepository.findByEventID(eventId)
                .orElseGet(() -> {
                    EventDetailsEntity newEventDetails = new EventDetailsEntity();
                    newEventDetails.setEventID(eventId);
                    newEventDetails.setSubject(subject);
                    newEventDetails.setDuration(duration);
                    newEventDetails.setDefaultDuration(duration);
                    newEventDetails.setUser(user);
                    return eventDetailsRepository.save(newEventDetails);
                });
        eventDetailsEntity.setSubject(subject);
        eventDetailsEntity.setDuration(duration);
        eventDetailsEntity.setDefaultDuration(duration);
        eventDetailsEntity.setUser(user);
        eventDetailsRepository.save(eventDetailsEntity);
        return updateEvent;
    }

    public CalendarEvent updateEvent(String accessToken, String eventId, CalendarEvent updateEvent) {
        HttpHeaders headers = new HttpHeaders();
        String url = apiUrl + "/" +eventId;
        headers.setBearerAuth(accessToken);
        HttpEntity<CalendarEvent> entity = new HttpEntity<>(updateEvent, headers);
        ResponseEntity<CalendarEvent> response = sendRequest(url, HttpMethod.PUT, entity, CalendarEvent.class);
        System.out.println("Frissítve: " + url);
        return response.getBody();
    }

    public CalendarEvent createEventWithSubjectAndDuration(UserEntity user, String accessToken, CalendarEvent newEvent) {
        //Előre lementjük a kategóriát és az időtartamot, mert a Google Calendar API nem támogatja ezeket a mezőket
        String subject = newEvent.getSubject();
        int duration = newEvent.getDuration();
        int defaultDuration = newEvent.getDefaultDuration();

        CalendarEvent createdEvent = createEvent(accessToken, newEvent);
        //Mivel ID-hoz rendeljük őket ezért csak akkor mentjük el, ha a Google Calendar API visszatér az ID-val
        if (createdEvent.getId() != null) {
            createdEvent.setSubject(subject);
            createdEvent.setDuration(duration);
            createdEvent.setDefaultDuration(defaultDuration);
            EventDetailsEntity eventDetailsEntity = new EventDetailsEntity();
            eventDetailsEntity.setEventID(createdEvent.getId());
            eventDetailsEntity.setSubject(createdEvent.getSubject());
            eventDetailsEntity.setDuration(createdEvent.getDuration());
            eventDetailsEntity.setDefaultDuration(createdEvent.getDefaultDuration());
            eventDetailsEntity.setUser(user);
            eventDetailsRepository.save(eventDetailsEntity);
        } else {
            throw new IllegalStateException("Nem lekérdezhető eventID!");
        }
        return createdEvent;
    }

    public CalendarEvent createEvent(String accessToken, CalendarEvent newEvent) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<CalendarEvent> entity = new HttpEntity<>(newEvent, headers);
        ResponseEntity<CalendarEvent> response = sendRequest(apiUrl, HttpMethod.POST, entity, CalendarEvent.class);
        return response.getBody();
    }

    public EventDetailsEntity fetchEventSubjectAndDuration(String eventId, Authentication authentication) {
        String userEmail = ((OAuth2User) authentication.getPrincipal()).getAttribute("email");
        UserEntity user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("Felhasználó nem található!"));

        return eventDetailsRepository.findByEventID(eventId)
                .orElseGet(() -> {
                    EventDetailsEntity newEventDetails = new EventDetailsEntity();
                    newEventDetails.setEventID(eventId);
                    newEventDetails.setSubject("Default");
                    newEventDetails.setDuration(0);
                    newEventDetails.setDefaultDuration(0);
                    newEventDetails.setUser(user);
                    return eventDetailsRepository.save(newEventDetails);
                });
    }

    public List<String> getSubjectsByUser(Long userId) {
        return eventDetailsRepository.findSubjectsByUserId(userId);
    }

    public void updateSubjectDuration(String subject, int elapsedSeconds) {
        eventDetailsService.updateSubjectDuration(subject, elapsedSeconds);
    }
}
