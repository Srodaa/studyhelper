package studyhelper.thesis.backend.DTO;

import java.util.Objects;

public class StudyProgressDTO {
    private String subject;
    private int elapsedTime;

    public StudyProgressDTO() {
    }

    public StudyProgressDTO(String subject, int elapsedTime) {
        this.subject = subject;
        this.elapsedTime = elapsedTime;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
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
        return elapsedTime == that.elapsedTime && Objects.equals(subject, that.subject);
    }

    @Override
    public int hashCode() {
        return Objects.hash(subject, elapsedTime);
    }
}
