import axios from "axios";
import React, { useEffect, useState } from "react";
import Calendar from "./Calendar";

import { Terminal, AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function Home() {
  interface User {
    name: string;
    email: string;
    picture: string;
    events: CalendarEvent[];
  }

  interface CalendarEvent {
    id: string;
    summary: string;
    description: string;
    start: string;
    end: string;
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
            A bejelentkezési fázis nem ment végbe, kérlek próbáld meg <a href="http://localhost:5173/login">újra</a>!
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
      ) : (<p></p>)}
      <Calendar />
    </div>
  );
}

export default Home;
