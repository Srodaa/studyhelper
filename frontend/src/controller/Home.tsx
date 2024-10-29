import axios from "axios";
import React, { useEffect, useState } from "react";
import Calendar from "./Calendar";

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
      <h2>Hello, you are logged in!</h2>
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
        <p>Loading user data...</p>
      )}
      <Calendar/>
    </div>
  );
}

export default Home;
