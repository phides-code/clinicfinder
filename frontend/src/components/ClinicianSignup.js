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
    <div>
      <div><h1>Clinician Signup page - Enter your clinic ID:</h1></div>
      <div>
        <form onSubmit={findProvider}>
          <input name="providerId" type="text" style={{width: "200px"}} required />
          <input type="submit" value="Submit" />
        </form>
      </div>
      {(provider && provider !== "none found") ?
      <div>
        <div><h2>Your Clinic:</h2></div>
        <div>{provider.name}</div>
        <div>{provider.display_phone}</div>
        <div>{provider.location.display_address}</div>

        <form onSubmit={postNewUser}>
          <div><h2>Enter your information to register as a clinician with {provider.name}:</h2></div>
          <div>
            <label>Name: </label>
            <input name="name" type="text" required />
          </div>
          <div>
            <label>Email: </label>
            <input name="email" type="email" required />
          </div>

          <div>
            <label htmlFor="password">Create a Password: </label>
            <input type="password" id="password" name="password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" required />
          </div>

          <div>
            <label htmlFor="confirm_password">Confirm Password</label>
            <input type="password" placeholder="Confirm Password" id="confirm_password" required />
          </div>

          <div>
            <input type="submit" value="Submit" />
            <button type="reset">Reset</button>
          </div>
        </form>

        <PasswordValidation id="message" >
          <h3>Password must contain the following:</h3>
          <p id="letter" className="invalid">A <b>lowercase</b> letter</p>
          <p id="capital" className="invalid">A <b>capital (uppercase)</b> letter</p>
          <p id="number" className="invalid">A <b>number</b></p>
          <p id="length" className="invalid">Minimum <b>8 characters</b></p>
        </PasswordValidation>

      </div> : (provider === "none found") && <div>Clinic not found.</div>
      }
    </div>
  );
};

const PasswordValidation = styled.div`
  display: none;
`;

export default ClinicianSignup;