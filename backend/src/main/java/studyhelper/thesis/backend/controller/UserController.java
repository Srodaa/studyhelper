package studyhelper.thesis.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import studyhelper.thesis.backend.entity.CalendarEvent;
import studyhelper.thesis.backend.service.CalendarService;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;


import java.util.List;
import java.util.Map;

@RestController
public class UserController {

    @Autowired
    private CalendarService calendarService;

    @Autowired
    private OAuth2AuthorizedClientService authorizedClientService;

    @GetMapping("/user-info")
    public Map<String, Object> user(@AuthenticationPrincipal OAuth2User principal){
        return principal.getAttributes();
    }

    @GetMapping("/user/calendar-events")
    public List<CalendarEvent> getUpcomingEvents(@AuthenticationPrincipal OAuth2User principal, Authentication authentication) {
        OAuth2AuthenticationToken oAuth2Token = (OAuth2AuthenticationToken) authentication;
        OAuth2AuthorizedClient authorizedClient = authorizedClientService.loadAuthorizedClient(
                oAuth2Token.getAuthorizedClientRegistrationId(),
                oAuth2Token.getName()
        );

        String accessToken = authorizedClient.getAccessToken().getTokenValue();

        return calendarService.getEvents(accessToken);
    }
}
