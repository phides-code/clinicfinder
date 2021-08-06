import React, { useContext, useState } from "react";
import { UserContext } from "./UserContext";
import styled from "styled-components";


const RequestAppointment = ({clinic}) => {
  const {currentUser, requestAppointment, setRequestAppointment,
    messageSuccess, setMessageSuccess} = useContext(UserContext);

  const postMessage = async (ev) => {
    ev.preventDefault();

    const messageObject = {
      recipient: clinic.id,
      senderId: currentUser._id,
      senderName: currentUser.name,
      senderEmail: currentUser.email,
      senderPhone: currentUser.phone,
      requestedDate: ev.target.requestedDate.value,
      timestamp: Date.now(),
      message: ev.target.messagetext.value,
      type: "appointmentRequest",
      read: false
    };

    console.log("posting message: ");
    console.log(messageObject);

    try {
      const res = await fetch("/api/postmessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageObject)
      });
      const data = await res.json();

      if (data.status === 201) {
        setRequestAppointment(false);
        setMessageSuccess(true);
        ev.target.messagetext.value = "";
        
      } else {
        window.alert(`got unexpected status:
        ${data.status}: ${data.message}`);
      }
    } catch (err) {
      console.log(`postMessage caught an error:`);
      console.log(err);
      window.alert(`postMessage caught an error...`);
    }
  };

  return (
    <div>
      <h1>
        Request an Appointment with {clinic.name}:
      </h1>

      <div>Your Name: {currentUser.name}</div>
        <div>Email: {currentUser.email}</div>
        <div>Phone: {currentUser.phone}</div>
        <form onSubmit={postMessage}>
          <div>Requested Date: <input type="datetime-local" name="requestedDate" required/></div>
          <div>Message (optional): </div>
          <div><MessageText name="messagetext"/></div>
          <input type="submit" value="Send"/>
          <button onClick={() => {setRequestAppointment(false)}}>Cancel</button>
        </form>
    </div>
  );
};

const MessageText = styled.textarea`
  width: 300px;
  height: 200px;
`;

export default RequestAppointment;