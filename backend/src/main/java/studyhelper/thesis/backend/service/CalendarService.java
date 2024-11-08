package studyhelper.thesis.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import studyhelper.thesis.backend.entity.CalendarEvent;
import studyhelper.thesis.backend.entity.CalendarEventsResponse;
import studyhelper.thesis.backend.entity.EventDetailsEntity;
import studyhelper.thesis.backend.entity.UserEntity;
import studyhelper.thesis.backend.repository.EventDetailsRepository;
import studyhelper.thesis.backend.repository.UserRepository;

import java.util.List;

@Service
public class CalendarService {

    @Value("${google.calendar.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    public CalendarService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Autowired
    private EventDetailsRepository eventDetailsRepository;

    @Autowired
    private eventDetailsService eventDetailsService;


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

    public CalendarEvent updateEventWithCategoryAndDuration(UserEntity user, String accessToken, String eventId, CalendarEvent updateEvent) {
        String temporaryCategory = updateEvent.getCategory();
        int temporaryDuration = updateEvent.getDuration();

        updateEvent(accessToken, eventId, updateEvent);

        // Frissítjük az EventDetailsEntity-t az adatbázisban
        EventDetailsEntity eventDetailsEntity = eventDetailsRepository.findByEventID(eventId)
                .orElseGet(() -> {
                    EventDetailsEntity newEventDetails = new EventDetailsEntity();
                    newEventDetails.setEventID(eventId);
                    newEventDetails.setCategory(temporaryCategory);
                    newEventDetails.setDuration(temporaryDuration);
                    newEventDetails.setUser(user);
                    // Mentjük az új entitást az adatbázisba
                    return eventDetailsRepository.save(newEventDetails);
                });
        eventDetailsEntity.setCategory(temporaryCategory);
        eventDetailsEntity.setDuration(temporaryDuration);
        // Felhasználó <-> esemény raláció
        eventDetailsEntity.setUser(user);
        eventDetailsRepository.save(eventDetailsEntity);

        return updateEvent;
    }

    public CalendarEvent updateEvent(String accessToken, String eventId, CalendarEvent updateEvent){
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
        return response.getBody();
    }

    public CalendarEvent createEventWithCategoryAndDuration(UserEntity user, String accessToken, CalendarEvent newEvent){
        //Előre lementjük a kategóriát és az időtartamot, mert a Google Calendar API nem támogatja ezeket a mezőket
        String temporaryCategory = newEvent.getCategory();
        int temporaryDuration = newEvent.getDuration();

        CalendarEvent createdEvent = createEvent(accessToken, newEvent);
        //Mivel ID-hoz rendeljük őket ezért csak akkor mentjük el, ha a Google Calendar API visszatér az ID-val
        if (createdEvent.getId() != null){
            createdEvent.setCategory(temporaryCategory);
            createdEvent.setDuration(temporaryDuration);
            //Mentjük az adatbázisba
            EventDetailsEntity eventDetailsEntity = new EventDetailsEntity();
            eventDetailsEntity.setEventID(createdEvent.getId());
            eventDetailsEntity.setCategory(createdEvent.getCategory());
            eventDetailsEntity.setDuration(createdEvent.getDuration());
            //Felhasználó <-> esemény raláció
            eventDetailsEntity.setUser(user);
            eventDetailsRepository.save(eventDetailsEntity);
            user.addEvent(eventDetailsEntity);
            userRepository.save(user);
        } else {
            throw new IllegalStateException("Nem lekérdezhető eventID!");
        }
        return createdEvent;
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

    public EventDetailsEntity fetchEventCategoryAndDuration(String eventId, Authentication authentication) {
        String userEmail = ((OAuth2User) authentication.getPrincipal()).getAttribute("email");
        UserEntity user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("Felhasználó nem található!"));


        //Visszaadja a category-t és duration-t, ha nincs még benne az adott event akkor pedig létrehozza
        EventDetailsEntity existingEventDetails = eventDetailsRepository.findByEventID(eventId).orElse(null);

        if (existingEventDetails != null) {
            return existingEventDetails;
        }

        EventDetailsEntity newEventDetails = new EventDetailsEntity();
        newEventDetails.setEventID(eventId);
        newEventDetails.setCategory("Default");
        newEventDetails.setDuration(0);
        newEventDetails.setUser(user);

        return eventDetailsRepository.save(newEventDetails);
    }

    public List<String> getAllCategories() {
        return eventDetailsRepository.findAllCategories();
    }

    public void updateCategoryDuration(String category, int elapsedSeconds) {
        eventDetailsService.updateCategoryDuration(category, elapsedSeconds);
    }
}

