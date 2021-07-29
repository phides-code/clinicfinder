import React from "react";
import styled from "styled-components";
import { UserContext } from "./UserContext";

const Signup = () => {

  const postNewUser = (ev) => {
    ev.preventDefault();
    console.log(`running postNewUser...`);
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
    };

    (async () => {
      try {
        const res = await fetch("/api/users/new", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUserObj)
        });
        
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
            <input type="submit" value="Submit New User"></input>
            <button type="reset">Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;