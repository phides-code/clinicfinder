import React, { useState, useContext } from "react";
import styled from "styled-components";
import { UserContext } from "./UserContext";
import { useHistory } from "react-router";
const CryptoJS = require("crypto-js");

const Login = () => {

  const [invalidUser, setInvalidUser] = useState(null);
  const history = useHistory();
  const {
    currentUser,
    setCurrentUser
  } = useContext(UserContext);

  const userLogin = async (ev) => {
    ev.preventDefault();
    console.log(`verifying patientId: ${ev.target.patientId.value}`);
    const hashedPassword = CryptoJS.AES.encrypt(ev.target.password.value, 'hello').toString();

    try {
      const res = await fetch ("/api/users/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: ev.target.patientId.value, 
          password: hashedPassword
        })
      });
      const data = await res.json();

      if (data.status === 200) {
        // valid login
        console.log("valid login");
        setCurrentUser(data.user);
        localStorage.setItem("healthUser", "ev.target.patientId.value");

        history.push("/");      
      } else if (data.status === 403){
        // invalid user
        console.log("invalid login");
        setInvalidUser(true);
        ev.target.patientId.value = "";
        ev.target.password.value = "";

      } else {
        window.alert(`got unexpected status:
        ${data.status}: ${data.message}`);
      }

    } catch (err) {
      console.log(`userLogin caught an error:`);
      console.log(err);
      window.alert(`userLogin caught an error...`);
    }
  };

  return (
    <div>
      <h1>Login page</h1>
      <div>
        <form onSubmit={userLogin}>
          <div>
            <label>Patient or Clinician ID: </label>
            <input name="patientId" required></input>
          </div>
          <div>
            <label>Password: </label>
            <input type="password" name="password" required></input>
          </div>
          <div>
            <input type="submit" value="Login"/>
          </div>
          
          {
            invalidUser && <div>*** Invalid Login ***</div>
          }
        </form>
      </div>
    </div>
  );
};

export default Login;