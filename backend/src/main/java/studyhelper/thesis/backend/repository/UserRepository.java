package studyhelper.thesis.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studyhelper.thesis.backend.entity.UserEntity;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long>{
    Optional<UserEntity> findByEmail(String email);
    Optional<UserEntity> findByGoogleID(String googleID);
}
