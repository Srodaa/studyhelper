import axios from "axios";
import { CalendarEvent } from "@/types";

export const fetchEvents = async (
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    const response = await axios.get(
      "http://localhost:8080/user/calendar-events",
      {
        withCredentials: true
      }
    );
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
) => {
  try {
    await axios.delete(
      `http://localhost:8080/user/calendar-events/${eventId}`,
      {
        withCredentials: true,
        timeout: 5000
      }
    );
    closeDialog();
    fetchEvents(setEvents, setLoading);
  } catch (error) {
    console.error("Error deleting event: ", error);
  }
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
) => {
  const esemenyNeve = document.getElementById(
    "esemenyNeve"
  ) as HTMLInputElement;
  if (esemenyNeve) {
    console.log("Az esemény új neve: " + esemenyNeve.value);
  } else {
    console.error("Az esemenyNeve nem található.");
  }

  if (currentEvent?.id) {
    const startDateTime = new Date(currentEvent.start);
    const endDateTime = new Date(currentEvent.end);
    const combinatedStart = getCombinatedDateTime(
      eventStartDatePicker,
      eventStartTimeValue,
      startDateTime
    );
    const combinatedEnd = getCombinatedDateTime(
      eventEndDatePicker,
      eventEndTimeValue,
      endDateTime
    );

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
        duration: duration
      };

      console.log(updatedEvent);
      const response = await axios.put(
        `http://localhost:8080/user/calendar-events/${currentEvent.id}`,
        updatedEvent,
        {
          withCredentials: true,
          timeout: 5000
        }
      );
      console.log("Sikeres eseményfrissítés!", response.data);
      closeDialog();
      fetchEvents(setEvents, setLoading);
    } catch (error) {
      console.error("Hiba történt az esemény frissítése során: ", error);
    }
  }
};

export const getCombinatedDateTime = (
  datePicker: Date | undefined,
  timeValue: string,
  defaultDate: Date
) => {
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
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  closeDialog: () => void
) => {
  setLoading(true);
  const eventData = {
    ...newEvent,
    category: category,
    duration: duration
  };

  console.log("eventData: ", eventData);
  try {
    const response = await axios.post(
      "http://localhost:8080/user/calendar-events",
      eventData,
      {
        withCredentials: true,
        timeout: 5000
      }
    );
    const createdEvent = response.data;
    setEvents((prevEvents) => [...prevEvents, createdEvent]);
    closeDialog();
    console.log("Event created.");
  } catch (error) {
    console.error("Error creating event: ", error);
  } finally {
    setLoading(false);
  }
};
