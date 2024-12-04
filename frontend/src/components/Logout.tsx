import React from "react";

const logout = async () => {
  try {
    const response = await fetch("http://localhost:8080/logout", {
      method: "POST",
      credentials: "include"
    });

    if (response.ok) {
      window.location.href = "http://localhost:5173/login";
    } else {
      console.error("Failed to logging out.");
    }
  } catch (error) {
    console.error("Some error occured while logging out:", error);
  }
};

const Logout: React.FC = () => {
  return <button onClick={logout}>Log out</button>;
};

export default Logout;
