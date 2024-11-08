import React, { useEffect, useState } from 'react';

import { Button } from '@/components/calendarui/button';
import { Input } from '@/components/calendarui/input';
import { Label } from '@/components/calendarui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/calendarui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllCategories } from '../utils/functions';

const Timer: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data: string[] = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Nem sikerült betölteni a kategóriákat: ', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="bg-slate">
          Tanulás elkezdése
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
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
              <Label htmlFor="duration">Időtartam</Label>
              <Input id="duration" defaultValue="60" className="col-span-2 h-8" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Timer;
