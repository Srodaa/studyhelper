import React from "react";
import styles from  "../styles/login.module.css";

function Login() {
  const googleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <>
      <div >
        <h2>Welcome to StudyHelper</h2>
        <button onClick={googleLogin}>Login with Google </button>
      </div>
    </>
  );
}

export default Login;
