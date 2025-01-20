package studyhelper.thesis.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class EventDetailsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "eventID")
    private String eventID;
    @Column(name = "category")
    private String category;
    @Column(name = "duration")
    private Integer duration;
    @Column(name = "defaultDuration")
    private Integer defaultDuration;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;


    public void setUser(UserEntity user) {
        this.user = user;
    }

    public UserEntity getUser() {
        return user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEventID() {
        return eventID;
    }

    public void setEventID(String eventID) {
        this.eventID = eventID;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Integer getDefaultDuration() {
        return defaultDuration;
    }

    public void setDefaultDuration(Integer defaultDuration) {
        this.defaultDuration = defaultDuration;
    }
}
