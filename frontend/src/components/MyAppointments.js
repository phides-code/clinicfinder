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
            console.log(data.appointments);
            // window.alert("no appointments found");
            setAppointments([]);
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
    <div>
      <h1>Upcoming Appointments :</h1>
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
                      <Link to={`/viewappointment/${appointment._id}`}>
                        <div>Patient: {appointment.patientName}</div>
                        <div>Date: {appointment.date}</div>
                        <div>Status: {appointment.status}</div>
                      </Link>
                    </div>
                  )
                }
              })
            } 
          </AppointmentList> :
          <div>No appointments found.</div>
      }
      <h1>Completed Appointments :</h1>
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
                      {/* {appointment.read === false && <>NEW</>} */}
                      <Link to={`/viewappointment/${appointment._id}`}>
                        <div>Patient: {appointment.patientName}</div>
                        <div>Date: {appointment.date}</div>
                        <div>Status: {appointment.status}</div>
                      </Link>
                    </div>
                  )
                }
              })
            } 
          </AppointmentList> :
          <div>No appointments found.</div>
      }
    </div> : 
    <div>
      Loading ...
    </div>
  );
};

const AppointmentList = styled.div`
  display: flex;
	flex-direction: column-reverse;
`;


export default MyAppointments;