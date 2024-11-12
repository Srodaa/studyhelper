import React, { useEffect, useState } from "react";

import { Button } from '@/components/calendarui/button';
import { Input } from '@/components/calendarui/input';
import { Label } from '@/components/calendarui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/calendarui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllCategories, updateDatabaseDuration } from '../utils/functions';

const Timer: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [duration, setDuration] = useState<number>(60);
  const [remainingTime, setRemainingTime] = useState<number>(duration * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

    const fetchCategories = async () => {
      try {
        const data: string[] = await getAllCategories();
        setCategories(data);
      } catch (error) {
      console.error("Nem sikerült betölteni a kategóriákat: ", error);
    }};

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
          handleStopTimer();
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
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const startStudy = isRunning ? formatTime(remainingTime) : 'Tanulás elkezdése';

  return (
    <Popover open={isPopoverOpen} onOpenChange={handlePopoverOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="bg-slate">
          {startStudy}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" onFocus={fetchCategories}>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none text-center">Időzítő</h4>
            <p className="text-sm text-muted-foreground text-center">
              A tanulás elkezdéséhez válaszd ki az alábbi pontokat.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid gap-4 grid-cols-3 items-center">
              <Label htmlFor="category">Kategória</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[185px]">
                  <SelectValue placeholder="Válassz kategóriát" />
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
              <Label htmlFor="duration">Időtartam (perc)</Label>
              <Input
                type="number"
                max="10000"
                min="1"
                id="duration"
                value={remainingTime / 60}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (newValue == '') {
                    setDuration(0);
                  } else {
                    const parsedValue = parseInt(newValue, 10);
                    setDuration(parsedValue);
                  }
                }}
                className="col-span-2 h-8"
              />
            </div>
          </div>
          <div>
            <Button
              type="submit"
              onClick={() => {
                startTimer();
                closePopover();
              }}
              className="grid float-right"
            >
              Kezdés
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Timer;
