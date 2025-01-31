import React, { useState, useEffect, useRef } from "react";
import NavDropdown from "./NavDropdown";
import { UserName } from "@/types";
import { fetchUserData } from "../utils/functions";
import Statistics from "./Statistics";
import Logout from "../Logout";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [user, setUser] = useState<UserName | null>(null);
  const userProfileName = user?.given_name;
  const statisticsRef = useRef<{ openStatistics: () => void } | null>(null);

  useEffect(() => {
    fetchUserData(setUser);
  }, []);

  const handleStatisticsClick = () => {
    statisticsRef.current?.openStatistics();
  };

  const MenuIcon = ({ isOpen }: { isOpen: boolean }) => {
    return (
      <div className="relative w-6 h-[18px] flex flex-col justify-between">
        <span className={`block w-full h-0.5 bg-white ${isOpen ? "rotate-[46deg] translate-y-2 w-[26px]" : ""}`}></span>
        <span className={`block w-full h-0.5 bg-white ${isOpen ? "opacity-0" : "opacity-100"}`}></span>
        <span
          className={`block w-full h-0.5 bg-white ${isOpen ? " duration-700 -rotate-45 -translate-y-2 w-[26px]" : ""}`}
        ></span>
      </div>
    );
  };

  return (
    <nav className="sticky top-0 left-0 w-full p-4 bg-slate-800 shadow-lg z-40">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-semibold hidden sm:block px-4">
          <NavDropdown userProfileName={userProfileName} />
        </div>
        <div className="text-3xl mx-auto sm:m-0 absolute left-1/2 transform -translate-x-1/2">StudyHelper</div>
        <div className="flex items-center space-x-4 text-lg font-semibold hidden sm:block px-4">
          {userProfileName ? (
            ""
          ) : (
            <div className="text-lg font-semibold hidden sm:block px-4">
              <a href="/login" className="focus:outline-none">
                Login
              </a>
            </div>
          )}
        </div>
        <div className="sm:hidden cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <MenuIcon isOpen={isOpen} />
        </div>
      </div>
      <div
        className={`absolute top-full left-0 w-full bg-slate-800 transition-[opacity, transform] duration-700 ease-in-out overflow-hidden ${
          isOpen ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t flex flex-col items-center p-2 text-lg">
          <button className="pb-1" onClick={handleStatisticsClick}>
            Statistics
          </button>
          <Logout />
        </div>
      </div>
      <Statistics ref={statisticsRef} />
    </nav>
  );
};

export default Navbar;
