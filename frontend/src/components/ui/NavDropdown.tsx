import React, { useRef } from "react";
import { LogOut, Calendar, ChartNoAxesCombined } from "lucide-react";
import CalendarDrawer from "./CalendarDrawer";
import Logout from "../Logout";
import Statistics from "./Statistics";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/templates/dropdown-menu";

const NavDropdown: React.FC = () => {
  const calendarDrawerRef = useRef<{ openDrawer: () => void } | null>(null);
  const statisticsRef = useRef<{ openStatistics: () => void } | null>(null);
  const handleCalendarClick = () => {
    setTimeout(() => {
      calendarDrawerRef.current?.openDrawer();
    }, 50);
  };

  const handleStatisticsClick = () => {
    setTimeout(() => {
      statisticsRef.current?.openStatistics();
    }, 50);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <span className="cursor-pointer">Dashboard</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 ml-6 bg-slate-900 text-white border-slate-600">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-slate-600" />
          <DropdownMenuGroup>
            <DropdownMenuItem className="focus:bg-slate-700 focus:text-white" onSelect={handleCalendarClick}>
              <Calendar />
              <span className="cursor-pointer">Calendar</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-slate-700 focus:text-white" onSelect={handleStatisticsClick}>
              <ChartNoAxesCombined />
              <span className="cursor-pointer">Statistics</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-slate-600" />
          <DropdownMenuItem className="focus:bg-slate-700 focus:text-white">
            <LogOut />
            <span>
              <Logout />
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CalendarDrawer ref={calendarDrawerRef} />
      <Statistics ref={statisticsRef} />
    </>
  );
};

export default NavDropdown;
