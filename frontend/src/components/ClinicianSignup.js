import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { UserContext } from "./UserContext";
import { useHistory } from "react-router";
const CryptoJS = require("crypto-js");

const ClinicianSignup = () => {
  const [provider, setProvider] = useState(null);
  const history = useHistory();
  const {
    // currentUser,
    setCurrentUser
  } = useContext(UserContext);

  useEffect(() => {
    const checkLocalUser = localStorage.getItem("healthUser");
    if (checkLocalUser) {
      console.log(`checkLocalUser yes, redirecting...`);
      history.push("/");
    }

    // adding a script and stylesheet for password complexity verification widget
    console.log("activating password widget...");
    const script = document.createElement('script');
    script.src = "./validatepassword.js";
    script.async = true;
    document.body.appendChild(script);

    const linkElement = document.createElement("link");
    linkElement.setAttribute("rel", "stylesheet");
    linkElement.setAttribute("type", "text/css");
    linkElement.setAttribute("href", "validatepassword.css");
    document.getElementsByTagName("head")[0].appendChild(linkElement);
    
    // return () => {
    //   document.body.removeChild(script);
    // }
  }, [provider]);

  const postNewUser = /*async*/ (ev) => {
    ev.preventDefault();
    console.log(`running postNewUser...`);

    const hashedPassword = CryptoJS.AES.encrypt(ev.target.password.value, 'hello').toString();

    const newUserObj = {
      name: ev.target.name.value,
      email: ev.target.email.value,
      phone: provider.phone,
      address: (provider.location.address1 + provider.location.address2 + provider.location.address3),
      city: provider.location.city,
      province: provider.location.state,
      postalcode: provider.location.zip_code,
      country: provider.location.country,
      userType: "clinician",
      clinicId: provider.id,
      clinicName: provider.name,
      password: hashedPassword
    };

    (async () => {
      try {
        const res = await fetch("/api/users/new", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUserObj)
        });
        const data = await res.json();

        if (data.status === 201) {
          localStorage.setItem("healthUser", data.newUser._id);
          localStorage.setItem("healthUserHash", hashedPassword);
          setCurrentUser(data.newUser);
          history.push("/welcome");
        } else {
          window.alert(`got unexpected status:
            ${data.status}: ${data.message}`);
        }

      } catch (err) {
        console.log(`postNewUser caught an error:`);
        console.log(err);
        window.alert(`postNewUser caught an error...`);
      }
    })();
  };

  const findProvider = async (ev) => {
    ev.preventDefault();
    try {
      const res = await fetch (`/api/provider/${ev.target.providerId.value}`);
      const data = await res.json();

      if (data.status === 200) {
        console.log(`got data.provider.id: ${data.provider.id}`);
        setProvider(data.provider);
      } else {
        console.log(`findProvider got an error:`);
        setProvider("none found");
      }

    } catch (err) {
      console.log(`findProvider caught an error:`);
      console.log(err);
      setProvider("none found");
    } 
  };

  return (
    <Wrapper>
      <h1>Clinician Signup</h1>

      { !provider && 
        <form onSubmit={findProvider}>
          <div>Enter your clinic ID: </div>
          <input name="providerId" type="text" style={{width: "200px"}} required />
          <SignupDiv>
            <SignupButton type="submit" value="Submit" />
          </SignupDiv>
        </form>
      }

      {(provider && provider !== "none found") ?
      <div>
        <ClinicInfo>
          <h2>Your Clinic:</h2>
          <div>{provider.name}</div>
          <div>{provider.display_phone}</div>
          <div>{provider.location.display_address}</div>
          <h2>Enter your information to register as a clinician with {provider.name}:</h2>
        </ClinicInfo>

        <LoginForm onSubmit={postNewUser}>
          
          <div>
            <label>Name: </label></div>
            <div><StyledInput name="name" type="text" required />
          </div>
          <div>
            <label>Email: </label></div>
            <div><StyledInput name="email" type="email" required />
          </div>

          <div>
            <label htmlFor="password">Create a Password: </label></div>
            <div><StyledInput type="password" id="password" name="password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" required />
          </div>

          <div>
            <label htmlFor="confirm_password">Confirm Password</label></div>
            <div><StyledInput type="password" placeholder="Confirm Password" id="confirm_password" required />
          </div>

          <SignupDiv>
            <SignupButton type="submit" value="Submit" />
            <ResetButton onClick={() => {setProvider(null);}} type="reset" value="Reset"/>
          </SignupDiv>
        </LoginForm>

        <PasswordValidation id="message" >
          <h3>Password must contain the following:</h3>
          <p id="letter" className="invalid">A <b>lowercase</b> letter</p>
          <p id="capital" className="invalid">A <b>capital (uppercase)</b> letter</p>
          <p id="number" className="invalid">A <b>number</b></p>
          <p id="length" className="invalid">Minimum <b>8 characters</b></p>
        </PasswordValidation>

      </div> : (provider === "none found") && <div>Clinic not found.</div>
      }
    </Wrapper>
  );
};

const ClinicInfo = styled.div`
  background-color: lightgray;
  border-radius: 5px;
  padding: 10px 20px;
  margin-bottom: 5px;
`;

const StyledInput = styled.input`
  min-width: 260px;
`;

const LoginForm = styled.form`
  display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	justify-content: center;
	align-items: center;
	align-content: center;
`;

const Wrapper = styled.div`
  padding: 5px;
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

const SignupButton = styled.input`
  margin: 20px 5px;
  padding: 10px 20px;
  background: lightblue;
  border: none;
  border-radius: 5px;
  &:active {
    opacity: 60%;
  }
`;

const ResetButton = styled.input`
  margin: 20px 5px;
  padding: 10px 20px;
  background: lightpink;
  border: none;
  border-radius: 5px;
  &:active {
    opacity: 60%;
  }
`;

const SignupDiv = styled.div`
  display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: center;
	align-items: center;
	align-content: center;
`;

const PasswordValidation = styled.div`
  display: none;
`;

export default ClinicianSignup;