package studyhelper.thesis.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import studyhelper.thesis.backend.entity.EventDetailsEntity;
import studyhelper.thesis.backend.repository.EventDetailsRepository;

@Service
public class EventDetailsService {

    @Autowired
    EventDetailsRepository eventDetailsRepository;

    @Transactional
    public void updateCategoryDuration(String category, int elapsedSeconds) {
        EventDetailsEntity eventDetails = eventDetailsRepository.findByCategory(category);
        if (eventDetails != null) {
            int updatedDuration = eventDetails.getDuration() - elapsedSeconds;
            eventDetails.setDuration(updatedDuration);
            eventDetailsRepository.save(eventDetails);
        } else {
            throw new IllegalArgumentException("Nincs találat a kategóriához: " + category); //Ilyen elv sose tud lenni.
        }
    }
}
