import React from "react";
import Navigation from "@/components/ui/Navigation";
import Timer from "@/components/Timer";
import HomeCalendar from "@/components/ui/HomeCalendar";
import RainEffect from "@/components/ui/Rain";
import MusicPlayer from "@/components/ui/MusicPlayer";

const Home: React.FC = () => {
  return (
    <div className="bg-gradient-to-tl from-slate-800 to-slate-900 text-white h-screen relative">
      <Navigation />
      <RainEffect topStart={0} />
      <div>
        <HomeCalendar></HomeCalendar>
      </div>
      <div>
        <MusicPlayer></MusicPlayer>
      </div>
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
        <Timer />
      </div>
    </div>
  );
};

export default Home;
