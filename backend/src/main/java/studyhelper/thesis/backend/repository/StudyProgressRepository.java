package studyhelper.thesis.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import studyhelper.thesis.backend.entity.StudyProgressEntity;
import studyhelper.thesis.backend.entity.UserEntity;

import java.util.Optional;

@Repository
public interface StudyProgressRepository extends JpaRepository<StudyProgressEntity, Long> {
    Optional<StudyProgressEntity> findByUserAndCategory(UserEntity user, String category);
}
