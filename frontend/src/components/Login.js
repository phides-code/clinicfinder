import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { UserContext } from "./UserContext";
import { useHistory } from "react-router";
const CryptoJS = require("crypto-js");

const Login = () => {

  const [invalidUser, setInvalidUser] = useState(null);
  const history = useHistory();
  const {
    currentUser,
    setCurrentUser,
  } = useContext(UserContext);

  useEffect(() => {
    const checkLocalUser = localStorage.getItem("healthUser");
    if (checkLocalUser) {
      console.log(`checkLocalUser yes, redirecting...`);
      history.push("/");
    }
  }, []);

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
        localStorage.setItem("healthUser", ev.target.patientId.value);
        localStorage.setItem("healthUserHash", hashedPassword);

        history.push("/");      
      } else if (data.status === 403){
        // invalid login
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
    <Wrapper>
      <h1>Login</h1>
      {/* <div> */}
        <LoginForm onSubmit={userLogin}>
          <div><label>Patient or Clinician ID: </label></div>
          <div><input name="patientId" required></input></div>
          
          <div><label>Password: </label></div>
          <div><input type="password" name="password" required></input></div>
          {
            invalidUser && <div>*** Invalid Login ***</div>
          }
          <LoginDiv>
            <LoginButton type="submit" value="Login"/>
          </LoginDiv>
          
          
        </LoginForm>
      {/* </div> */}
    </Wrapper>
  );
};

const LoginForm = styled.form``;

const LoginButton = styled.input`
  margin: 20px 0px;
  padding: 10px 20px;
`;

const LoginDiv = styled.div`
  display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	justify-content: center;
	align-items: center;
	align-content: center;
`;

const Wrapper = styled.div`
  border-radius: 10px;
  margin: 50px 50px;
  background-color: white;
  display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	justify-content: center;
	align-items: center;
	align-content: center;
`;

export default Login;