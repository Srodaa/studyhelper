package studyhelper.thesis.backend.component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import studyhelper.thesis.backend.service.UserService;

import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    @Autowired
    private UserService userService;



    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User = token.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String googleID = oAuth2User.getAttribute("sub");
        userService.saveUserIfNotExists(email, name, null, googleID);

        String redirectURL = "http://localhost:5173/home";
        getRedirectStrategy().sendRedirect(request, response, redirectURL);
        super.onAuthenticationSuccess(request, response, authentication);
    }

}
