import React, {useContext, useEffect, useState} from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import { useHistory } from "react-router";

const Home = () => {
  const history = useHistory();
  const {
    currentUser,
    setCurrentUser
  } = useContext(UserContext);

  const [clinic, setClinic] = useState(null);

  useEffect(() => {
    if ( currentUser && currentUser.userType === "patient" ) {
      console.log("patient logged in");
    } else if ( currentUser && currentUser.userType === "clinician" ) {
      console.log("clinician logged in. looking up clinic info... ");
      (async () => {
        try {
          const res = await fetch(`/api/provider/${currentUser.clinicId}`);
          const data = await res.json();

          if (data.status === 200) {
            console.log(`got clinic info for ${currentUser.clinicId}`);
            setClinic(data.provider);
          } else {
            console.log("error fetching clinic info");
            console.log(data.message);
            window.alert("error fetching clinic info");
          }
        } catch (err) {
          console.log("caught error fetching clinic info");
          console.log(err);
          window.alert("caught error fetching clinic info");
        }
      })();
    }
  }, [currentUser]);

  return (
    <div>
      {
        currentUser &&
        <div>
          {
            (currentUser.userType === "patient") ?
              <div>
                <Link to="/findaprovider">
                  Find a healthcare provider
                </Link>
              </div> 
            : clinic &&
              <div>
                <Link to="/viewpatients">
                  View patients at {clinic.name}
                </Link>
              </div>
          }

          <div>
            <Link to="/myappointments">
              View my appointments
            </Link>
          </div>

          <div>
            <Link to="/messages">
              View my messages
            </Link>
          </div>

          <div>
            <Link to="/documents">
              View my documents
            </Link>
          </div>

        </div>
      }
    </div>
  );
};

export default Home;