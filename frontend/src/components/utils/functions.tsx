import axios from "axios";
import { CalendarEvent, StudyProgressDTO, TrackDetailsDTO } from "@/types";

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
  subject: string,
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
        subject: subject,
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
  subject: string,
  duration: number,
  defaultDuration: number,
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  closeDialog: () => void
): Promise<{ status: number }> => {
  setLoading(true);
  const eventData = {
    ...newEvent,
    subject: subject,
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

export const getEventSubjectAndDuration = async (eventId: string): Promise<CalendarEvent> => {
  try {
    const response = await axios.get<CalendarEvent>(`/user/calendar-events/${eventId}/details`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Ehhez az eventhez nincs társítva kategória és tervezett tanulási idő!", error);
    throw error;
  }
};

export const getAllSubjects = async (): Promise<string[]> => {
  try {
    const response = await axios.get("/user/subjects");
    return response.data;
  } catch (error) {
    console.error("Hiba a kategóriák lekérésekor:", error);
    throw error;
  }
};

export async function updateDatabaseDuration(subject: string, elapsedSeconds: number): Promise<void> {
  try {
    subject = subject.split(",")[0];
    if (!subject || elapsedSeconds <= 0) {
      console.error("Hibás paraméterek az adatbázis frissítéséhez. ", subject + " " + elapsedSeconds);
      return;
    }
    const response = await axios.post("/user/updateDuration", {
      subject,
      elapsedSeconds
    });
    console.log("Az adatbázis duration mezője sikeresen frissítve.", response);
  } catch (error) {
    console.error("Nem sikerült frissíteni az adatbázist:", error);
  }
}

export async function saveStudyProgress(subject: string, elapsedTime: number): Promise<void> {
  try {
    if (!subject || elapsedTime <= 0) {
      console.error("Hibás paraméterek a tanulási statisztika elküldéséhez:", subject, elapsedTime);
      return;
    }

    const response = await fetch("/user/studyProgress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        subject,
        elapsedTime
      })
    });

    if (!response.ok) {
      throw new Error("Hiba a statisztikák mentése közben.");
    }

    console.log("Az előrehaladás sikeresen lementve. Tárgy: ", subject, " eltelt idő: ", elapsedTime);
  } catch (error) {
    console.error("Hiba a statisztikák mentése közben:", error);
  }
}

export const fetchStudyStatistics = async (): Promise<StudyProgressDTO[] | null> => {
  try {
    const response = await axios.get("/user/getStudyProgress");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch subjects and time:", error);
    throw error;
  }
};

export const updateSubjectToDefault = async (eventId: string): Promise<void> => {
  try {
    await axios.put(`/user/${eventId}/setSubjectToDefault`);
  } catch (error) {
    console.error("Failed to update the subject to Default: ", error);
    throw error;
  }
};

export const compareDurations = async (eventId: string): Promise<boolean> => {
  try {
    const response = await axios.get(`/user/compareDuration/${eventId}`);
    return response.data;
  } catch (error) {
    console.error("Error checking event durations: ", error);
    return false;
  }
};

export async function fetchUserData(setUser: (user: any) => void) {
  try {
    const response = await axios.get("http://localhost:8080/user-info", {
      withCredentials: true
    });
    setUser(response.data);
  } catch (error) {
    console.error("Error occurred: ", error);
  }
}

let abortController: AbortController | null = null; //Spam protection miatt megszakítjuk a kérést, ha újat küldünk a megérkezés előtt

export const getStreamUrl = async (trackId: string): Promise<TrackDetailsDTO> => {
  if (abortController) {
    abortController.abort();
  }
  abortController = new AbortController();
  const signal = abortController.signal;

  try {
    const response = await axios.get(`http://localhost:8080/soundcloud/getStreamUrl/${trackId}`, {
      withCredentials: true,
      signal
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("getStreamUrl error: ", error);
    throw error;
  }
};
