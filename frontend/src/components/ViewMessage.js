import React, { useEffect, useContext, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { UserContext } from "./UserContext";
const moment = require('moment');

const ViewMessage = () => {
  const {currentUser} = useContext(UserContext);
  const history = useHistory();
  const {messageId} = useParams();
  const [message, setMessage] = useState(null);

  const markRead = async () => {
    const res = await fetch(`/api/markread`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messageId: messageId,
        newState: true
      })
    });
    const data = await res.json();
    console.log(`${data.status} ${data.message} marked it read`);
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
            setMessage(data.message);
            if (data.message.read === false) { await markRead(); }
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
      <div>{message.type}</div>
      <div>From: {message.senderName}</div>
      <div>Sent: {moment(message.timestamp).format('MMMM Do YYYY, hh:mm:ss a')}</div>
      <hr/>
      <div>{message.message}</div>

    </div> :
    <div>Loading ... </div>
  );
};

export default ViewMessage;