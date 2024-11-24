package studyhelper.thesis.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import studyhelper.thesis.backend.entity.StudyProgressEntity;
import studyhelper.thesis.backend.entity.UserEntity;
import studyhelper.thesis.backend.repository.StudyProgressRepository;

@Service
public class StudyProgressService {

    @Autowired
    private StudyProgressRepository studyProgressRepository;

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
}
