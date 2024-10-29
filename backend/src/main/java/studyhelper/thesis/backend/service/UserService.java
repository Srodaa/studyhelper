package studyhelper.thesis.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import studyhelper.thesis.backend.entity.UserEntity;
import studyhelper.thesis.backend.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public UserEntity findByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserEntity saveUserIfNotExists(String email, String name, String password, String googleID, String accessToken) {
        return userRepository.findByGoogleID(googleID).orElseGet(() -> {
            UserEntity user = new UserEntity();
            user.setEmail(email);
            user.setName(name);
            user.setPassword(password);
            user.setGoogleID(googleID);
            user.setAccessToken(accessToken);
            return userRepository.save(user);
        });
    }

}
