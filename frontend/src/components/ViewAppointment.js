import React, { useEffect, useContext, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { UserContext } from "./UserContext";
import { Link } from "react-router-dom";
const moment = require('moment');

const ViewAppointment = () => {
  const {currentUser, setAppointmentSuccess} = useContext(UserContext);
  const history = useHistory();
  const {appointmentId} = useParams();
  const [appointment, setAppointment] = useState(null);

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
          const res = await fetch(`/api/getappointmentbyid`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              appointmentId: appointmentId,
              requestingId: thisRequestingId
            })
          });
          const data = await res.json();

          if (data.status === 200) {
            console.log(`got appointment:`);
            console.log(data.appointment);
            setAppointment(data.appointment);
          } else if (data.status === 403) {
            console.log("unauthorized");
            console.log(data.appointment);
            window.alert("unauthorized");
          } else {
            console.log("error fetching appointment");
            console.log(data.appointment);
            window.alert("error fetching appointment");
          }

        } catch (err) {
          console.log(`caught error fetching appointment`);
          console.log(err);
          window.alert(`caught error fetching appointment`);
        }
      })();
    }
  }, []);

  const updateAppointment = async (update) => {
    const res = await fetch(`/api/updateappointment`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appointmentId: appointmentId,
        update: update
      })
    });
    const data = await res.json();
    console.log(`${data.status} ${data.message} updated appointment: `);
    console.log(update);
  }


  const issueReceipt = async () => {
    console.log(`issue receipt for appointment ${appointment._id}`);
    updateAppointment({status: "completed"});
    history.push("/myappointments");
  };

  return (
    appointment ?
    <div>
      <div>Name: {appointment.patientName}</div>
      <div>Clinic: {appointment.clinicName}</div>
      <div>Date: {appointment.date}</div>
      <hr/>
      
      { (currentUser.userType === "clinician")  &&
        <div>
          <button name="receipt" onClick={issueReceipt}>Issue Receipt</button>
          {/* <button name="deny" onClick={postReply}>Deny</button> */}
        </div>
      }
      <div><Link to="/myappointments">Back to appointments</Link></div>
    </div> :
    <div>Loading ... </div>
  );
};

export default ViewAppointment;