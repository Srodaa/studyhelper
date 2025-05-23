package studyhelper.thesis.backend.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CalendarEvent {
    private String id;
    private String summary;
    private String location;
    private String description;
    private Start start;
    private End end;
    @JsonProperty("subject")
    private String subject;
    @JsonProperty("duration")
    private int duration;
    @JsonProperty("defaultDuration")
    private int defaultDuration;

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Start getStart() {
        return start;
    }

    public void setStart(Start start) {
        this.start = start;
    }

    public End getEnd() {
        return end;
    }

    public void setEnd(End end) {
        this.end = end;
    }

    public static class Start {
        @JsonProperty("dateTime")
        private String dateTime; // ISO 8601 format

        public String getDateTime() {
            return dateTime;
        }

        public void setDateTime(String dateTime) {
            this.dateTime = dateTime;
        }
    }

    public static class End {
        @JsonProperty("dateTime")
        private String dateTime; // ISO 8601 format

        public String getDateTime() {
            return dateTime;
        }

        public void setDateTime(String dateTime) {
            this.dateTime = dateTime;
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getDefaultDuration() {
        return defaultDuration;
    }

    public void setDefaultDuration(int defaultDuration) {
        this.defaultDuration = defaultDuration;
    }
}