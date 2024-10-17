import axios from "axios";
import React, { useEffect, useState } from "react";

function Home() {
  interface User {
    name: string;
    email: string;
    picture: string;
  }

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/user-info", { withCredentials: true })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error occured: ", error);
      });
  }, []);

  return (
    <div>
      <h2>Helo szia be vagy jelentkezve!</h2>
      {user ? (
        <div>
          <p>{user.name}</p>
          <p>{user.email}</p>
          {user.picture && (
            <img
              src={user.picture}
              alt="User Profile"
              referrerPolicy="no-referrer"
            ></img>
          )}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}

export default Home;
