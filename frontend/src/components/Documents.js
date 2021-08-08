import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
const moment = require('moment');

const Documents = () => {
  const history = useHistory();
  const {currentUser, 
  } = useContext(UserContext);
  const [documents, setdocuments] = useState(null);

  useEffect(() => {
    const checkLocalUser = localStorage.getItem("healthUser");
    if (!checkLocalUser || !currentUser) {
      console.log(`no logged in user found, redirecting...`);
      history.push("/login");
    } else {
      (async () => {
        try {
          console.log(`fetching documents for patient ID ${currentUser.patientId}`);
          const res = await fetch(`/api/getdocuments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              queryParams: { 
              patientId: currentUser.patientId 
              }
            })
          });
          const data = await res.json();

          if (data.status === 200) {
            console.log(`got documents`);
            setdocuments(data.documents);
          } else {
            console.log("no documents found");
            console.log(data.document);
            window.alert("no documents found");
            setdocuments([]);
          }
        
        } catch (err) {
          console.log(`caught error fetching documents`);
          console.log(err);
          window.alert(`caught error fetching documents`)
        }
      })();
    }
  }, []);

  return (
    documents ?
      <div>
        <h1>Documents for {currentUser.name}:</h1>
        {
          documents.length !== 0 ?
            <documentList>
              {
                (documents.filter(document => document.recipientId === currentUser._id
                  || document.recipientId === currentUser.clinicId).length === 0)
                && <>None found</>
              }
              {
                documents.map(document => {
                  return(
                    <div key={document._id}>
                      <hr/> 
                      <Link to={`/viewdocument/${document._id}`}>
                        <div>{document.type}</div>
                        <div>{document.serviceCategory} at {document.clinicName}</div>
                        <div>{moment(document.timestamp).format('MMMM Do YYYY, hh:mm:ss a')}</div>
                      </Link>
                    </div>
                  )
                })
              } 
            </documentList> :
            <div>No documents found.</div>
        }
      </div> : 
      <div>
        Loading ...
      </div>
  );
};

const documentList = styled.div`
  display: flex;
	flex-direction: column-reverse;
`;

export default Documents;