package studyhelper.thesis.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import studyhelper.thesis.backend.DTO.SCTrackDetailsDTO;
import studyhelper.thesis.backend.entity.SoundCloudCredentialsEntity;
import studyhelper.thesis.backend.repository.SoundCloudCredentialsRepository;
import studyhelper.thesis.backend.service.SoundCloudService;


@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
public class SoundCloudController {

    @Autowired
    private SoundCloudCredentialsRepository scRepository;

    @Autowired
    private SoundCloudService scService;

    @Autowired
    private SoundCloudCredentialsRepository credentialsRepository;
    public SoundCloudController(SoundCloudCredentialsRepository scRepository) {
        this.scRepository = scRepository;
    }

    @GetMapping("/soundcloud/accessToken")
    public ResponseEntity<String> getAccessToken() {
        try {
            SoundCloudCredentialsEntity sc = scRepository.findById("SOUNDCLOUD")
                    .orElseThrow(() -> new IllegalArgumentException("SoundCloud credentials not found"));
            String accessToken = sc.getAccessToken();
            return ResponseEntity.ok(accessToken);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Hiba történt a token lekérdezése során.");
        }
    }

    @GetMapping("/soundcloud/getStreamUrl/{trackId}")
    public ResponseEntity<SCTrackDetailsDTO> getTrackDetails(@PathVariable String trackId) {
        String accessToken = credentialsRepository.findScAccessTokenById("SOUNDCLOUD");

        if (accessToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        try {
            SCTrackDetailsDTO trackDetails = scService.getTrackDetails(trackId, accessToken);
            return ResponseEntity.ok(trackDetails);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
