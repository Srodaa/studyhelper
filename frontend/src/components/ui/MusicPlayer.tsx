import { useState, useEffect } from "react";
import { Slider } from "@/components/templates/slider"; // Shadcn/UI Slider
import { Button } from "@/components/templates/button"; // Shadcn/UI Button
import { PlayIcon, PauseIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from "@radix-ui/react-icons";
import clsx from "clsx";

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isAnimatingPrev, setIsAnimatingPrev] = useState(false);
  const [isAnimatingNext, setIsAnimatingNext] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audioElement = new Audio("/lofimix1.mp3");
    setAudio(audioElement);

    audioElement.ontimeupdate = () => {
      setProgress((audioElement.currentTime / audioElement.duration) * 100);
    };

    return () => {
      audioElement.pause();
      setAudio(null);
    };
  }, []);

  const handleSliderChange = (value: number[]) => {
    if (audio) {
      audio.currentTime = (value[0] / 100) * audio.duration;
    }
  };

  const togglePlayPause = () => {
    if (audio) {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
      setIsPlaying(!audio.paused);
    }
  };

  const handlePrevious = () => {
    setIsAnimatingPrev(true);
    setTimeout(() => setIsAnimatingPrev(false), 150);
  };

  const handleNext = () => {
    setIsAnimatingNext(true);
    setTimeout(() => setIsAnimatingNext(false), 150);
  };

  return (
    <div className="absolute left-10 top-[80%] border border-slate-600 rounded-md shadow-lg bg-slate-900 w-[400px] h-[100px] p-1 px-2 mobile:z-0 mobile:top-[60%] mobile:left-1/2 mobile:w-[250px] mobile:transform mobile:-translate-x-1/2">
      <div className="flex flex-row space-x-4">
        <Button
          className={clsx(
            "basis-1/3 bg-slate-900 hover:bg-slate-900 transition-transform duration-150",
            isAnimatingPrev ? "-translate-x-2" : ""
          )}
          onClick={() => {
            console.log("Previous track");
            handlePrevious();
          }}
        >
          <DoubleArrowLeftIcon />
        </Button>

        <Button className="basis-1/3 bg-slate-900 hover:bg-slate-900" onClick={togglePlayPause}>
          <div
            className={clsx(
              "transition-transform duration-300 ease-in-out",
              isPlaying ? "animate-fadeIn scale-110" : "animate-fadeOut scale-100"
            )}
          >
            {audio && !audio.paused ? <PauseIcon /> : <PlayIcon />}
          </div>
        </Button>

        <Button
          className={clsx(
            "basis-1/3 bg-slate-900 hover:bg-slate-900 transition-transform duration-150",
            isAnimatingNext ? "translate-x-2" : ""
          )}
          onClick={() => {
            console.log("Previous track");
            handleNext();
          }}
        >
          <DoubleArrowRightIcon className="stroke-4" />
        </Button>
      </div>
      <div className="flex justify-center my-2">
        <Slider value={[progress]} max={100} step={1} onValueChange={handleSliderChange} className="w-11/12 h-max" />
      </div>
      <div className="flex justify-center">Now playing...</div>
    </div>
  );
};

export default MusicPlayer;
