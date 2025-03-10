import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
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
import { Label } from "@/components/templates/label";
import { fetchStudyStatistics } from "@/components/utils/functions";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/templates/table";

interface StudyProgressDTO {
  subject: string;
  elapsedTime: number;
}

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} and ${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }
  return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
};

const Statistics = forwardRef((_, ref) => {
  const [studyProgress, setStudyProgress] = useState<StudyProgressDTO[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const totalElapsedTime = studyProgress.reduce((total, item) => total + item.elapsedTime, 0);
  const formattedTime = formatTime(totalElapsedTime);

  const fetchData = async () => {
    const data = await fetchStudyStatistics();
    if (data === null) {
      console.log("Failed to retrieve data.");
    } else {
      setStudyProgress(data);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useImperativeHandle(ref, () => ({
    openStatistics: () => setIsOpen(true)
  }));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <span className="cursor-pointer hidden">Statistics</span>
      </DialogTrigger>
      <DialogContent className="mobile:max-w-[385px] border border-slate-600 bg-slate-900 text-white max-h-[700px] mt-6">
        <DialogHeader>
          <DialogTitle className="text-center">Statistics</DialogTitle>
          <DialogDescription className="text-center">
            Here you can see some statistics on your time spent studying.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <Label className="text-right">Total time spent studying: </Label>
            <Label className="text-center">{formattedTime}</Label>
          </div>
        </div>
        <div>
          <Table>
            <TableHeader>
              <TableRow className="pointer-events-none border-slate-600 max-w-[462px] mobile:max-w-[167px]">
                <TableHead className="text-center w-[231px] mobile:w-[167px]">Subject</TableHead>
                <TableHead className="text-center w-[231px]">Studied minutes</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
          <div className="max-h-72 overflow-y-auto">
            <Table>
              <TableBody className="border-b-2 border-slate-600">
                {studyProgress.map((item, index) => (
                  <TableRow className="border-b-2 border-slate-600" key={index}>
                    <TableCell className="w-[231px] mobile:w-[167px]">{item.subject}</TableCell>
                    <TableCell className="font-medium text-center">
                      {(Math.round((item.elapsedTime / 60) * 100) / 100).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button
            type="submit"
            onClick={() => setIsOpen(false)}
            className="bg-white text-black hover:bg-slate-200 border border-slate-600"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default Statistics;
