package studyhelper.thesis.backend.DTO;

import java.util.Objects;

public class StudyProgressDTO {
    private String category;
    private int elapsedTime;

    public StudyProgressDTO() {
    }

    public StudyProgressDTO(String category, int elapsedTime) {
        this.category = category;
        this.elapsedTime = elapsedTime;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getElapsedTime() {
        return elapsedTime;
    }

    public void setElapsedTime(int elapsedTime) {
        this.elapsedTime = elapsedTime;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        StudyProgressDTO that = (StudyProgressDTO) o;
        return elapsedTime == that.elapsedTime && Objects.equals(category, that.category);
    }

    @Override
    public int hashCode() {
        return Objects.hash(category, elapsedTime);
    }
}
