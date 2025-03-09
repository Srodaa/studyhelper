import React, { useState } from "react";
import Navigation from "@/components/ui/Navigation";
import Timer from "@/components/Timer";
import HomeCalendar from "@/components/ui/HomeCalendar";
import RainEffect from "@/components/ui/Rain";
import MusicPlayer from "@/components/MusicPlayer";
import HiderButtons from "@/components/ui/HiderButtons";
import { CalendarCheck2, CalendarX2, HeadphoneOff, Headphones } from "lucide-react";

const Home: React.FC = () => {
  const [showCalendar, setShowCalendar] = useState(true);
  const [showMusicPlayer, setShowMusicPlayer] = useState(true);

  return (
    <div className="bg-linear-to-tl from-slate-800 to-slate-900 text-white h-screen relative">
      <Navigation />
      <RainEffect topStart={0} />
      <div>{showCalendar && <HomeCalendar />}</div>
      <div className={`${showMusicPlayer ? "" : "hidden"}`}>
        <MusicPlayer />
      </div>
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
        <Timer />
      </div>
      <div className="flex flex-col gap-2 p-2 pt-4 -translate-x-9 hover:transform hover:translate-x-px duration-1000 w-fit mobile:hidden">
        <div>
          <HiderButtons
            onClick={() => {
              setShowCalendar(!showCalendar);
            }}
            icon={showCalendar ? <CalendarX2 /> : <CalendarCheck2 />}
          ></HiderButtons>
        </div>

        <HiderButtons
          onClick={() => {
            setShowMusicPlayer(!showMusicPlayer);
          }}
          icon={showMusicPlayer ? <HeadphoneOff /> : <Headphones />}
        ></HiderButtons>
      </div>
    </div>
  );
};

export default Home;
