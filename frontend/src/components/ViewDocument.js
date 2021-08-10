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
    <Wrapper>
      <div><strong>Type:</strong> {document.type}</div>
      <div><strong>From:</strong> {document.clinicName}</div>
      <div><strong>Patient:</strong> {document.patientName}</div>
      <div><strong>Issued:</strong> {moment(document.timestamp).format('MMMM Do YYYY, hh:mm:ss a')}</div>
      <hr/>
      <div><strong>Service Date: </strong>{document.appointmentDate}</div>
      <div><strong>Service Category:</strong> {document.serviceCategory}</div>
      
      {/* <BackButton onClick={() => {history.goBack();}}>Back</BackButton> */}
      <div>
      <BackButton onClick={() => {
            history.push(`/documents`);
        }}>Back to Receipts</BackButton>
      </div>

    </Wrapper> :
    <Wrapper>Loading ... </Wrapper>

  );
};

const BackButton = styled.button`
  margin-top: 5px;
  background-color: pink;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  color: black;
  &:active {
    background-color: lightblue;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: royalblue;
  &:visited {
    text-decoration: none;
    color: royalblue;
  }
`;

// const BackButton = styled.div`
//   cursor: pointer;
//   color: royalblue;
// `;

const Wrapper = styled.div`
  padding: 5px;
  border-radius: 10px;
  margin: 50px 50px;
  background-color: white;
`;

export default ViewDocument;