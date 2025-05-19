package studyhelper.thesis.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import studyhelper.thesis.backend.entity.EventDetailsEntity;
import studyhelper.thesis.backend.entity.UserEntity;
import studyhelper.thesis.backend.repository.EventDetailsRepository;

@Service
public class EventDetailsService {

    @Autowired
    EventDetailsRepository eventDetailsRepository;

    @Transactional
    public void updateSubjectDuration(String subject, int elapsedSeconds, UserEntity user) {
        String subjectId = subject.split(",")[1];
        EventDetailsEntity eventDetails = eventDetailsRepository.findByEventIDAndUser(subjectId, user);
        if (eventDetails != null) {
            if (eventDetails.getDuration() < elapsedSeconds) {
                eventDetails.setDuration(0);
            } else {
                int updatedDuration = eventDetails.getDuration() - elapsedSeconds;
                eventDetails.setDuration(updatedDuration);
            }
            eventDetailsRepository.save(eventDetails);
        } else {
            throw new IllegalArgumentException("Nincs találat a tárgyhoz: " + subject); //Ilyen elv sose tud lenni.
        }
    }
}
