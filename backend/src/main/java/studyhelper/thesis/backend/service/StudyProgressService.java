package studyhelper.thesis.backend.service;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import studyhelper.thesis.backend.DTO.StudyProgressDTO;
import studyhelper.thesis.backend.entity.EventDetailsEntity;
import studyhelper.thesis.backend.entity.StudyProgressEntity;
import studyhelper.thesis.backend.entity.UserEntity;
import studyhelper.thesis.backend.repository.EventDetailsRepository;
import studyhelper.thesis.backend.repository.StudyProgressRepository;
import studyhelper.thesis.backend.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudyProgressService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StudyProgressRepository studyProgressRepository;
    @Autowired
    private EventDetailsRepository eventDetailsRepository;

    public void saveStudyProgress(UserEntity user, String category, int elapsedTime) {
        StudyProgressEntity progress = studyProgressRepository.findByUserAndCategory(user, category)
                .orElseGet(() -> {
                    StudyProgressEntity newProgress = new StudyProgressEntity();
                    newProgress.setUser(user);
                    newProgress.setCategory(category);
                    newProgress.setElapsedTime(0);
                    return newProgress;
                });

        progress.setElapsedTime(progress.getElapsedTime() + elapsedTime);
        studyProgressRepository.save(progress);
    }

    public List<StudyProgressDTO> getCategoriesAndTimeForUser(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<StudyProgressEntity> studyProgressList = studyProgressRepository.findByUser(user);

        return studyProgressList.stream()
                .collect(Collectors.groupingBy(
                        StudyProgressEntity::getCategory,
                        Collectors.summingInt(StudyProgressEntity::getElapsedTime)
                ))
                .entrySet().stream()
                .map(entry -> new StudyProgressDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void setCategoryToDefault(String eventId){
        EventDetailsEntity event = eventDetailsRepository.findByEventID(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with ID: " + eventId));
        event.setCategory("Default");
        eventDetailsRepository.save(event);
    }
}
