import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
const moment = require('moment');

const ViewPatients = () => {
  const history = useHistory();
  const {currentUser, 
  } = useContext(UserContext);
  const [patients, setPatients] = useState(null);

  useEffect(() => {
    const checkLocalUser = localStorage.getItem("healthUser");
    if (!checkLocalUser || !currentUser || currentUser.userType === "patient") {
      console.log(`no logged in/authorized user found, redirecting...`);
      history.push("/login");
    } else {
      (async () => {
        try {
          console.log(`fetching patients for clinic ${currentUser.clinicId}`);
          const res = await fetch(`/api/getpatients`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              clinicId: currentUser.clinicId,
            })
          });
          const data = await res.json();

          if (data.status === 200) {
            console.log(`got patients`);
            console.log(patients);
            setPatients(data.patients);
          } else {
            console.log("no patients found");
            console.log(data.patients);
            // window.alert("no patients found");
            setPatients([]);
          }
        
        } catch (err) {
          console.log(`caught error fetching patients`);
          console.log(err);
          window.alert(`caught error fetching patients`)
        }
      })();
    }
  }, []);

  return (
    patients ?
    <Wrapper>
      <h1>Patients for {currentUser.clinicName}:</h1>
      {
        patients.length !== 0 ?
          <div>
            {
              patients.map(patient => {
                return(
                  <div key={patient.senderId}>
                    <hr/> 
                    <Link to={`/profile/${patient.senderId}`}>
                      <div>{patient.senderName}</div>
                    </Link>
                  </div>
                )
              })
            } 
          </div> :
          <div>No patients found.</div>
      }
    </Wrapper> : 
    <Wrapper>
      Loading ...
    </Wrapper>
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

const Wrapper = styled.div`
  padding: 5px;
  border-radius: 10px;
  margin: 50px 50px;
  background-color: white;
`;

export default ViewPatients;