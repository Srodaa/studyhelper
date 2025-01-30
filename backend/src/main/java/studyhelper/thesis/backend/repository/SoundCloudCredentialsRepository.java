package studyhelper.thesis.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import studyhelper.thesis.backend.entity.SoundCloudCredentialsEntity;

public interface SoundCloudCredentialsRepository extends JpaRepository<SoundCloudCredentialsEntity, String> {

    @Query("SELECT s.accessToken FROM SoundCloudCredentialsEntity s WHERE s.id = :id")
    String findScAccessTokenById(@Param("id") String id);

}
