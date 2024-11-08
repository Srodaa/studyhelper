package studyhelper.thesis.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import studyhelper.thesis.backend.entity.EventDetailsEntity;

import java.util.List;
import java.util.Optional;

public interface EventDetailsRepository extends JpaRepository<EventDetailsEntity, Long> {
    Optional<EventDetailsEntity> findByEventID(String eventID);

    @Query("SELECT DISTINCT e.category FROM EventDetailsEntity e WHERE e.user.id = :userId")
    List<String> findCategoriesByUserId(@Param("userId") Long userId);

    EventDetailsEntity findByCategory(String category);
}
