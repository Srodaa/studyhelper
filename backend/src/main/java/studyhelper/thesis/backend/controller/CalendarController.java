package studyhelper.thesis.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import studyhelper.thesis.backend.DTO.UpdateDurationRequest;
import studyhelper.thesis.backend.entity.CalendarEvent;
import studyhelper.thesis.backend.entity.EventDetailsEntity;
import studyhelper.thesis.backend.entity.UserEntity;
import studyhelper.thesis.backend.repository.EventDetailsRepository;
import studyhelper.thesis.backend.repository.UserRepository;
import studyhelper.thesis.backend.service.CalendarService;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
public class CalendarController {

    @Autowired
    private CalendarService calendarService;

    @Autowired
    private OAuth2AuthorizedClientService authorizedClientService;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventDetailsRepository eventDetailsRepository;

    @GetMapping("/calendar-events")
    public List<CalendarEvent> getUpcomingEvents(@AuthenticationPrincipal OAuth2User principal, Authentication authentication) {
        // Cast the Authentication object to OAuth2AuthenticationToken
        OAuth2AuthenticationToken oAuth2Token = (OAuth2AuthenticationToken) authentication;

        // Load the authorized client using the registration ID and principal name
        OAuth2AuthorizedClient authorizedClient = authorizedClientService.loadAuthorizedClient(
                oAuth2Token.getAuthorizedClientRegistrationId(),
                oAuth2Token.getName()
        );
        // Get the access token from the authorized client
        OAuth2AccessToken accessToken = authorizedClient.getAccessToken();
        return calendarService.getEvents(accessToken.getTokenValue());
    }
    // Handles CORS preflight for DELETE method
    @RequestMapping(value = "/user/calendar-events/{eventId}", method = RequestMethod.OPTIONS)
    public ResponseEntity<Void> preflightCheck() {
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/user/calendar-events/{eventId}")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable String eventId,
            @AuthenticationPrincipal OAuth2User principal,
            Authentication authentication) {

        OAuth2AuthenticationToken oAuth2Token = (OAuth2AuthenticationToken) authentication;
        OAuth2AuthorizedClient authorizedClient = authorizedClientService.loadAuthorizedClient(
                oAuth2Token.getAuthorizedClientRegistrationId(),
                oAuth2Token.getName()
        );
        eventDetailsRepository.findByEventID(eventId).ifPresent(eventDetails -> eventDetailsRepository.delete(eventDetails));

        OAuth2AccessToken accessToken = authorizedClient.getAccessToken();
        calendarService.deleteEvent(accessToken.getTokenValue(), eventId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/user/calendar-events/{eventId}")
    public ResponseEntity<CalendarEvent> updateEvent(
            @PathVariable String eventId,
            @RequestBody CalendarEvent updatedEvent,
            @AuthenticationPrincipal OAuth2User principal,
            Authentication authentication) {

        OAuth2AuthenticationToken oAuth2Token = (OAuth2AuthenticationToken) authentication;
        OAuth2AuthorizedClient authorizedClient = authorizedClientService.loadAuthorizedClient(
                oAuth2Token.getAuthorizedClientRegistrationId(),
                oAuth2Token.getName()
        );

        OAuth2AccessToken accessToken = authorizedClient.getAccessToken();
        Optional<UserEntity> optionalUser = userRepository.findByEmail(principal.getAttribute("email"));
        if (optionalUser.isPresent()) {
            UserEntity user = optionalUser.get();
            CalendarEvent updatedEventResult = calendarService.updateEventWithCategoryAndDuration(user, accessToken.getTokenValue(), eventId, updatedEvent);
            return ResponseEntity.ok(updatedEventResult);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

    }

    @PostMapping("/user/calendar-events")
    public ResponseEntity<CalendarEvent> createEvent(
            @RequestBody CalendarEvent newEvent,
            @AuthenticationPrincipal OAuth2User principal,
            Authentication authentication) {
        OAuth2AuthenticationToken oAuth2Token = (OAuth2AuthenticationToken) authentication;
        OAuth2AuthorizedClient authorizedClient = authorizedClientService.loadAuthorizedClient(
                oAuth2Token.getAuthorizedClientRegistrationId(),
                oAuth2Token.getName()
        );

        System.out.println("newEvent: " + newEvent);
        OAuth2AccessToken accessToken = authorizedClient.getAccessToken();

        Optional<UserEntity> optionalUser = userRepository.findByEmail(principal.getAttribute("email"));
        if (optionalUser.isPresent()) {
            UserEntity user = optionalUser.get();
            CalendarEvent createdEvent = calendarService.createEventWithCategoryAndDuration(user, accessToken.getTokenValue(), newEvent);
            return ResponseEntity.ok(createdEvent);

        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

    }

    @GetMapping("/user/calendar-events/{eventId}/details")
    public ResponseEntity<EventDetailsEntity> getEventCategoryAndDuration(@PathVariable String eventId, Authentication authentication) {
        EventDetailsEntity eventDetails = calendarService.fetchEventCategoryAndDuration(eventId, authentication);
        return ResponseEntity.ok(eventDetails);
    }

    @GetMapping("/user/categories")
    public ResponseEntity<List<String>> getCategories() {
        try {
            List<String> categories = calendarService.getAllCategories();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }

    @PostMapping("/user/updateDuration")
    public ResponseEntity<String> updateDuration(@RequestBody UpdateDurationRequest request) {
        try {
            calendarService.updateCategoryDuration(request.getCategory(), request.getElapsedSeconds());
            return ResponseEntity.ok("Az adatbázis sikeresen frissítve.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Hiba történt az adatbázis frissítése során.");
        }
    }

}
