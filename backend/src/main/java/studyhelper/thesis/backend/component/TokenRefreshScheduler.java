package studyhelper.thesis.backend.component;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import studyhelper.thesis.backend.service.SoundCloudCredentialsService;
import studyhelper.thesis.backend.service.TokenRefreshService;
import studyhelper.thesis.backend.service.UserService;

@Component
public class TokenRefreshScheduler {

    private static final Logger logger = LoggerFactory.getLogger(TokenRefreshScheduler.class);

    @Autowired
    private UserService userService;

    @Autowired
    private TokenRefreshService tokenRefreshService;

    @Autowired
    private SoundCloudCredentialsService soundCloudService;

    @Scheduled(fixedRate = 3000000) // 50 perc 3000000
    public void refreshAllTokens() {
        userService.findAllUsers().forEach(user -> {
            tokenRefreshService.refreshAccessToken(user.getGoogleID() ,user.getRefreshToken());
        });
        soundCloudService.getTokens();
        logger.info("All access tokens refreshed");
    }

}
