import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import { UserContext } from "./UserContext";
import { useHistory } from "react-router";
const CryptoJS = require("crypto-js");

const Signup = () => {
  const history = useHistory();
  const {
    currentUser,
    setCurrentUser
  } = useContext(UserContext);

  useEffect(() => {
    const checkLocalUser = localStorage.getItem("healthUser");
    if (checkLocalUser) {
      console.log(`checkLocalUser yes, redirecting...`);
      history.push("/");
    }

    // adding a script and stylesheet for password complexity verification widget
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

    const hashedPassword = CryptoJS.AES.encrypt(ev.target.password.value, 'hello').toString();

    const newUserObj = {
      name: ev.target.name.value,
      email: ev.target.email.value,
      phone: ev.target.phone.value,
      address: ev.target.address.value,
      city: ev.target.city.value,
      province: ev.target.province.value,
      postalcode: ev.target.postalcode.value,
      country: ev.target.country.value,
      userType: "patient",
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

  return (
    <Wrapper>
      <div><h1>Patient Signup</h1></div>
        <form onSubmit={postNewUser}>
          <div>
            <label>Name: </label></div>
            <div><StyledInput name="name" type="text" required />
          </div>
          <div>
            <label>Email: </label></div>
            <div><StyledInput name="email" type="email" required />
          </div>
          <div>
            <label>Phone: </label></div>
            <div><StyledInput name="phone" type="phone" required />
          </div>
          <div>
            <label>Address: </label></div>
            <div><StyledInput name="address" type="address" required />
          </div>
          <div>
            <label>City: </label></div>
            <div><StyledInput name="city" type="text" required />
          </div>
          <div>
            <label>Province: </label></div>
          <div><StyledInput name="province" type="text" required />
          </div>
          <div>
            <label>Postal Code: </label></div>
            <div><StyledInput name="postalcode" type="text" required />
          </div>
          <div>
            <label>Country: </label></div>
            <div><StyledInput name="country" type="text" required />
          </div>

          <div>
            <label htmlFor="password">Password: </label></div>
            <div><StyledInput type="password" id="password" name="password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" required />
          </div>

          <div>
            <label htmlFor="confirm_password">Confirm Password: </label></div>
            <div><StyledInput type="password" placeholder="Confirm Password" id="confirm_password" required />
          </div>

          <SignupDiv>
            <SignupButton type="submit" value="Submit" />
            {/* <button type="reset">Reset</button> */}
            <ResetButton type="reset"/>
          </SignupDiv>
        </form>

        <PasswordValidation id="message" >
          <h3>Password must contain:</h3>
          <p id="letter" className="invalid">A <b>lowercase</b> letter</p>
          <p id="capital" className="invalid">An <b>uppercase</b> letter</p>
          <p id="number" className="invalid">A <b>number</b></p>
          <p id="length" className="invalid">Minimum <b>8 characters</b></p>
        </PasswordValidation>
    </Wrapper>
  );
};

const StyledInput = styled.input`
  min-width: 260px;
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



export default Signup;