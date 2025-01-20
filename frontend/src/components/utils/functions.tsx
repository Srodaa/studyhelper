import axios from "axios";
import { CalendarEvent, StudyProgressDTO } from "@/types";

export const fetchEvents = async (
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    const response = await axios.get("http://localhost:8080/user/calendar-events", {
      withCredentials: true
    });
    setEvents(response.data);
  } catch (err) {
    console.error("Error fetching events: ", err);
  } finally {
    setLoading(false);
  }
};

export const handleDeleteEvent = async (
  eventId: string | undefined,
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  closeDialog: () => void
): Promise<{ status: number }> => {
  try {
    const response = await axios.delete(`http://localhost:8080/user/calendar-events/${eventId}`, {
      withCredentials: true,
      timeout: 5000
    });
    closeDialog();
    fetchEvents(setEvents, setLoading);
    if (response.status === 204) {
      // 204, mert No Content-et ad vissza.
      return { status: 204 };
    } else {
      return { status: response.status };
    }
  } catch (error) {
    console.error("Error deleting event: ", error);
  }
  return { status: 500 };
};

export const handleSaveChanges = async (
  currentEvent: CalendarEvent | undefined,
  eventStartDatePicker: Date | undefined,
  eventStartTimeValue: string,
  eventEndDatePicker: Date | undefined,
  eventEndTimeValue: string,
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  closeDialog: () => void,
  category: string,
  duration: number
): Promise<{ status: number }> => {
  const esemenyNeve = document.getElementById("esemenyNeve") as HTMLInputElement;
  if (esemenyNeve) {
    console.log("Az esemény új neve: " + esemenyNeve.value);
  } else {
    console.error("Az esemenyNeve nem található.");
  }

  if (currentEvent?.id) {
    const startDateTime = new Date(currentEvent.start.dateTime);
    const endDateTime = new Date(currentEvent.end.dateTime);
    const combinatedStart = getCombinatedDateTime(eventStartDatePicker, eventStartTimeValue, startDateTime);
    const combinatedEnd = getCombinatedDateTime(eventEndDatePicker, eventEndTimeValue, endDateTime);

    try {
      const updatedEvent: CalendarEvent = {
        id: currentEvent.id,
        summary: esemenyNeve.value || currentEvent.summary,
        location: currentEvent.location || undefined,
        description: currentEvent.description || undefined,
        start: {
          dateTime: combinatedStart || startDateTime.toISOString()
        },
        end: {
          dateTime: combinatedEnd || endDateTime.toISOString()
        },
        category: category,
        duration: duration,
        defaultDuration: duration
      };

      console.log(updatedEvent);
      const response = await axios.put(`http://localhost:8080/user/calendar-events/${currentEvent.id}`, updatedEvent, {
        withCredentials: true,
        timeout: 5000
      });
      console.log("Sikeres eseményfrissítés!", response.data);
      closeDialog();
      fetchEvents(setEvents, setLoading);
      if (response.status === 200) {
        return { status: 200 };
      } else {
        return { status: response.status };
      }
    } catch (error) {
      console.error("Hiba történt az esemény frissítése során: ", error);
    }
  }
  return { status: 400 };
};

export const getCombinatedDateTime = (datePicker: Date | undefined, timeValue: string, defaultDate: Date) => {
  if (datePicker) {
    const date = new Date(datePicker);
    const [selectedHourString, selectedMinuteString] = timeValue.split(":");
    const selectedHour: number = parseInt(selectedHourString, 10);
    const selectedMinute: number = parseInt(selectedMinuteString, 10);
    date.setHours(selectedHour, selectedMinute);
    return date.toISOString();
  }
  return defaultDate.toISOString();
};

export const handleCreateEvent = async (
  newEvent: CalendarEvent,
  category: string,
  duration: number,
  defaultDuration: number,
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  closeDialog: () => void
): Promise<{ status: number }> => {
  setLoading(true);
  const eventData = {
    ...newEvent,
    category: category,
    duration: duration
  };

  console.log("eventData: ", eventData);
  try {
    const response = await axios.post("http://localhost:8080/user/calendar-events", eventData, {
      withCredentials: true,
      timeout: 5000
    });
    const createdEvent = response.data;
    setEvents((prevEvents) => [...prevEvents, createdEvent]);
    closeDialog();
    console.log("Event created.");
    return { status: response.status };
  } catch (error) {
    console.error("Error creating event: ", error);
    return { status: 500 };
  } finally {
    setLoading(false);
  }
};

export const getEventCategoryAndDuration = async (eventId: string): Promise<CalendarEvent> => {
  try {
    const response = await axios.get<CalendarEvent>(`/user/calendar-events/${eventId}/details`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Ehhez az eventhez nincs társítva kategória és tervezett tanulási idő!", error);
    throw error;
  }
};

export const getAllCategories = async (): Promise<string[]> => {
  try {
    const response = await axios.get("/user/categories");
    return response.data;
  } catch (error) {
    console.error("Hiba a kategóriák lekérésekor:", error);
    throw error;
  }
};

export async function updateDatabaseDuration(category: string, elapsedSeconds: number): Promise<void> {
  try {
    if (!category || elapsedSeconds <= 0) {
      console.error("Hibás paraméterek az adatbázis frissítéséhez. ", category + " " + elapsedSeconds);
      return;
    }

    const response = await fetch("/user/updateDuration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        category,
        elapsedSeconds
      })
    });
    if (!response.ok) {
      throw new Error("Hiba az adatbázis frissítése során.");
    }
    console.log("Az adatbázis sikeresen frissítve.");
  } catch (error) {
    console.error("Nem sikerült frissíteni az adatbázist:", error);
  }
}

export async function saveStudyProgress(category: string, elapsedTime: number): Promise<void> {
  try {
    if (!category || elapsedTime <= 0) {
      console.error("Hibás paraméterek a tanulási statisztika elküldéséhez:", category, elapsedTime);
      return;
    }

    const response = await fetch("/user/studyProgress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        category,
        elapsedTime
      })
    });

    if (!response.ok) {
      throw new Error("Hiba a statisztikák mentése közben.");
    }

    console.log("Az előrehaladás sikeresen lementve.", category, elapsedTime);
  } catch (error) {
    console.error("Hiba a statisztikák mentése közben:", error);
  }
}

export const fetchStudyStatistics = async (): Promise<StudyProgressDTO[] | null> => {
  try {
    const response = await axios.get("/user/getStudyProgress");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch categories and time:", error);
    throw error;
  }
};
