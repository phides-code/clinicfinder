import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
const moment = require('moment');

const Messages = () => {
  const history = useHistory();
  const {currentUser, 
  } = useContext(UserContext);
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    // console.log(`banana..........................................!`);
    const checkLocalUser = localStorage.getItem("healthUser");
    if (!checkLocalUser || !currentUser) {
      console.log(`no logged in user found, redirecting...`);
      history.push("/login");
    } else {
      (async () => {
        // console.log(`about to try.................................`);
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
            <div>
              {
                messages.map(message => {
                  return(
                    <div key={message._id}>
                      <hr/> {message.read === false && <>NEW</>}
                      <Link to={`/viewmessage/${message._id}`}>
                        <div>{message.senderName}{` - `}{message.type}</div>
                        <div>{moment(message.timestamp).format('MMMM Do YYYY, hh:mm:ss a')}</div>
                      </Link>
                    </div>
                  )
                })
              } 
            </div> :
            <div>No messages found.</div>
        }
      </div> : 
      <div>
        Loading ...
      </div>
  );
};

export default Messages;