import axios from "axios";
import React, { useEffect, useState } from "react";
import { CalendarEvent } from "@/types";
import Navigation from "@/components/ui/Navigation";
import Timer from "@/components/Timer";
import HomeCalendar from "@/components/ui/HomeCalendar";
import RainEffect from "@/components/ui/Rain";

const Home: React.FC = () => {
  interface User {
    name: string;
    given_name: string;
    email: string;
    picture: string;
    events: CalendarEvent[];
  }

  const [user, setUser] = useState<User | null>(null);
  const userProfileName = user?.given_name;

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
    <div className="bg-gradient-to-tl from-slate-800 to-slate-900 text-white h-screen relative">
      <Navigation userProfileName={userProfileName} />
      <RainEffect topStart={0} />
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
