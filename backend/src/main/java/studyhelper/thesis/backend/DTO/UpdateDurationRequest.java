package studyhelper.thesis.backend.DTO;

public class UpdateDurationRequest {

    private String category;
    private int elapsedSeconds;

    public UpdateDurationRequest() {}

    public UpdateDurationRequest(String category, int elapsedSeconds) {
        this.category = category;
        this.elapsedSeconds = elapsedSeconds;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getElapsedSeconds() {
        return elapsedSeconds;
    }

    public void setElapsedSeconds(int elapsedSeconds) {
        this.elapsedSeconds = elapsedSeconds;
    }
}
