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
  // let viewerId;

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
          let viewerId;
          if (currentUser.userType === "patient") { 
            viewerId = currentUser._id;
          } else {
            viewerId = currentUser.clinicId;
          }
          console.log(`fetching messages for recipient ${viewerId}`);
          const res = await fetch(`/api/getmessages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({queryParams: { 
              $or: [ { recipientId: viewerId }, { senderId: viewerId } ]
            }})
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
                (messages.filter(message => message.recipientId === currentUser._id
                  || message.recipientId === currentUser.clinicId).length === 0)
                && <>None found</>
              }
              {
                messages.map(message => {
                  if (message.recipientId === currentUser._id
                    || message.recipientId === currentUser.clinicId) {
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
                  }
                })
              } 
            </MessageList> :
            <div>No messages found.</div>
        }
        <h1>Sent messages:</h1>
        {
          messages.length !== 0 ?
            <MessageList>
              {
                (messages.filter(message => message.senderId === currentUser._id 
                  || message.senderId === currentUser.clinicId).length === 0)
                && <>None found</>
              }
              {
                messages.map(message => {
                  if (message.senderId === currentUser._id 
                    || message.senderId === currentUser.clinicId) {
                    return(
                      <div key={message._id}>
                        <hr/>
                        {/* <hr/> {message.read === false && <>NEW</>} */}
                        <Link to={`/viewmessage/${message._id}`}>
                          <div>{message.senderName}{` - `}{message.type}</div>
                          <div>{moment(message.timestamp).format('MMMM Do YYYY, hh:mm:ss a')}</div>
                          <div>Status: {message.status}</div>
                        </Link>
                      </div>
                    )
                  }
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