package studyhelper.thesis.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import studyhelper.thesis.backend.entity.UserEntity;
import studyhelper.thesis.backend.repository.UserRepository;

import java.util.List;

@Service
public class UserService {

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
                System.out.println("Updated access token: " + accessToken);
            }
            if (refreshToken != null && (existingUser.getRefreshToken() == null || !existingUser.getRefreshToken().equals(refreshToken))) {
                existingUser.setRefreshToken(refreshToken);
                updated = true;
                System.out.println("Updated refresh token: " + refreshToken);
            }
            if (updated) {
                System.out.println("User updated");
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
            System.out.println("Access token: " + accessToken);
            if (refreshToken != null)
            {
                user.setRefreshToken(refreshToken);
                System.out.println("Refresh token: " + refreshToken);
            }
            return userRepository.save(user);
        });
    }

    public List<UserEntity> findAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public void updateAccessToken(String googleID, String newAccessToken) {
        UserEntity user = userRepository.findByGoogleID(googleID)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setAccessToken(newAccessToken);
        userRepository.save(user);
    }
}
