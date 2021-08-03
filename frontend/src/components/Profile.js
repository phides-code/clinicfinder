import React, { useEffect, useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { UserContext } from "./UserContext";

const Profile = () => {
  // const history = useHistory;
  const {id} = useParams();
  console.log("got id: ");
  console.log( id );

  const [profile, setProfile] = useState(null);
  const { currentUser } = useContext(UserContext);
  const localUserId = localStorage.getItem("healthUser");

  useEffect( () => {
    (async () => {

        try {
          const res = await fetch(`/api/profile/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ requestingId: localUserId })
          });
          const data = await res.json();

          if (data.status === 200) {
            console.log(`got data:`);
            console.log(data);
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
          console.log(`error fetching profile`);
          window.alert(`error fetching profile`);
        }
    })();
  }, []);

  return (
    profile ? 
    <div>
      <div><h1>User profile: {profile._id}</h1></div>
      <div>{profile.userType}</div>
      <div>{profile.name}</div>
      <div>{profile.address}</div>
      <div>{profile.email}</div>
      <div>{profile.phone}</div>
    </div> :
    <div>error retrieving profile</div>
  );
};

export default Profile;