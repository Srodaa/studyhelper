package studyhelper.thesis.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import studyhelper.thesis.backend.entity.EventDetailsEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventDetailsRepository extends JpaRepository<EventDetailsEntity, Long> {
    Optional<EventDetailsEntity> findByEventID(String eventID);

    @Query("SELECT e.subject, e.eventID FROM EventDetailsEntity e WHERE e.user.id = :userId")
    List<String> findSubjectsByUserId(@Param("userId") Long userId);

    EventDetailsEntity findBySubject(String subject);
}
