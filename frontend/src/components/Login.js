import React, { useState, useContext } from "react";
import styled from "styled-components";
import { UserContext } from "./UserContext";
import { useHistory } from "react-router";

const Login = () => {

  const [invalidUser, setInvalidUser] = useState(null);
  const history = useHistory();
  const {
    currentUser,
    setCurrentUser
  } = useContext(UserContext);

  const userLogin = async (ev) => {
    ev.preventDefault();
    console.log(`got patientId: ${ev.target.patientId.value}`);
    if (ev.target.patientId.value !== "123") {
      setInvalidUser(true);

    } else {
      setCurrentUser("123");
      localStorage.setItem("healthUser", "ev.target.patientId.value");
      //localStorage.setItem("newOrder", JSON.stringify(data.newOrder));
      history.push("/");
    }

  };

  return (
    <div>
      <h1>Login page</h1>
      <div>
        <form onSubmit={userLogin}>
          <label>Patient ID</label>
          <input name="patientId"></input>
          <input type="submit" value="Login"/>
          {
            invalidUser && <div>*** invalid patient ID ***</div>
          }
        </form>
      </div>
    </div>
  );
};

export default Login;