import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
const moment = require('moment');

const MyAppointments = () => {
  const history = useHistory();
  const {currentUser, 
  } = useContext(UserContext);
  const [appointments, setAppointments] = useState(null);

  useEffect(() => {
    const checkLocalUser = localStorage.getItem("healthUser");
    if (!checkLocalUser || !currentUser) {
      console.log(`no logged in user found, redirecting...`);
      history.push("/login");
    } else {
      (async () => {
        // if this is a patient, get appointments for this patient ID
        // if this is a clinician, get appointments for this clinic's ID
        try {
          let thisViewerId;
          if (currentUser.userType === "patient") { 
            thisViewerId = currentUser._id;
          } else {
            thisViewerId = currentUser.clinicId;
          }
          console.log(`fetching appointments for viewer ${thisViewerId}`);
          const res = await fetch(`/api/getappointments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              viewerId: thisViewerId,
              viewerType: currentUser.userType
            })
          });
          const data = await res.json();

          if (data.status === 200) {
            console.log(`got appointments`);
            setAppointments(data.appointments);
          } else {
            console.log("no appointments found");
            // console.log(data.appointments);
            // window.alert("no appointments found");
            setAppointments(null);
          }
        
        } catch (err) {
          console.log(`caught error fetching appointments`);
          console.log(err);
          window.alert(`caught error fetching appointments`)
        }
      })();
    }
  }, []);

  return (
    appointments ?
    <Wrapper>
      <h2>Upcoming Appointments :</h2>
      {
        appointments.length !== 0 ?
          <AppointmentList>
            {
              (appointments.filter(appointment => appointment.status === "confirmed").length === 0)
              && <>none found</>
            }

            {
              appointments.map((appointment, i) => {
                if (appointment.status === "confirmed")
                {
                  return(
                    <div key={appointment._id}>
                      <hr/> 
                      <StyledLink to={`/viewappointment/${appointment._id}`}>
                        <div><strong>Clinic:</strong> {appointment.clinicName}</div>
                        <div><strong>Service Category:</strong> {appointment.serviceCategory}</div>
                        <div><strong>Date:</strong> {appointment.date}</div>
                      </StyledLink>
                    </div>
                  )
                }
              })
            } 
          </AppointmentList> :
          <div>No appointments found.</div>
      }
      <h2>Completed Appointments :</h2>
      {
        appointments.length !== 0 ?
          <AppointmentList>
            {
              (appointments.filter(appointment => appointment.status === "completed").length === 0)
              && <>none found</>
            }
            {
              appointments.map(appointment => {
                if (appointment.status === "completed") {
                  return(
                    <div key={appointment._id}>
                      <hr/> 
                      <StyledLink to={`/viewappointment/${appointment._id}`}>
                        <div><strong>Clinic:</strong> {appointment.clinicName}</div>
                        <div><strong>Service Category:</strong> {appointment.serviceCategory}</div>
                        <div><strong>Date:</strong> {appointment.date}</div>
                      </StyledLink>
                    </div>
                  )
                }
              })
            } 
          </AppointmentList> :
          <div>No appointments found.</div>
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

const AppointmentList = styled.div`
  display: flex;
	flex-direction: column-reverse;
`;

const Wrapper = styled.div`
  padding: 5px;
  border-radius: 10px;
  margin: 50px 50px;
  background-color: white;
`;

export default MyAppointments;