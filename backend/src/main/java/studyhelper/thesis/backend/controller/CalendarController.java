package studyhelper.thesis.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import studyhelper.thesis.backend.DTO.CalendarEvent;
import studyhelper.thesis.backend.entity.UserEntity;
import studyhelper.thesis.backend.repository.EventDetailsRepository;
import studyhelper.thesis.backend.repository.UserRepository;
import studyhelper.thesis.backend.service.CalendarService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
public class CalendarController {

    private static final Logger logger = LoggerFactory.getLogger(CalendarController.class);

    @Autowired
    private CalendarService calendarService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventDetailsRepository eventDetailsRepository;

    public CalendarController(CalendarService calendarService, UserRepository userRepository, EventDetailsRepository eventDetailsRepository) {
        this.calendarService = calendarService;
        this.userRepository = userRepository;
        this.eventDetailsRepository = eventDetailsRepository;
    }

    private String getAccessToken(Authentication authentication) {
        OAuth2AuthenticationToken oAuth2Token = (OAuth2AuthenticationToken) authentication;
        String googleID = oAuth2Token.getPrincipal().getAttribute("sub");
        String accessToken =  userRepository.findByGoogleID(googleID)
                .map(UserEntity::getAccessToken)
                .orElseThrow(() -> new IllegalArgumentException("Access token not found for the user."));
        logger.info("Access token: " + accessToken);
        return accessToken;
    }

    private UserEntity getUserFromPrincipal(OAuth2User principal) {
        return userRepository.findByEmail(principal.getAttribute("email"))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @GetMapping("/user/calendar-events")
    public List<CalendarEvent> getUpcomingEvents(Authentication authentication) {
        String accessToken = getAccessToken(authentication);
        return calendarService.getEvents(accessToken);
    }

    @DeleteMapping("/user/calendar-events/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable String eventId, Authentication authentication) {
        String accessToken = getAccessToken(authentication);
        eventDetailsRepository.findByEventID(eventId)
                .ifPresent(eventDetails -> eventDetailsRepository.delete(eventDetails));
        calendarService.deleteEvent(accessToken, eventId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/user/calendar-events/{eventId}")
    public ResponseEntity<CalendarEvent> updateEvent(
            @PathVariable String eventId,
            @RequestBody CalendarEvent updatedEvent,
            @AuthenticationPrincipal OAuth2User principal,
            Authentication authentication) {

        String accessToken = getAccessToken(authentication);
        UserEntity user = getUserFromPrincipal(principal);
        CalendarEvent updatedEventResult = calendarService.updateEventWithCategoryAndDuration(user, accessToken, eventId, updatedEvent);
        return ResponseEntity.ok(updatedEventResult);
    }

    @PostMapping("/user/calendar-events")
    public ResponseEntity<CalendarEvent> createEvent(
            @RequestBody CalendarEvent newEvent,
            @AuthenticationPrincipal OAuth2User principal,
            Authentication authentication) {

        String accessToken = getAccessToken(authentication);
        UserEntity user = getUserFromPrincipal(principal);
        CalendarEvent createdEvent = calendarService.createEventWithCategoryAndDuration(user, accessToken, newEvent);
        return ResponseEntity.ok(createdEvent);
    }

}
