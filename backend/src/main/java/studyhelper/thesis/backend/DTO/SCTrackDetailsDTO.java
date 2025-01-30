package studyhelper.thesis.backend.DTO;

public class SCTrackDetailsDTO {
    private String title;
    private String username;
    private String permalinkUrl;
    private String extractStreamUrl;

    public SCTrackDetailsDTO(String title, String username, String permalinkUrl, String streamUrl) {
        this.title = title;
        this.username = username;
        this.permalinkUrl = permalinkUrl;
        this.extractStreamUrl = streamUrl;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPermalinkUrl() {
        return permalinkUrl;
    }

    public void setPermalinkUrl(String permalinkUrl) {
        this.permalinkUrl = permalinkUrl;
    }

    public String getExtractStreamUrl() {
        return extractStreamUrl;
    }

    public void setExtractStreamUrl(String extractStreamUrl) {
        this.extractStreamUrl = extractStreamUrl;
    }
}
