import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
const moment = require('moment');

const Messages = () => {
  const history = useHistory();
  const {currentUser, 
  } = useContext(UserContext);
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    const checkLocalUser = localStorage.getItem("healthUser");
    if (!checkLocalUser || !currentUser) {
      console.log(`no logged in user found, redirecting...`);
      history.push("/login");
    } else {
      (async () => {
        // if this is a patient, get messages for this patient ID
        // if this is a clinician, get messages for this clinic's ID
        try {
          let thisRecipientId;
          if (currentUser.userType === "patient") { 
            thisRecipientId = currentUser._id;
          } else {
            thisRecipientId = currentUser.clinicId;
          }
          console.log(`fetching messages for recipient ${thisRecipientId}`);
          const res = await fetch(`/api/getmessages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recipientId: thisRecipientId })
          });
          const data = await res.json();

          if (data.status === 200) {
            console.log(`got messages`);
            setMessages(data.messages);
          } else {
            console.log("no messages found");
            console.log(data.message);
            window.alert("no messages found");
            setMessages([]);
          }
        
        } catch (err) {
          console.log(`caught error fetching messages`);
          console.log(err);
          window.alert(`caught error fetching messages`)
        }
      })();
    }
  }, []);

  return (
    messages ?
      <div>
        <h1>Messages:</h1>
        {
          messages.length !== 0 ?
            <MessageList>
              {
                messages.map(message => {
                  return(
                    <div key={message._id}>
                      <hr/> {message.read === false && <>NEW</>}
                      <Link to={`/viewmessage/${message._id}`}>
                        <div>{message.senderName}{` - `}{message.type}</div>
                        <div>{moment(message.timestamp).format('MMMM Do YYYY, hh:mm:ss a')}</div>
                        <div>Status: {message.status}</div>
                      </Link>
                    </div>
                  )
                })
              } 
            </MessageList> :
            <div>No messages found.</div>
        }
      </div> : 
      <div>
        Loading ...
      </div>
  );
};

const MessageList = styled.div`
  display: flex;
	flex-direction: column-reverse;
`;

export default Messages;