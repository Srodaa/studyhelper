import axios from "axios";
import React, { useEffect, useState } from "react";
import { CalendarEvent } from "@/types";
import Navigation from "@/components/ui/Navigation";
import Timer from "@/components/ui/Timer";
import HomeCalendar from "@/components/ui/HomeCalendar";

const Home: React.FC = () => {
  interface User {
    name: string;
    email: string;
    picture: string;
    events: CalendarEvent[];
  }

  const [user, setUser] = useState<User | null>(null);
  const userProfileImageUrl = user?.picture;

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
    <div className="bg-slate-800 text-white h-screen">
      <Navigation profileImageUrl={userProfileImageUrl} />
      <div>
        <HomeCalendar></HomeCalendar>
      </div>
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
        <Timer />
      </div>
    </div>
  );
};

export default Home;
