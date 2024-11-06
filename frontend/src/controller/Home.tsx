import axios from "axios";
import React, { useEffect, useState } from "react";
import Calendar from "./Calendar";

import { Terminal, AlertCircle } from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/calendarui/alert";

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
import { Button } from "@/components/calendarui/button";
import { fetchEvents } from "@/components/utils/functions";
import { CalendarEvent } from "@/types";

const Home: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  interface User {
    name: string;
    email: string;
    picture: string;
    events: CalendarEvent[];
  }

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Felhasználói adatok és események
    axios
      .get("http://localhost:8080/user-info", { withCredentials: true })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error occurred: ", error);
      });
    fetchEvents(setEvents, setLoading);
  }, []);

  return (
    <div>
      {user ? (
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Sikeres bejelentkezés!</AlertTitle>
          <AlertDescription>
            Szia {user.name}, sikeresen bejelentkeztél!
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Sikertelen bejelentkezés!</AlertTitle>
          <AlertDescription>
            A bejelentkezési fázis nem ment végbe, kérlek próbáld meg{" "}
            <a href="http://localhost:5173/login">újra</a>!
          </AlertDescription>
        </Alert>
      )}
      {user ? (
        <div>
          <p>{user.name}</p>
          <p>{user.email}</p>
          {user.picture && (
            <img
              src={user.picture}
              alt="User Profile"
              referrerPolicy="no-referrer"
            />
          )}
        </div>
      ) : (
        <p></p>
      )}
      <Drawer>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle></DrawerTitle>
            <DrawerDescription></DrawerDescription>
            <div className="px-[10%]">
              <Calendar />
            </div>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose>
              <Button variant="outline">Bezárás</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Home;
