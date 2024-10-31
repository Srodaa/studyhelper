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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar as SmallCalendar } from "@/components/ui/smallcalendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { format } from "date-fns";

const Calendarr: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] =
    useState<Partial<CalendarEvent> | null>(null);
  const [eventName, setEventName] = useState<string>(
    currentEvent?.summary || ""
  ); //Esemény nevének a szerkesztéséhez kell
  const [eventStartDatePicker, setEventStartDatePicker] =
    React.useState<Date>();
  const [eventEndDatePicker, setEventEndDatePicker] = React.useState<Date>();
  const [eventStartTimeValue, setEventStartTimeValue] =
    useState<string>("10:00");
  const [eventEndTimeValue, setEventEndTimeValue] = useState<string>("00:00");
  //Lekérdezi az eseményeket
  const fetchEvents = async () => {
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
  //5 percenként újra lekérdezi az eseményeket.
  useEffect(() => {
    fetchEvents();

    const interval = setInterval(fetchEvents, 300000); // 5 perc
    return () => clearInterval(interval);
  }, []);

  //Az esemény törlése
  const handleDeleteEvent = async (eventId: string | undefined) => {
    try {
      await axios.delete(
        `http://localhost:8080/user/calendar-events/${eventId}`,
        {
          withCredentials: true,
          timeout: 5000 // 5 másodperces időtúllépés teszteléshez
        }
      );
      closeDialog();
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event: ", error);
    }
  };
  //Szerkesztésnél a változtatások mentése
  const handleSaveChanges = async () => {
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

      //A dátum és idő kombinációja
      //Először a START
      const startDatum = new Date(eventStartDatePicker);
      const [selectedStartHourString, selectedStartMinuteString] =
        eventStartTimeValue.split(":");
      const selectedStartHour: number = parseInt(selectedStartHourString, 10);
      const selectedStartMinute: number = parseInt(
        selectedStartMinuteString,
        10
      );
      startDatum.setHours(selectedStartHour, selectedStartMinute);
      const combinatedStart = startDatum.toISOString();
      //És most az END
      const endDatum = new Date(eventEndDatePicker);
      const [selectedEndHourString, selectedEndMinuteString] =
        eventEndTimeValue.split(":");
      const selectedEndHour: number = parseInt(selectedEndHourString, 10);
      const selectedEndMinute: number = parseInt(selectedEndMinuteString, 10);
      endDatum.setHours(selectedEndHour, selectedEndMinute);
      const combinatedEnd = endDatum.toISOString();

      try {
        const updatedEvent: CalendarEvent = {
          id: currentEvent.id,
          summary: esemenyNeve.value || currentEvent.summary,
          location: currentEvent.location || undefined,
          description: currentEvent.description || undefined,
          start: {
            dateTime: combinatedStart || startDateTime.toISOString() // ISO 8601 formátum
          },
          end: {
            dateTime: combinatedEnd || endDateTime.toISOString()
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
  //Dialog nyitása
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
  //Dialog zárása
  const closeDialog = () => {
    setDialogOpen(false);
    setCurrentEvent(null);
  };

  if (loading) {
    return <div>Betöltés...</div>;
  }

  const eventList = events.map((event) => ({
    id: event.id,
    title: event.summary,
    start: event.start.dateTime,
    end: event.end.dateTime,
    location: event.location,
    description: event.description
  }));
  //Beleteszi a naptárba
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
            <DialogTitle className="text-center">
              {currentEvent?.summary}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-center">
            esemény részletei
          </DialogDescription>

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
              <Label htmlFor="datePicker" className="text-right">
                Időpont
              </Label>
              <div className="flex-wrap">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !eventStartDatePicker && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon />
                      {eventStartDatePicker ? (
                        format(eventStartDatePicker, "PPP")
                      ) : (
                        <span>Kezdő dátum</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <SmallCalendar
                      mode="single"
                      selected={eventStartDatePicker}
                      onSelect={setEventStartDatePicker}
                      initialFocus
                    />
                    <Input
                      type="time"
                      value={eventStartTimeValue}
                      onChange={(e) => {
                        setEventStartTimeValue(e.target.value);
                        console.log(eventStartTimeValue);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !eventEndDatePicker && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon />
                      {eventEndDatePicker ? (
                        format(eventEndDatePicker, "PPP")
                      ) : (
                        <span>Vég dátum</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <SmallCalendar
                      mode="single"
                      selected={eventEndDatePicker}
                      onSelect={setEventEndDatePicker}
                      initialFocus
                    />
                    <Input
                      type="time"
                      value={eventEndTimeValue}
                      onChange={(e) => {
                        setEventEndTimeValue(e.target.value);
                        console.log(eventEndTimeValue);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => handleDeleteEvent(currentEvent?.id)}>
              Törlés
            </Button>
            <Button type="submit" onClick={handleSaveChanges}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Calendarr;
