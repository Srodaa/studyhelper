package studyhelper.thesis.backend.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LogoutController {
    @PostMapping("/logout")
    public void logout(HttpServletResponse response) {
        SecurityContextHolder.clearContext();
        response.addCookie(new Cookie("JSESSIONID", null));
        response.setStatus(HttpServletResponse.SC_OK);
    }
}