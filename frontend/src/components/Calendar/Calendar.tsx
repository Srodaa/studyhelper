import React, { useEffect, useState } from "react";
import { CalendarEvent } from "../../types";
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
} from "@/components/calendarui/dialog";
import { Label } from "@/components/calendarui/label";
import { Input } from "@/components/calendarui/input";

import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/calendarui/button";
import { Calendar as SmallCalendar } from "@/components/calendarui/smallcalendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/calendarui/popover";
import { format } from "date-fns";
import {
  fetchEvents,
  handleDeleteEvent,
  handleSaveChanges,
  handleCreateEvent,
  getCombinatedDateTime,
  getEventCategoryAndDuration
} from "@/components/utils/functions";
import { buttonVariants } from "@/components/calendarui/button";

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<CalendarEvent> | null>(null);
  const [eventName, setEventName] = useState<string>(currentEvent?.summary || ""); //Esemény nevének a szerkesztéséhez kell
  const [eventStartDatePicker, setEventStartDatePicker] = React.useState<Date>();
  const [eventEndDatePicker, setEventEndDatePicker] = React.useState<Date>();
  const [eventStartTimeValue, setEventStartTimeValue] = useState<string>("10:00");
  const [eventEndTimeValue, setEventEndTimeValue] = useState<string>("12:00");
  const [eventCategory, setEventCategory] = React.useState<string>("Default");
  const [eventDuration, setEventDuration] = React.useState<number>(60);
  const [isDateClickDialog, setIsDateClickDialog] = useState(false);
  const [clickedDate, setClickedDate] = useState<Date>();

  //5 percenként újra lekérdezi az eseményeket.
  useEffect(() => {
    fetchEvents(setEvents, setLoading);

    const interval = setInterval(() => fetchEvents(setEvents, setLoading), 300000); // 5 perc
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
      closeDialog,
      eventCategory,
      eventDuration
    );
  };

  const openDialogForNewEvent = (isDateClickDialog = false) => {
    setIsDateClickDialog(isDateClickDialog);
    setDialogOpen(true);
  };

  const createNewEvent = async () => {
    const startDateTime = getCombinatedDateTime(eventStartDatePicker, eventStartTimeValue, new Date());
    const endDateTime = getCombinatedDateTime(eventEndDatePicker, eventEndTimeValue, new Date());

    const newEvent: CalendarEvent = {
      summary: eventName,
      start: { dateTime: startDateTime },
      end: { dateTime: endDateTime },
      category: eventCategory,
      duration: eventDuration
    };

    await handleCreateEvent(newEvent, eventCategory, eventDuration, setEvents, setLoading, closeDialog);
  };
  const openDialog = async (eventInfo: any) => {
    setCurrentEvent({
      id: eventInfo.event.id,
      summary: eventInfo.event.title,
      start: eventInfo.event.start,
      end: eventInfo.event.end,
      description: eventInfo.event.extendedProps.description
    });

    setEventName(eventInfo.event.title);
    setEventStartDatePicker(new Date(eventInfo.event.start));
    setEventEndDatePicker(new Date(eventInfo.event.end));
    setEventStartTimeValue(
      new Date(eventInfo.event.start).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    );
    setEventEndTimeValue(
      new Date(eventInfo.event.end).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    );
    try {
      const { category, duration } = await getEventCategoryAndDuration(eventInfo.event.id);
      setEventCategory(category);
      setEventDuration(Math.round((duration / 60) * 100) / 100);
    } catch (error) {
      console.error("Hiba a kategória és időtartam lekérésekor:", error);
    }
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
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={eventList}
        editable={true}
        selectable={true}
        eventContent={renderEventContent}
        height={400}
        fixedWeekCount={false}
        firstDay={1}
        eventStartEditable={false}
        headerToolbar={{
          left: "prev",
          center: "title",
          right: "next"
        }}
        dateClick={(info) => {
          const clickedDay = info.date;
          setEventStartDatePicker(clickedDay);
          setEventEndDatePicker(clickedDay);
          setClickedDate(clickedDay);
          openDialogForNewEvent(true);
        }}
      />
      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="border border-slate-600 bg-slate-900 text-white">
          <DialogHeader>
            <DialogTitle className="text-center">
              {isDateClickDialog ? (
                <>Create new event</>
              ) : (
                <>
                  <span className="uppercase">{currentEvent?.summary} </span>
                  <br /> event details
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Event name
              </Label>
              <Input
                id="esemenyNeve"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="col-span-3 border border-slate-600 focus:border-white"
              />
              <Label htmlFor="datePicker" className="text-right">
                Date
              </Label>
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[342.5px] justify-start text-left font-normal border border-slate-600 bg-slate-900 hover:bg-slate-800 hover:text-white mb-1",
                        !eventStartDatePicker && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon />
                      {eventStartDatePicker ? format(eventStartDatePicker, "PPP") : <span>Start date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border border-slate-600 bg-slate-900 text-white">
                    <SmallCalendar
                      mode="single"
                      selected={eventStartDatePicker}
                      onSelect={setEventStartDatePicker}
                      initialFocus
                      classNames={{
                        day_today: "bg-slate-800",
                        nav_button: cn(
                          buttonVariants({ variant: "outline" }),
                          "h-7 w-7 bg-transparent p-0 hover:bg-slate-800 hover:text-white border-slate-500"
                        ),
                        day: cn(
                          buttonVariants({ variant: "ghost" }),
                          "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-slate-700 hover:text-white"
                        ),
                        day_selected: "bg-slate-700 border border-slate-500"
                      }}
                    />
                    <div className="mx-1">
                      <Input
                        type="time"
                        value={eventStartTimeValue}
                        onChange={(e) => {
                          setEventStartTimeValue(e.target.value);
                        }}
                        className="border border-x-0 border-b-0 rounded-none accent-white grid place-content-center mb-1"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[342.5px] justify-start text-left font-normal border border-slate-600 bg-slate-900 hover:bg-slate-800 hover:text-white mt-1",
                        !eventEndDatePicker && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon />
                      {eventEndDatePicker ? format(eventEndDatePicker, "PPP") : <span>End date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border border-slate-600 bg-slate-900 text-white">
                    <SmallCalendar
                      mode="single"
                      selected={eventEndDatePicker}
                      onSelect={setEventEndDatePicker}
                      initialFocus
                      classNames={{
                        day_today: "bg-slate-800",
                        nav_button: cn(
                          buttonVariants({ variant: "outline" }),
                          "h-7 w-7 bg-transparent p-0 hover:bg-slate-800 hover:text-white border-slate-500"
                        ),
                        day: cn(
                          buttonVariants({ variant: "ghost" }),
                          "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-slate-700 hover:text-white"
                        ),
                        day_selected: "bg-slate-700 border border-slate-500"
                      }}
                    />
                    <div className="mx-1">
                      <Input
                        type="time"
                        value={eventEndTimeValue}
                        onChange={(e) => {
                          setEventEndTimeValue(e.target.value);
                        }}
                        className="border border-x-0 border-b-0 rounded-none accent-white grid place-content-center mb-1"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input
              id="eventCategory"
              value={eventCategory}
              onChange={(e) => setEventCategory(e.target.value)}
              className="col-span-3 border border-slate-600 focus:border-white"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              Time planned (minutes)
            </Label>
            <Input
              id="eventDuration"
              inputMode="numeric"
              max={9000}
              value={eventDuration}
              type="number"
              onChange={(e) => {
                setEventDuration(parseInt(e.target.value));
              }}
              className="col-span-3 border border-slate-600 focus:border-white"
            />
          </div>
          <DialogFooter>
            {isDateClickDialog ? (
              <>
                <Button
                  type="submit"
                  onClick={createNewEvent}
                  className="bg-white text-black hover:bg-slate-200 border border-slate-600"
                >
                  Create event
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => onDeleteEvent(currentEvent?.id)}
                  className="bg-white text-black hover:bg-slate-200 border border-slate-600"
                >
                  Delete event
                </Button>
                <Button
                  type="submit"
                  onClick={onSaveChanges}
                  className="bg-white text-black hover:bg-slate-200 border border-slate-600"
                >
                  Save event
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
