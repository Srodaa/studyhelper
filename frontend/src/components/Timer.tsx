import React, { useEffect, useState } from "react";

import { Button } from "@/components/templates/button";
import { Input } from "@/components/templates/input";
import { Label } from "@/components/templates/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/templates/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/templates/select";
import { getAllCategories, saveStudyProgress, updateDatabaseDuration } from "./utils/functions";
import { toast } from "sonner";

const Timer: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [duration, setDuration] = useState<number>(60);
  const [remainingTime, setRemainingTime] = useState<number>(duration * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [isTimeVisible, setIsTimeVisible] = useState(false);

  const fetchCategories = async () => {
    try {
      const data: string[] = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Nem sikerült betölteni a kategóriákat: ", error);
    }
  };

  useEffect(() => {
    setRemainingTime(duration * 60);
  }, [duration]);

  const startTimer = () => {
    if (isRunning) return;
    setIsRunning(true);

    const id = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(id);
          setIsRunning(false);
          const elapsedSeconds = duration * 60;
          updateDatabaseDuration(selectedCategory, elapsedSeconds);
          saveStudyProgress(selectedCategory, elapsedSeconds);
          setRemainingTime(duration * 60);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    setIntervalId(id);
  };
  const handleStopTimer = () => {
    if (intervalId) clearInterval(intervalId);
    setIsRunning(false);

    const elapsedSeconds = duration * 60 - remainingTime;
    console.log(selectedCategory, elapsedSeconds);
    updateDatabaseDuration(selectedCategory, elapsedSeconds);
    saveStudyProgress(selectedCategory, elapsedSeconds);
    setRemainingTime(duration * 60);
  };

  const handlePopoverOpenChange = (open: boolean) => {
    if (open && isRunning) {
      handleStopTimer();
      setDuration(Math.floor(remainingTime / 60));
      setIsPopoverOpen(open);
    } else {
      setIsPopoverOpen(open);
    }
  };

  const closePopover = () => {
    setIsPopoverOpen(false);
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const startStudy = isRunning ? "Stop learning" : "Start learning";
  const timerRemaining = isRunning ? formatTime(remainingTime) : "";
  const mobileStartStudy = isRunning ? formatTime(remainingTime) : "Start learning";

  return (
    <div>
      {isTimeVisible && isRunning && (
        <div className="flex flex-col items-center justify-center h-screen mobile:hidden">
          <p className="font-mono text-9xl md:text-5xl">{timerRemaining}</p>
          <p className="font-mono text-[10px] hover:block cursor-pointer" onClick={() => setIsTimeVisible(false)}>
            hide
          </p>
        </div>
      )}
      <div className="flex items-center justify-center">
        <Popover open={isPopoverOpen} onOpenChange={handlePopoverOpenChange}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="bg-slate-900 border border-slate-600 hover:bg-slate-800 hover:text-white w-[120px]"
            >
              <span className="hidden mobile:block">{mobileStartStudy}</span>
              <span className="block mobile:hidden">{startStudy}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-slate-900 text-white border border-slate-600 border border-slate-600">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none text-center">Timer</h4>
                <p className="text-sm text-slate-200 text-center">To start learning, select the points below.</p>
              </div>
              <div className="grid gap-2">
                <div className="grid gap-4 grid-cols-3 items-center">
                  <Label htmlFor="category">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory} onOpenChange={fetchCategories}>
                    <SelectTrigger className="w-[185px] border-slate-600 hover:border-white">
                      <SelectValue placeholder="Choose your category" />
                      <SelectContent>
                        {categories.map((category, index) => (
                          <SelectItem key={index} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    type="number"
                    max="10000"
                    min="1"
                    id="duration"
                    value={remainingTime / 60}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (newValue == "") {
                        setDuration(0);
                      } else {
                        const parsedValue = parseInt(newValue, 10);
                        setDuration(parsedValue);
                      }
                    }}
                    className="col-span-2 h-8 border-slate-600 focus:border-white"
                  />
                </div>
              </div>
              <div>
                <Button
                  type="submit"
                  onClick={() => {
                    if (!selectedCategory || duration <= 0) {
                      toast.error("Please select a category and set a valid duration.");
                      return;
                    }
                    setIsTimeVisible(true);
                    startTimer();
                    closePopover();
                  }}
                  className="grid float-right bg-white text-black hover:bg-slate-200 border border-slate-600"
                >
                  Start
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Timer;
