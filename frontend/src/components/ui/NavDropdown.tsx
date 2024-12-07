import React from "react";
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
            <DropdownMenuItem
              className="focus:bg-slate-700 focus:text-white"
              onSelect={(e) => {
                e.preventDefault(); // Ne zárja be a menüt
              }}
            >
              <Calendar />
              <span>
                <CalendarDrawer />
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-slate-700 focus:text-white" onSelect={(e) => e.preventDefault()}>
              <ChartNoAxesCombined />
              <span>
                <Statistics />
              </span>
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
    </>
  );
};

export default NavDropdown;
