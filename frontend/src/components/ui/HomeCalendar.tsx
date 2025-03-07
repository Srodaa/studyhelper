import React, { useEffect, useState } from "react";
import { Calendar } from "@/components/templates/smallcalendar";
import { CalendarEvent } from "@/types";
import { fetchEvents } from "../utils/functions";
import { buttonVariants } from "@/components/templates/button";
import { cn } from "@/lib/utils";

const HomeCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents(setEvents, setLoading);

    const interval = setInterval(() => fetchEvents(setEvents, setLoading), 300000); // 5 perc
    return () => clearInterval(interval);
  }, []);

  const isEventDay = (date: Date) => {
    return events.some((event) => {
      const startDate = new Date(event.start.dateTime);
      const endDate = new Date(event.end.dateTime);

      return (
        (startDate.getFullYear() === date.getFullYear() &&
          startDate.getMonth() === date.getMonth() &&
          startDate.getDate() === date.getDate()) ||
        (startDate <= date && date <= endDate)
      );
    });
  };
  return (
    <div className="absolute right-5 top-[6rem] p-0 border border-slate-600 rounded-md shadow-lg bg-slate-900 mobile:z-0 mobile:left-1/2 mobile:w-[250px] mobile:transform mobile:-translate-x-1/2">
      <Calendar
        classNames={{
          day_today: "bg-slate-800",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 hover:bg-slate-800 hover:text-white border-slate-500"
          ),
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-slate-700 hover:text-white"
          )
        }}
        modifiers={{
          event: isEventDay
        }}
        modifiersClassNames={{
          event:
            "after:content-[''] after:w-[6px] after:h-[6px] after:bg-[#18637C] after:rounded-full after:absolute after:bottom-[1px] after:left-1/2 after:-translate-x-1/2"
        }}
      />
    </div>
  );
};

export default HomeCalendar;
