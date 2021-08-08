import React, { useEffect, useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { UserContext } from "./UserContext";

const Profile = () => {
  const history = useHistory();
  const {id} = useParams();
  console.log("got id: ");
  console.log( id );

  const [profile, setProfile] = useState(null);
  const { currentUser } = useContext(UserContext);
  const localUserId = localStorage.getItem("healthUser");

  useEffect( () => {
    // const checkLocalUser = localStorage.getItem("healthUser");
    if (!localUserId || !currentUser) {
      console.log(`no logged in user found, redirecting...`);
      history.push("/login");
    } else {
      (async () => {
        try {
          const res = await fetch(`/api/profile/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ requestingId: localUserId })
          });
          const data = await res.json();

          if (data.status === 200) {
            setProfile(data.profile);
          } else if (data.status === 403) {
            console.log("unauthorized");
            console.log(data.message);
            window.alert("unauthorized");
          } else {
            console.log("error fetching profile");
            console.log(data.message);
            window.alert("error fetching profile");
          }

        } catch (err) {
          console.log(`caught error fetching profile`);
          console.log(err);
          window.alert(`caught error fetching profile`);
        }
      })();
    }
  }, [id]);

  return (
    profile ? 
    <div>
      <div><h1>
        {
          (profile._id === currentUser._id) ?
            <>My </> :
            <>User </>
        }
        profile: {profile._id}</h1></div>
      <div>{profile.name}</div>
      <div>{profile.userType}
        {
          (profile.userType === "clinician") && 
          <> with {profile.clinicName}</>
        }
      </div>
      <div>{profile.address}</div>
      <div>{profile.email}</div>
      <div>{profile.phone}</div>
      {
        (profile.userType === "patient" && currentUser.userType === "clinician") &&
        <> Upcoming appointments at {currentUser.clinicName}: </>
      }
    </div> :
    <div>Loading ... </div>
  );
};

export default Profile;