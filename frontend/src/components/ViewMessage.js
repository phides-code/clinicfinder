import React, { useEffect, useContext, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { UserContext } from "./UserContext";
import { Link } from "react-router-dom";
const moment = require('moment');

const ViewMessage = () => {
  const {currentUser, setMessageSuccess} = useContext(UserContext);
  const history = useHistory();
  const {messageId} = useParams();
  const [message, setMessage] = useState(null);

  const updateMessage = async (update) => {
    const res = await fetch(`/api/updatemessage`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messageId: messageId,
        update: update
      })
    });
    const data = await res.json();
    console.log(`${data.status} ${data.message} updated message: `);
    console.log(update);
  }

  // respond to patient's request, either confirm or deny appointment
  const postReply = async (ev) => {
    ev.preventDefault();

    let messageText;
    let messageType;
    if (ev.target.name === "confirm") {
      messageText = "your appointment has been confirmed";
      messageType = "confirmed";

      // if confirmed, creating appointment in db
      try {
        const res = await fetch("/api/createappointment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patientId: message.senderId,
            patientName: message.senderName,
            patientEmail: message.senderEmail,
            patientPhone: message.senderPhone,
            date: message.requestedDate,
            clinicId: currentUser.clinicId,
            clinicName: currentUser.clinicName,
            requestId: message._id,
            status: "confirmed"
          })
        });
        const data = await res.json();
  
        if (data.status === 201) {
          console.log("created appointment in db");
        } else {
          console.log(`got unexpected status:
          ${data.status}: ${data.message}`);
        }
      } catch (err) {
        console.log(`postReply caught an error while creating appointment:`);
        console.log(err);
        window.alert(`postReply caught an error while creating appointment.`);
      }
    } else {
      messageText = "your appointment has been denied";
      messageType = "denied";
    }

    // post a message to the patient confirming or denying the appointment
    try {
      const res = await fetch("/api/postmessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: message.senderId,
          senderId: currentUser.clinicId,
          senderName: (currentUser.name + " at " + currentUser.clinicName),
          senderEmail: currentUser.email,
          senderPhone: currentUser.phone,
          timestamp: Date.now(),
          message: messageText,
          type: messageType,
          status: messageType,
          read: false
        })
      });
      const data = await res.json();

      if (data.status === 201) {
        // set the request status to "confirmed" or "denied"
        await updateMessage({status: messageType});
        history.push("/messages");        
      } else {
        window.alert(`got unexpected status:
        ${data.status}: ${data.message}`);
      }
    } catch (err) {
      console.log(`postReply caught an error:`);
      console.log(err);
      window.alert(`postReply caught an error...`);
    }
  };

  useEffect(() => {
    const checkLocalUser = localStorage.getItem("healthUser");
    if (!checkLocalUser || !currentUser) {
      console.log(`no logged in user found, redirecting...`);
      history.push("/login");
    } else {
      (async () => {
        try {
          let thisRequestingId;
          if (currentUser.userType === "patient") {
            thisRequestingId = currentUser._id;
          } else {
            thisRequestingId = currentUser.clinicId;
          }
          const res = await fetch(`/api/getmessagebyid`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messageId: messageId,
              requestingId: thisRequestingId
            })
          });
          const data = await res.json();

          if (data.status === 200) {
            console.log(`got message:`);
            console.log(data.message);
            setMessage(data.message);
            if (data.message.read === false) { await updateMessage({read: true}); }
          } else if (data.status === 403) {
            console.log("unauthorized");
            console.log(data.message);
            window.alert("unauthorized");
          } else {
            console.log("error fetching message");
            console.log(data.message);
            window.alert("error fetching message");
          }

        } catch (err) {
          console.log(`caught error fetching message`);
          console.log(err);
          window.alert(`caught error fetching message`);
        }
      })();
    }
  }, []);

  return (
    message ?
    <div>
      <div>Type: {message.type}</div>
      <div>Status: {message.status}</div>
      <div>From: {message.senderName}</div>
      <div>Sent: {moment(message.timestamp).format('MMMM Do YYYY, hh:mm:ss a')}</div>
      <hr/>
      <div>Message: {message.requestedDate}</div>
      <div>{message.message}</div>
      
      { (currentUser.userType === "clinician")  &&
        <div>
          <button name="confirm" onClick={postReply}>Confirm</button>
          <button name="deny" onClick={postReply}>Deny</button>
        </div>
      }
      <div><Link to="/messages">Back to Messages</Link></div>
    </div> :
    <div>Loading ... </div>
  );
};

export default ViewMessage;