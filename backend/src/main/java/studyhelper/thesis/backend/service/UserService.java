package studyhelper.thesis.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import studyhelper.thesis.backend.entity.UserEntity;
import studyhelper.thesis.backend.repository.UserRepository;

import java.util.List;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(TokenRefreshService.class);

    @Autowired
    private UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserEntity saveUserIfNotExists(String email, String name, String googleID, String accessToken, String refreshToken) {
        return userRepository.findByGoogleID(googleID).map(existingUser -> {
            boolean updated = false;
            if (!existingUser.getAccessToken().equals(accessToken)) {
                existingUser.setAccessToken(accessToken);
                updated = true;
                logger.info("Updated access token: {}", accessToken);
            }
            if (refreshToken != null && (existingUser.getRefreshToken() == null || !existingUser.getRefreshToken().equals(refreshToken))) {
                existingUser.setRefreshToken(refreshToken);
                updated = true;
                logger.info("Updated refresh token: {}", refreshToken);
            }
            if (updated) {
                logger.info("User updated");
                return userRepository.save(existingUser);
            } else {
                return existingUser;
            }
        }).orElseGet(() -> {
            UserEntity user = new UserEntity();
            user.setEmail(email);
            user.setName(name);
            user.setGoogleID(googleID);
            user.setAccessToken(accessToken);
            logger.info("Access token: {}", accessToken);
            if (refreshToken != null)
            {
                user.setRefreshToken(refreshToken);
                logger.info("Refresh token: {}", refreshToken);
            }
            return userRepository.save(user);
        });
    }

    public List<UserEntity> findAllUsers() {
        return userRepository.findAll();
    }

}
