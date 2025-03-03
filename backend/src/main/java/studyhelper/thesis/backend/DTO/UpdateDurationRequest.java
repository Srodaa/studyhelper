package studyhelper.thesis.backend.DTO;

public class UpdateDurationRequest {

    private String subject;
    private int elapsedSeconds;

    public UpdateDurationRequest() {}

    public UpdateDurationRequest(String subject, int elapsedSeconds) {
        this.subject = subject;
        this.elapsedSeconds = elapsedSeconds;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public int getElapsedSeconds() {
        return elapsedSeconds;
    }

    public void setElapsedSeconds(int elapsedSeconds) {
        this.elapsedSeconds = elapsedSeconds;
    }
}
