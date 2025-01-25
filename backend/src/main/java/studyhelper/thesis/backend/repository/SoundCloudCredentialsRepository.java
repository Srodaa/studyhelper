package studyhelper.thesis.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studyhelper.thesis.backend.entity.SoundCloudCredentialsEntity;

public interface SoundCloudCredentialsRepository extends JpaRepository<SoundCloudCredentialsEntity, String> {
}
