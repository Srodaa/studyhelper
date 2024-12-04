import React, { useState } from "react";
import { Menu } from "lucide-react";
import NavDropdown from "./NavDropdown";

interface NavbarProps {
  userProfileName?: string;
}
const Navbar: React.FC<NavbarProps> = ({ userProfileName }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 left-0 w-full p-4 bg-slate-800 shadow-lg z-40">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-semibold hidden sm:block px-4">
          <NavDropdown />
        </div>
        <div className="text-3xl mx-auto sm:m-0 absolute left-1/2 transform -translate-x-1/2">StudyHelper</div>
        <div className="flex items-center space-x-4 text-lg font-semibold hidden sm:block px-4">
          {userProfileName ? (
            <div className="flex items-center space-x-2">
              <span>Hi {userProfileName}!</span>
            </div>
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
