package studyhelper.thesis.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import studyhelper.thesis.backend.entity.EventDetailsEntity;

import java.util.List;
import java.util.Optional;

public interface EventDetailsRepository extends JpaRepository<EventDetailsEntity, Long> {
    Optional<EventDetailsEntity> findByEventID(String eventID);

    @Query("SELECT DISTINCT e.category FROM EventDetailsEntity e")
    List<String> findAllCategories();

    EventDetailsEntity findByCategory(String category);
}
