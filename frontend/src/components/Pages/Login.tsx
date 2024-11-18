import React from "react";
import { Button } from "@/components/calendarui/button";
import GoogleIcon from "@/assets/google-icon-logo.svg";
import RainEffect from "../ui/Rain";

const Login: React.FC = () => {
  const googleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <>
      <div className="bg-gradient-to-b from-slate-700 to-slate-800 text-white h-screen">
        <RainEffect />
        <h2 className="flex items-center justify-center pt-4 xl:text-9xl lg:text-6xl md:text-6xl text-5xl font-bold skew-y-3 shadow-lg bg-slate-500 text-black ">
          StudyHelper
        </h2>
        <div className="mt-20 xl:text-3xl lg:text-2xl md:text-xl">
          <h2 className="flex items-center justify-center">Discover a smarter way to learn!</h2>
          <br />
          <p className="text-center text-slate-400 xl:px-28 lg:px-20 md:px-16 px-8">
            StudyHelper offers you a calm, distraction-free environment to focus on your studies
            while effortlessly tracking your progress.
            <br />
            Start your journey toward success today!
          </p>
        </div>
        <Button
          className="rounded-full absolute mt-20 p-6 left-1/2 w-2/3 transform -translate-x-1/2"
          onClick={googleLogin}
        >
          <img src={GoogleIcon} alt="Google" className="w-5 h-5" /> Login with Google
        </Button>
      </div>
    </>
  );
};

export default Login;
