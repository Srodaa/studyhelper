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
import {
  fetchEvents,
  handleDeleteEvent,
  handleSaveChanges,
  handleCreateEvent,
  getCombinatedDateTime
} from "@/components/utils/functions";

const Calendar: React.FC = () => {
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
  const [eventEndTimeValue, setEventEndTimeValue] = useState<string>("12:00");
  const [eventCategory, setEventCategory] = React.useState<string>("Default");
  const [eventDuration, setEventDuration] = React.useState<number>(60);
  const [isDateClickDialog, setIsDateClickDialog] = useState(false);

  //5 percenként újra lekérdezi az eseményeket.
  useEffect(() => {
    fetchEvents(setEvents, setLoading);

    const interval = setInterval(
      () => fetchEvents(setEvents, setLoading),
      300000
    ); // 5 perc
    return () => clearInterval(interval);
  }, [setEvents, setInterval]);

  const onDeleteEvent = (eventId: string | undefined) => {
    handleDeleteEvent(eventId, setEvents, setLoading, closeDialog);
  };

  const onSaveChanges = async () => {
    await handleSaveChanges(
      currentEvent as CalendarEvent,
      eventStartDatePicker,
      eventStartTimeValue,
      eventEndDatePicker,
      eventEndTimeValue,
      setEvents,
      setLoading,
      closeDialog
    );
  };

  const openDialogForNewEvent = (isDateClickDialog = false) => {
    setIsDateClickDialog(isDateClickDialog);
    setDialogOpen(true);
  };

  const createNewEvent = async () => {
    const startDateTime = getCombinatedDateTime(
      eventStartDatePicker,
      eventStartTimeValue,
      new Date()
    );
    const endDateTime = getCombinatedDateTime(
      eventEndDatePicker,
      eventEndTimeValue,
      new Date()
    );

    const newEvent: CalendarEvent = {
      summary: eventName,
      start: { dateTime: startDateTime },
      end: { dateTime: endDateTime },
      category: eventCategory,
      duration: eventDuration
    };

    await handleCreateEvent(
      newEvent,
      eventCategory,
      eventDuration,
      setEvents,
      setLoading,
      closeDialog
    );
  };
  const openDialog = (eventInfo: any) => {
    setCurrentEvent({
      id: eventInfo.event.id,
      summary: eventInfo.event.title,
      start: eventInfo.event.start,
      end: eventInfo.event.end,
      description: eventInfo.event.extendedProps.description
    });

    setEventName(eventInfo.event.title);
    setEventStartDatePicker(new Date(eventInfo.event.start))
    setEventEndDatePicker(new Date(eventInfo.event.end))
    setEventStartTimeValue(new Date(eventInfo.event.start).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    }));
    setEventEndTimeValue(new Date(eventInfo.event.end).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    }));
    setDialogOpen(true);
    console.log("Dialog opening...");
  };

  const closeDialog = () => {
    openDialogForNewEvent(false);
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
        dateClick={() => openDialogForNewEvent(true)}
      />
      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">
            {isDateClickDialog ? (
              <>
                  Új esemény létrehozása
              </>
            ) : (
              <>
                {currentEvent?.summary} <br /> esemény részletei
              </>
            )} 
            </DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>

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
              <div>
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Kategória
            </Label>
            <Input
              id="eventCategory"
              value={eventCategory}
              onChange={(e) => setEventCategory(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              Tervezett idő (perc)
            </Label>
            <Input
              id="eventDuration"
              inputMode="numeric"
              max={9000}
              value={eventDuration}
              type="number"
              onChange={(e) => {
                setEventDuration(parseInt(e.target.value));
                console.log(e.target.value);
              }}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            {isDateClickDialog ? (
              <>
                <Button type="submit" onClick={createNewEvent}>
                  Esemény létrehozása
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => onDeleteEvent(currentEvent?.id)}>
                  Törlés
                </Button>
                <Button type="submit" onClick={onSaveChanges}>
                  Esemény mentése
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Calendar;
