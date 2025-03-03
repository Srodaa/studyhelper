package studyhelper.thesis.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import studyhelper.thesis.backend.DTO.StudyProgressDTO;
import studyhelper.thesis.backend.entity.UserEntity;
import studyhelper.thesis.backend.repository.UserRepository;
import studyhelper.thesis.backend.service.StudyProgressService;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
public class StudyProgressController {

    @Autowired
    private StudyProgressService studyProgressService;

    @Autowired
    private UserRepository userRepository;

    public StudyProgressController(StudyProgressService studyProgressService, UserRepository userRepository) {
        this.studyProgressService = studyProgressService;
        this.userRepository = userRepository;
    }

    private UserEntity getUserFromPrincipal(OAuth2User principal) {
        return userRepository.findByEmail(principal.getAttribute("email"))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @PostMapping("/user/studyProgress")
    public ResponseEntity<String> saveStudyProgress(@RequestBody StudyProgressDTO progressDTO, @AuthenticationPrincipal OAuth2User principal) {
        try {
            UserEntity user = getUserFromPrincipal(principal);
            studyProgressService.saveStudyProgress(user, progressDTO.getSubject(), progressDTO.getElapsedTime());
            return ResponseEntity.ok("Az előrehaladási statisztika sikeresen mentve.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Hiba történt a előrehaladási statisztika mentése során.");
        }
    }

    @GetMapping("/user/getStudyProgress")
    public List<StudyProgressDTO> getSubjectsAndTimeForUser(@AuthenticationPrincipal OAuth2User principal) {
        UserEntity user = getUserFromPrincipal(principal);
        return studyProgressService.getSubjectsAndTimeForUser(user.getEmail());
    }
}
