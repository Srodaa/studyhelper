package studyhelper.thesis.backend.controller;

import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import studyhelper.thesis.backend.DTO.UpdateDurationRequest;
import studyhelper.thesis.backend.entity.EventDetailsEntity;
import studyhelper.thesis.backend.entity.UserEntity;
import studyhelper.thesis.backend.repository.UserRepository;
import studyhelper.thesis.backend.service.CalendarService;
import studyhelper.thesis.backend.service.StudyProgressService;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
public class TimerController {

    private static final Logger logger = LoggerFactory.getLogger(TimerController.class);

    @Autowired
    private CalendarService calendarService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudyProgressService studyProgressService;

    public TimerController(CalendarService calendarService, UserRepository userRepository) {
        this.calendarService = calendarService;
        this.userRepository = userRepository;
    }

    private UserEntity getUserFromPrincipal(OAuth2User principal) {
        return userRepository.findByEmail(principal.getAttribute("email"))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @GetMapping("/user/calendar-events/{eventId}/details")
    public ResponseEntity<EventDetailsEntity> getEventSubjectAndDuration(@PathVariable String eventId, Authentication authentication) {
        EventDetailsEntity eventDetails = calendarService.fetchEventSubjectAndDuration(eventId, authentication);
        return ResponseEntity.ok(eventDetails);
    }

    @GetMapping("/user/subjects")
    public ResponseEntity<List<String>> getSubjects(@AuthenticationPrincipal OAuth2User principal) {
        try {
            UserEntity user = getUserFromPrincipal(principal);
            List<String> subjects = calendarService.getSubjectsByUser(user.getId());
            subjects = subjects.stream()
                    .filter(Objects::nonNull)
                    .filter(subject -> {
                        String subjectName = subject.split(",")[0];
                        return !"Default".equals(subjectName);
                    })
                    .collect(Collectors.toList());
            return ResponseEntity.ok(subjects);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }

    @PostMapping("/user/updateDuration")
    public ResponseEntity<String> updateDuration(@RequestBody UpdateDurationRequest request) {
        try {
            calendarService.updateSubjectDuration(request.getSubject(), request.getElapsedSeconds());
            logger.info("Subject " + request.getSubject() + " updated with " + request.getElapsedSeconds() + " seconds.");
            return ResponseEntity.ok("Az adatbázis sikeresen frissítve.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Hiba történt az adatbázis frissítése során.");
        }
    }

    @PutMapping("user/{eventId}/setSubjectToDefault")
    public ResponseEntity<String> setSubjectToDefault(@PathVariable String eventId){
        try {
            studyProgressService.setSubjectToDefault(eventId);
            return ResponseEntity.ok("Az esemény kategóriája sikeresen átállítva alapértelmezettre.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Az esemény nem található az adatbázisban.");
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Hiba történt.");
        }
    }

    @GetMapping("/user/compareDuration/{eventId}")
    public boolean compareDurations(@PathVariable String eventId){
        return studyProgressService.compareDurationWithDefault(eventId);
    }
}
