import React, { useEffect, useContext, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { UserContext } from "./UserContext";
import styled from "styled-components";
import { Link } from "react-router-dom";
const moment = require('moment');

const ViewDocument = () => {
  const {currentUser} = useContext(UserContext);
  const history = useHistory();
  const {documentId} = useParams();
  const [document, setDocument] = useState(null);

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
          console.log(`looking up documentId ${documentId}`);
          const res = await fetch(`/api/getdocumentbyid`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              documentId: documentId,
              requestingId: thisRequestingId
            })
          });
          const data = await res.json();

          if (data.status === 200) {
            console.log(`got document:`);
            console.log(data.document);
            setDocument(data.document);

          } else if (data.status === 403) {
            console.log("unauthorized");
            console.log(data.message);
            window.alert("unauthorized");
          } else {
            console.log("error fetching document");
            console.log(data.message);
            window.alert("error fetching document");
          }

        } catch (err) {
          console.log(`caught error fetching document`);
          console.log(err);
          window.alert(`caught error fetching document`);
        }
      })();
    }
  }, []);

  return (
    document ?
    <div>
      <div>Type: {document.type}</div>
      <div>From: {document.clinicName}</div>
      <div>To: {document.patientName}</div>
      <div>Sent: {moment(document.timestamp).format('MMMM Do YYYY, hh:mm:ss a')}</div>
      <hr/>
      <div>Service Date: {document.appointmentDate}</div>
      <div>Service Category: {document.serviceCategory}</div>
      
      <BackButton onClick={() => {history.goBack();}}>Back</BackButton>
    </div> :
    <div>Loading ... </div>

  );
};

const StyledLink = styled(Link)`
  text-decoration: none;
  color: royalblue;
  &:visited {
    text-decoration: none;
    color: royalblue;
  }
`;


const BackButton = styled.div`
  cursor: pointer;
  color: royalblue;
`;

export default ViewDocument;