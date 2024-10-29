package studyhelper.thesis.backend.entity;

import java.util.List;

public class CalendarEventsResponse {
    private List<CalendarEvent> items;

    public List<CalendarEvent> getItems() {
        return items;
    }

    public void setItems(List<CalendarEvent> items) {
        this.items = items;
    }
}