import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import { UserContext } from "./UserContext";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

const Welcome = () => {
  const history = useHistory();
  const {
    currentUser,
    setCurrentUser
  } = useContext(UserContext);

  useEffect(() => {
    const checkLocalUser = localStorage.getItem("healthUser");
    if (!checkLocalUser || !currentUser) {
      console.log(`no logged in user found, redirecting...`);
      history.push("/login");
    }
  }, []);

  return (
    currentUser &&
    <div>
      <div><h1>Welcome to the Healthcare-Finder, {
        currentUser.name.substr(0,currentUser.name.indexOf(' '))
      }!</h1></div>
      <div>Your {currentUser.userType} ID is: <h2>{currentUser._id}</h2></div>
      <div>Use it to login in the future.</div>
      {currentUser.userType === "clinician" && 
        <div>
          You are registered with <strong>{currentUser.clinicName}</strong>
        </div>
      }
      
      <div><Link to="/">Click here</Link> to go to the home page.</div>
    </div>
  );
};

export default Welcome;