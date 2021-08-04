import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "./UserContext";
import { useHistory } from "react-router";


const ClinicDetail = () => {
  const history = useHistory();
  const {currentUser} = useContext(UserContext);
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
          console.log(`got data:`);
          console.log(data);
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
    <div>
      <h1>{clinic.name}</h1>
    </div>
  );
};

export default ClinicDetail;