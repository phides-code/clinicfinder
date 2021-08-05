import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "./UserContext";
import { useHistory } from "react-router";
import RequestAppointment from "./RequestAppointment";
import { Link } from "react-router-dom";

const ClinicDetail = () => {
  const history = useHistory();
  const {currentUser, requestAppointment, setRequestAppointment,
    messageSuccess, setMessageSuccess
  } = useContext(UserContext);
  const {clinicId} = useParams();
  console.log(`Looking up clinic details for id ${clinicId}`);

  const [clinic, setClinic] = useState(null);

  useEffect(() => {
    const checkLocalUser = localStorage.getItem("healthUser");
    if (!checkLocalUser || !currentUser) {
      console.log(`no logged in user found, redirecting...`);
      history.push("/login");
    }

    (async () =>{
      try {
        const res = await fetch(`/api/provider/${clinicId}`);
        const data = await res.json();

        if (data.status === 200) {
          // console.log(`got data:`);
          // console.log(data);
          setClinic(data.provider);
        } else {
          console.log("error fetching clinic info");
          console.log(data.message);
          window.alert("error fetching clinic info");
        }
      } catch (err) {
        console.log(`error fetching clinic info`);
        window.alert(`error fetching clinic info`);
      }
    })();
  }, []);

  return (
    clinic ?
      <div>
        <h1>{clinic.name}</h1>
        <div>{clinic.location.display_address}</div>
        <div>{clinic.display_phone}</div>
        <button onClick={() => {setRequestAppointment(true);}}>Request an appointment</button>
        {requestAppointment && <RequestAppointment clinic={clinic}/>}
        {messageSuccess && 
          <div>
            <div>Message sent successfully!</div>
            <div><Link to="/">Click to return to the homepage</Link></div>
          </div>}
      </div> 
    : 
      <div>Loading ... </div>
  );
};

export default ClinicDetail;