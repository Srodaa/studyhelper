import { useState, useEffect } from "react";
import { Slider } from "@/components/templates/slider";
import { Button } from "@/components/templates/button";
import {
  PlayIcon,
  PauseIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  SpeakerQuietIcon,
  SpeakerLoudIcon
} from "@radix-ui/react-icons";
import clsx from "clsx";
import { getStreamUrl } from "./utils/functions";
import axios from "axios";
import SoundCloudIcon from "@/assets/soundcloudlogo.png";

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isAnimatingPrev, setIsAnimatingPrev] = useState(false);
  const [isAnimatingNext, setIsAnimatingNext] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(0.3);
  const [songTitle, setSongTitle] = useState<string>("");
  const [trackUploaderUsername, setTrackUploaderUsername] = useState<string>("");
  const [songUrl, setSongUrl] = useState<string>("");
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const trackIds = ["2012998611", "1977792295", "1986735599"];

  const getTrackStreamURL = async (trackId: string): Promise<string | null> => {
    try {
      //Get track details
      const trackDetails = await getStreamUrl(trackId);

      setSongTitle(trackDetails.title);
      setTrackUploaderUsername(trackDetails.username);
      setSongUrl(trackDetails.permalinkUrl);
      const streamURL = trackDetails.extractStreamUrl;

      if (!streamURL) {
        console.error("Stream URL not found for this track.");
        return null;
      }

      return streamURL;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.warn("Fetch request was cancelled.");
        return null;
      }
      console.error("Error fetching track stream URL:", error);
      return null;
    }
  };

  useEffect(() => {
    const initializeAudio = async () => {
      const trackId = trackIds[currentTrackIndex];
      const streamURL = await getTrackStreamURL(trackId);
      if (!streamURL) {
        console.error("Steam URL could not be retrieved.");
        return;
      }
      //Nullázzuk az eddigi audiót. pl: megy egy zene, váltunk a másikra és így nem duplikálva mennek
      if (audio) {
        audio.pause();
        audio.src = "";
      }

      const audioElement = new Audio(streamURL);
      audioElement.volume = volume;
      setAudio(audioElement);

      //Ha az isPlaying már true akkor ha zenét váltunk nem kell elindítani megint hanem megy magától
      if (isPlaying) {
        audioElement.play();
      }

      audioElement.onended = () => {
        handleNext();
      };
    };

    initializeAudio();

    return () => {
      if (audio) {
        audio.pause();
        setAudio(null);
      }
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audio) {
      audio.ontimeupdate = () => {
        const newProgress = (audio.currentTime / audio.duration) * 100;
        if (Math.floor(newProgress) !== Math.floor(progress)) {
          setProgress(newProgress);
        }
      };
    }
  }, [progress, isPlaying]);

  const handleSliderChange = (value: number[]) => {
    if (audio) {
      audio.currentTime = (value[0] / 100) * audio.duration;
    }
  };

  const handleVolumeSliderChange = (value: number[]) => {
    if (audio) {
      const scaledVolume = value[0] / 100;
      setVolume(scaledVolume);
      audio.volume = scaledVolume;
    }
  };

  const togglePlayPause = () => {
    if (audio) {
      if (audio.paused) {
        audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
      setIsPlaying(!audio.paused);
    }
  };

  const handlePrevious = () => {
    setIsAnimatingPrev(true);
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + trackIds.length) % trackIds.length);
    setTimeout(() => setIsAnimatingPrev(false), 150);
  };

  const handleNext = () => {
    setIsAnimatingNext(true);
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % trackIds.length);
    setTimeout(() => setIsAnimatingNext(false), 150);
  };

  return (
    <div className="absolute left-10 top-[80%] border border-slate-600 rounded-md shadow-lg bg-slate-900 w-[400px] h-[120px] p-1 px-2 mobile:z-0 mobile:top-[60%] mobile:left-1/2 mobile:w-[250px] mobile:transform mobile:-translate-x-1/2">
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
          <DoubleArrowLeftIcon className="stroke-white stroke-1 [&>path]:stroke-inherit" />
        </Button>

        <Button className="basis-1/3 bg-slate-900 hover:bg-slate-900" onClick={togglePlayPause}>
          <div
            className={clsx(
              "transition-transform duration-300 ease-in-out",
              isPlaying ? "animate-fadeIn scale-110" : "animate-fadeOut scale-100"
            )}
          >
            {audio && !audio.paused ? (
              <PauseIcon className="stroke-white stroke-1 [&>path]:stroke-inherit" />
            ) : (
              <PlayIcon className="stroke-white stroke-1 [&>path]:stroke-inherit" />
            )}
          </div>
        </Button>

        <Button
          className={clsx(
            "basis-1/3 bg-slate-900 hover:bg-slate-900 transition-transform duration-150",
            isAnimatingNext ? "translate-x-2" : ""
          )}
          onClick={() => {
            console.log("Next track");
            handleNext();
          }}
        >
          <DoubleArrowRightIcon className="stroke-white stroke-1 [&>path]:stroke-inherit" />
        </Button>
      </div>
      <div className="flex justify-center my-2">
        <Slider value={[progress]} max={100} step={1} onValueChange={handleSliderChange} className="w-11/12 h-max" />
      </div>
      <div className="flex flex-row">
        <div className="basis-4/6 px-4">
          <a className="text-xs">{trackUploaderUsername}</a>
          <br />
          <a
            className="block max-w-[220px] truncate overflow-hidden mobile:max-w-[100px] mobile:truncate-none"
            href={songUrl}
          >
            {songTitle}
          </a>
        </div>
        <div></div>
        <SpeakerQuietIcon className="basis-1/12 mt-1 stroke-white stroke-1 [&>path]:stroke-inherit" />
        <Slider
          value={[volume * 100]}
          max={60}
          step={1}
          onValueChange={handleVolumeSliderChange}
          className="h-max mt-1 basis-1/6 mt-2"
        />
        <SpeakerLoudIcon className="basis-1/12 mt-1 stroke-white stroke-1 [&>path]:stroke-inherit" />
      </div>
      <img src={SoundCloudIcon} className="float-right relative top-[-16px] px-2 mobile:top-[-19px] mobile:px-0"></img>
    </div>
  );
};

export default MusicPlayer;
