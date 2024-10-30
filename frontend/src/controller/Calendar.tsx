import axios from "axios";
import React, { useEffect, useState } from "react";
import { CalendarEvent } from "../types";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<CalendarEvent> | null>(null);
  const [eventName, setEventName] = useState<string>(currentEvent?.summary || "");

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:8080/user/calendar-events", {
        withCredentials: true
      });
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

    const interval = setInterval(fetchEvents, 300000); // 5 perc
    return () => clearInterval(interval);
  }, []);

  const handleDeleteEvent = async (eventId: string | undefined) => {
    try {
      await axios.delete(`http://localhost:8080/user/calendar-events/${eventId}`, {
        withCredentials: true,
        timeout: 5000 // 5 másodperces időtúllépés teszteléshez
      });
      closeDialog();
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event: ", error);
    }
  };

  const handleSaveChanges = async () => {
    const esemenyNeve = document.getElementById("esemenyNeve") as HTMLInputElement;
    if (esemenyNeve) {
      console.log("Az esemény új neve: " + esemenyNeve.value);
    } else {
      console.error("Az esemenyNeve nem található.");
    }

    if (currentEvent?.id) {
      const startDateTime = new Date(currentEvent.start); // Hiába húzza alá sose lesz undefinied. Legalábbis még nem tud lenni, mert nem a felhasználó adja meg.
      const endDateTime = new Date(currentEvent.end);

      try {
        const updatedEvent: CalendarEvent = {
          id: currentEvent.id,
          summary: esemenyNeve.value || currentEvent.summary,
          location: currentEvent.location || undefined,
          description: currentEvent.description || undefined,
          start: {
            dateTime: startDateTime.toISOString(), // ISO 8601 formátum
            timeZone: "Europe/Budapest"
          },
          end: {
            dateTime: endDateTime.toISOString(),
            timeZone: "Europe/Budapest"
          }
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
        fetchEvents();
      } catch (error) {
        console.error("Hiba történt az esemény frissítése során: ", error);
      }
    }
  };

  const openDialog = (eventInfo: any) => {
    setCurrentEvent({
      id: eventInfo.event.id,
      summary: eventInfo.event.title,
      start: eventInfo.event.start,
      end: eventInfo.event.end,
      description: eventInfo.event.extendedProps.description
    });
    setDialogOpen(true);
    console.log("Dialog opening..."); // Teszt
  };

  const closeDialog = () => {
    setDialogOpen(false);
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
    description: event.description
  }));

  const renderEventContent = (eventInfo: any) => {
    const startTime = eventInfo.event.start
      ? new Date(eventInfo.event.start).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      : "";
    const endTime = eventInfo.event.end
      ? new Date(eventInfo.event.end).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      : "";
    return (
      <div onClick={() => openDialog(eventInfo)}>
        <b>
          {startTime} - {endTime} {eventInfo.id}
        </b>
        <br />
        <b className="text-center">{eventInfo.event.title}</b>
        <div>{eventInfo.event.extendedProps.description}</div>
      </div>
    );
  };

  return (
    <>
      <h2 className="text-orange-950">Közelgő Események</h2>
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
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        }}
      />

      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">{currentEvent?.summary}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-center">esemény részletei</DialogDescription>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Esemény neve
              </Label>
              <Input
                id="esemenyNeve"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => handleDeleteEvent(currentEvent?.id)}>Törlés</Button>
            <Button type="submit" onClick={handleSaveChanges}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Calendar;
