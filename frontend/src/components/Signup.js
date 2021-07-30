import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import { UserContext } from "./UserContext";
import { useHistory } from "react-router";
// ///
// import sha256 from 'crypto-js/sha256';
// import hmacSHA512 from 'crypto-js/hmac-sha512';
// import Base64 from 'crypto-js/enc-base64';
const CryptoJS = require("crypto-js");

const Signup = () => {
  const history = useHistory();
  const {
    currentUser,
    setCurrentUser
  } = useContext(UserContext);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "./validatepassword.js";
    script.async = true;
    document.body.appendChild(script);

    const linkElement = document.createElement("link");
    linkElement.setAttribute("rel", "stylesheet");
    linkElement.setAttribute("type", "text/css");
    linkElement.setAttribute("href", "validatepassword.css");
    document.getElementsByTagName("head")[0].appendChild(linkElement);
    
    return () => {
      document.body.removeChild(script);
    }
  }, []);

  const postNewUser = async (ev) => {
    ev.preventDefault();
    console.log(`running postNewUser...`);

    // const hashedPassword = await bcrypt.hash(ev.target.password.value, 10);
    const hashedPassword = CryptoJS.AES.encrypt(ev.target.password.value, 'hello').toString();
    // console.log(`hashedPassword: ${hashedPassword}`);
    //hashedPassword: U2FsdGVkX1/tgQY1LLef9dZmhaeOeJwqNAbrPj68r1s=

    const newUserObj = {
      name: ev.target.name.value,
      email: ev.target.email.value,
      phone: ev.target.phone.value,
      address: ev.target.address.value,
      city: ev.target.city.value,
      province: ev.target.province.value,
      postalcode: ev.target.postalcode.value,
      country: ev.target.country.value,
      userType: ev.target.userType.value,
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
          setCurrentUser(data.newUser);
          history.push("/");
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

  return (
    <div>
      <div><h1>Signup page</h1></div>

      <div>
        <form onSubmit={postNewUser}>
          <div>
            <label>FullName: </label>
            <input name="name" type="text" required />
          </div>
          <div>
            <label>Email: </label>
            <input name="email" type="email" required />
          </div>
          <div>
            <label>Phone: </label>
            <input name="phone" type="phone" required />
          </div>
          <div>
            <label>Address: </label>
            <input name="address" type="address" required />
          </div>
          <div>
            <label>City: </label>
            <input name="city" type="text" required />
          </div>
          <div>
            <label>Province: </label>
            <input name="province" type="text" required />
          </div>
          <div>
            <label>Postal Code: </label>
            <input name="postalcode" type="text" required />
          </div>
          <div>
            <label>Country: </label>
            <input name="country" type="text" required />
          </div>
          <div>
            <>User type:</>
            <input type="radio" name="userType" value="patient" id="patient" required></input>
            <label htmlFor="patient">Patient</label>
            <input type="radio" name="userType" value="clinician" id="clinician"></input>
            <label htmlFor="clinician">Clinician</label>
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" required />
          </div>

          <div>
            <label htmlFor="confirm_password">Confirm Password</label>
            <input type="password" placeholder="Confirm Password" id="confirm_password" required />
          </div>

          <div>
            <input type="submit" value="Submit New User" />
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

      </div>
    </div>
  );
};

const PasswordValidation = styled.div`
  display: none;
`;


export default Signup;