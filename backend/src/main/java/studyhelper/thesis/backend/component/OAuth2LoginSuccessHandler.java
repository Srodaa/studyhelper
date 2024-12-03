package studyhelper.thesis.backend.component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import studyhelper.thesis.backend.service.UserService;

import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private UserService userService;

    private static final String REDIRECT_URL = "http://localhost:5173/home";

    @Autowired
    private final OAuth2AuthorizedClientService authorizedClientService;

    public OAuth2LoginSuccessHandler(UserService userService, OAuth2AuthorizedClientService authorizedClientService) {
        this.userService = userService;
        this.authorizedClientService = authorizedClientService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        if (authentication instanceof OAuth2AuthenticationToken token) {
            handleOAuth2Authentication(token, request, response);
        } else {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication required");
        }
    }

    private void handleOAuth2Authentication(OAuth2AuthenticationToken token,HttpServletRequest request, HttpServletResponse response) throws IOException {
        String email = token.getPrincipal().getAttribute("email");
        String name = token.getPrincipal().getAttribute("name");
        String googleID = token.getPrincipal().getAttribute("sub");

        OAuth2AuthorizedClient authorizedClient = authorizedClientService.loadAuthorizedClient(
                token.getAuthorizedClientRegistrationId(), token.getName()
        );

        String accessToken = authorizedClient.getAccessToken().getTokenValue();
        String refreshToken = null;
        if (authorizedClient.getRefreshToken() != null)
            refreshToken = authorizedClient.getRefreshToken().getTokenValue();

        userService.saveUserIfNotExists(email, name, googleID, accessToken, refreshToken);

        userService.updateAccessToken(googleID, accessToken);

        getRedirectStrategy().sendRedirect(request, response, REDIRECT_URL);
    }

}
