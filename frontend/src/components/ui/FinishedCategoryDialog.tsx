import React, { useState } from "react";
import { Button } from "@/components/templates/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/templates/dialog";

interface FinishedCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const FinishedCategoryDialog: React.FC<FinishedCategoryDialogProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] border border-slate-600 bg-slate-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-center">Good job!</DialogTitle>
          <DialogDescription className="text-center">
            You finished your studies sooner than you thought! <br />
            Keep it up!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button
            type="submit"
            onClick={onClose}
            className="bg-white text-black hover:bg-slate-200 border border-slate-600"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FinishedCategoryDialog;
