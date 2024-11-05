package studyhelper.thesis.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studyhelper.thesis.backend.entity.EventDetailsEntity;

import java.util.Optional;

public interface EventDetailsRepository extends JpaRepository<EventDetailsEntity, Long> {
    Optional<EventDetailsEntity> findByEventID(String eventID);
}
