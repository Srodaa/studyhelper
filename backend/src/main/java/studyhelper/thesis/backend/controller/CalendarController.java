package studyhelper.thesis.backend.controller;

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
import studyhelper.thesis.backend.DTO.CalendarEvent;
import studyhelper.thesis.backend.entity.EventDetailsEntity;
import studyhelper.thesis.backend.entity.UserEntity;
import studyhelper.thesis.backend.repository.EventDetailsRepository;
import studyhelper.thesis.backend.repository.UserRepository;
import studyhelper.thesis.backend.service.CalendarService;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
public class CalendarController {

    private CalendarService calendarService;

    private OAuth2AuthorizedClientService authorizedClientService;

    private UserRepository userRepository;

    private EventDetailsRepository eventDetailsRepository;

    public CalendarController(CalendarService calendarService, OAuth2AuthorizedClientService authorizedClientService, UserRepository userRepository, EventDetailsRepository eventDetailsRepository) {
        this.calendarService = calendarService;
        this.authorizedClientService = authorizedClientService;
        this.userRepository = userRepository;
        this.eventDetailsRepository = eventDetailsRepository;
    }

    private OAuth2AccessToken getAccessToken(Authentication authentication) {
        OAuth2AuthenticationToken oAuth2Token = (OAuth2AuthenticationToken) authentication;
        OAuth2AuthorizedClient authorizedClient = authorizedClientService.loadAuthorizedClient(
                oAuth2Token.getAuthorizedClientRegistrationId(),
                oAuth2Token.getName()
        );
        return authorizedClient.getAccessToken();
    }

    private UserEntity getUserFromPrincipal(OAuth2User principal) {
        return userRepository.findByEmail(principal.getAttribute("email"))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @GetMapping("/calendar-events")
    public List<CalendarEvent> getUpcomingEvents(Authentication authentication) {
        OAuth2AccessToken accessToken = getAccessToken(authentication);
        return calendarService.getEvents(accessToken.getTokenValue());
    }

    @DeleteMapping("/user/calendar-events/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable String eventId, Authentication authentication) {
        OAuth2AccessToken accessToken = getAccessToken(authentication);
        eventDetailsRepository.findByEventID(eventId)
                .ifPresent(eventDetails -> eventDetailsRepository.delete(eventDetails));
        calendarService.deleteEvent(accessToken.getTokenValue(), eventId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/user/calendar-events/{eventId}")
    public ResponseEntity<CalendarEvent> updateEvent(
            @PathVariable String eventId,
            @RequestBody CalendarEvent updatedEvent,
            @AuthenticationPrincipal OAuth2User principal,
            Authentication authentication) {

        OAuth2AccessToken accessToken = getAccessToken(authentication);
        UserEntity user = getUserFromPrincipal(principal);
        CalendarEvent updatedEventResult = calendarService.updateEventWithCategoryAndDuration(user, accessToken.getTokenValue(), eventId, updatedEvent);
        return ResponseEntity.ok(updatedEventResult);
    }

    @PostMapping("/user/calendar-events")
    public ResponseEntity<CalendarEvent> createEvent(
            @RequestBody CalendarEvent newEvent,
            @AuthenticationPrincipal OAuth2User principal,
            Authentication authentication) {

        OAuth2AccessToken accessToken = getAccessToken(authentication);
        UserEntity user = getUserFromPrincipal(principal);
        CalendarEvent createdEvent = calendarService.createEventWithCategoryAndDuration(user, accessToken.getTokenValue(), newEvent);
        return ResponseEntity.ok(createdEvent);
    }

    @GetMapping("/user/calendar-events/{eventId}/details")
    public ResponseEntity<EventDetailsEntity> getEventCategoryAndDuration(@PathVariable String eventId, Authentication authentication) {
        EventDetailsEntity eventDetails = calendarService.fetchEventCategoryAndDuration(eventId, authentication);
        return ResponseEntity.ok(eventDetails);
    }

    @GetMapping("/user/categories")
    public ResponseEntity<List<String>> getCategories(@AuthenticationPrincipal OAuth2User principal) {
        try {
            UserEntity user = getUserFromPrincipal(principal);
            List<String> categories = calendarService.getCategoriesByUser(user.getId());
            categories = categories.stream()
                    .filter(Objects::nonNull)
                    .filter(category -> !"Default".equals(category))
                    .collect(Collectors.toList());
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
