import axios from "axios";
import React, { useEffect, useState } from "react";
import { CalendarEvent } from "../types"; // Importáld a CalendarEvent típust
import FullCalendar from "@fullcalendar/react"; // FullCalendar komponens
import dayGridPlugin from "@fullcalendar/daygrid"; // Naptár nézetek
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // Esemény interakciók
import Modal from "react-modal"; // Modal for editing or creating events
import styles from "../styles/calendar.module.css";

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] =
    useState<Partial<CalendarEvent> | null>(null);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/user/calendar-events",
        {
          withCredentials: true,
        }
      );
      setEvents(response.data);
    } catch (err) {
      setError("Hiba történt az események betöltésekor.");
      console.error("Error fetching events: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    const interval = setInterval(fetchEvents, 300000); //5 perc
    return () => clearInterval(interval);
  }, []);

  const handleDeleteEvent = async (eventId: string | undefined) => {
    try {
      await axios.delete(
        `http://localhost:8080/user/calendar-events/${eventId}`,
        {
          withCredentials: true,
          timeout: 5000, // 5-second timeout for testing
        }
      );
      closeModal();
      fetchEvents(); // Refresh events after deletion
    } catch (error) {
      console.error("Error deleting event: ", error);
    }
  };
  
  const openModal = (eventInfo: any) => {
    setCurrentEvent({
      id: eventInfo.event.id,
      summary: eventInfo.event.title,
      start: eventInfo.event.start,
      end: eventInfo.event.end,
      description: eventInfo.event.extendedProps.description,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentEvent(null);
  };

  if (loading) {
    return <div>Betöltés...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const eventList = events.map((event) => ({
    id: event.id,
    title: event.summary,
    start: event.start.dateTime,
    end: event.end.dateTime,
    location: event.location,
    description: event.description,
  }));

  const renderEventContent = (eventInfo: any) => {
    const startTime = eventInfo.event.start
      ? new Date(eventInfo.event.start).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";
    const endTime = eventInfo.event.end
      ? new Date(eventInfo.event.end).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";
    return (
      <div onClick={() => openModal(eventInfo)}>
        <b>
          {startTime} - {endTime} {eventInfo.id}
        </b>
        <br></br>
        <b className="text-center">{eventInfo.event.title}</b>
        <div>{eventInfo.event.extendedProps.description}</div>
      </div>
    );
  };

  return (
    <div className={styles.calendar}>
      <h2>Közelgő Események</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={eventList}
        editable={true}
        selectable={true}
        eventContent={renderEventContent}
        height="auto"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
      />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Event Modal"
      >
        <h2>Esemény részletei</h2>
        <p>{currentEvent?.summary}</p>
        <button onClick={() => handleDeleteEvent(currentEvent?.id)}>
          Törlés
        </button>
        <button onClick={closeModal}>Bezárás</button>
      </Modal>
    </div>
  );
};

export default Calendar;
