import React from "react";
import { Button } from "../templates/button";

interface HiderButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
}
const HiderButtons: React.FC<HiderButtonProps> = ({ onClick, icon }) => {
  return (
    <div>
      <Button
        variant="outline"
        className="bg-slate-900 border border-slate-600 hover:bg-slate-800 hover:text-white p-3"
        onClick={onClick}
      >
        {icon}
      </Button>
    </div>
  );
};

export default HiderButtons;
