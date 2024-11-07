import axios from "axios";
import React, { useEffect, useState } from "react";
import { CalendarEvent } from "@/types";
import Navigation from "@/components/ui/Navigation";

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
      {user ? (
        <div>
          <p>{user.name}</p>
          <p>{user.email}</p>
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default Home;
