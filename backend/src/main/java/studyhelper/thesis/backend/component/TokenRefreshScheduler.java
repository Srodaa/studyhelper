package studyhelper.thesis.backend.component;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import studyhelper.thesis.backend.service.TokenRefreshService;
import studyhelper.thesis.backend.service.UserService;

@Component
public class TokenRefreshScheduler {
    @Autowired
    private UserService userService;

    @Autowired
    private TokenRefreshService tokenRefreshService;

    @Scheduled(fixedRate = 3000000) // 50 perc 3000000
    public void refreshAllTokens() {
        userService.findAllUsers().forEach(user -> {
            tokenRefreshService.refreshAccessToken(user.getGoogleID() ,user.getRefreshToken());
        });

        System.out.println("All access tokens refreshed");
    }

}
