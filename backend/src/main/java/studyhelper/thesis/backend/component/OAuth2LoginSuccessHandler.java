package studyhelper.thesis.backend.component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import studyhelper.thesis.backend.entity.CalendarEvent;
import studyhelper.thesis.backend.service.CalendarService;
import studyhelper.thesis.backend.service.UserService;

import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;

import java.io.IOException;
import java.util.List;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private UserService userService;

    @Autowired
    private CalendarService googleCalendarService;  // Új service a Calendar API-hoz

    @Autowired
    private OAuth2AuthorizedClientService authorizedClientService; // Injektálás


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        if (authentication == null || !(authentication instanceof OAuth2AuthenticationToken)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication required");
            return;
        }
        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User = token.getPrincipal();
        String email = token.getPrincipal().getAttribute("email");
        String name = token.getPrincipal().getAttribute("name");
        String googleID = token.getPrincipal().getAttribute("sub");

        // OAuth2AuthorizedClient betöltése
        OAuth2AuthorizedClient authorizedClient = authorizedClientService.loadAuthorizedClient(
                token.getAuthorizedClientRegistrationId(), token.getName()
        );

        // Access token lekérése
        String accessToken = authorizedClient.getAccessToken().getTokenValue();

        // Itt felhasználhatod az access token-t, pl. mentheted a felhasználóhoz
        // userService.saveUserIfNotExists(email, name, accessToken, googleID);

        userService.saveUserIfNotExists(email, name, null, googleID, accessToken);

        String redirectURL = "http://localhost:5173/home";
        getRedirectStrategy().sendRedirect(request, response, redirectURL);
        super.onAuthenticationSuccess(request, response, authentication);
    }
}
