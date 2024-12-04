import React from "react";
import Calendar from "@/components/Calendar";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/templates/drawer";

const CalendarDrawer: React.FC = () => {
  return (
    <>
      <Drawer>
        <DrawerTrigger>Calendar</DrawerTrigger>
        <DrawerContent className="bg-slate-900 border-slate-600">
          <DrawerHeader>
            <DrawerTitle></DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          <div>
            <Calendar />
          </div>
          <DrawerFooter>
            <DrawerClose>
              <span className="bg-white text-black hover:bg-slate-200 border border-slate-600 h-9 px-4 py-2 rounded-md text-sm font-medium">
                Close calendar
              </span>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CalendarDrawer;
