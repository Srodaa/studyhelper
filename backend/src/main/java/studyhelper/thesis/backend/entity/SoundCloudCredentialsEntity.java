package studyhelper.thesis.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "SoundCloudCredentials")
public class SoundCloudCredentialsEntity {
    @Id
    private String id = "SOUNDCLOUD";
    @Column(name = "SCAccessToken")
    private String accessToken;
    @Column(name = "SCRefreshToken")
    private String refreshToken;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}
