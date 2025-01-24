import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import NavDropdown from "./NavDropdown";
import { UserName } from "@/types";
import { fetchUserData } from "../utils/functions";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [user, setUser] = useState<UserName | null>(null);
  const userProfileName = user?.given_name;

  useEffect(() => {
    fetchUserData(setUser);
  }, []);

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
