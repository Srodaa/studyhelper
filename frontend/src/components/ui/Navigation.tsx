// Navbar.tsx
import React, { useState } from "react";
import { Menu } from "lucide-react";
import Calendar from "@/components/Calendar/Calendar";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";

interface NavbarProps {
  profileImageUrl?: string;
}
const Navbar: React.FC<NavbarProps> = ({ profileImageUrl }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 left-0 w-full p-4 shadow-lg z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-semibold hidden sm:block px-4">Bal szöveg</div>

        <div className="text-3xl mx-auto sm:m-0 absolute left-1/2 transform -translate-x-1/2">StudyHelper</div>

        <div className="flex items-center space-x-4 text-lg font-semibold hidden sm:block px-4">
          {profileImageUrl ? (
            <div className="flex items-center space-x-2">
              <Drawer>
                <DrawerTrigger className="text-lg font-semibold">Calendar</DrawerTrigger>
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
              <img src={profileImageUrl} alt="Profile" className="w-10 h-10 rounded-full border-2 border-gray-300" />
            </div>
          ) : (
            <div className="text-lg font-semibold hidden sm:block px-4">Calendar</div>
          )}
        </div>
        <div className="sm:hidden cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <Menu />
        </div>
      </div>
      {isOpen && (
        <div className="sm:hidden border-t mt-2 shadow-lg">
          <ul className="flex flex-col items-center p-2">
            <li className="py-2">
              <a href="#">Egy szöveg</a>
            </li>
            <li className="py-2">
              <a href="#">Meg egy másik szöveg</a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
