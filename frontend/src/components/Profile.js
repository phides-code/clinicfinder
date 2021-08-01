import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Profile = () => {
  const {id} = useParams();
  console.log("got id: ");
  console.log( id );

  const [profile, setProfile] = useState(null);

  useEffect( async () => {
    try {
      const res = await fetch(`/api/profile/${id}`, {});
      const data = await res.json();

      if (data.status === 200) {
        console.log(`got data:`);
        console.log(data);
        setProfile(data.profile);
      } else {
        console.log("error fetching profile");
        console.log(data.message);
        window.alert("error fetching profile");
      }

    } catch (err) {
      console.log(`error fetching profile`);
      window.alert(`error fetching profile`);
    }
  }, []);

  return (
    profile &&
    <div>
      <div><h1>User profile: {profile._id}</h1></div>
      <div>{profile.userType}</div>
      <div>{profile.name}</div>
      <div>{profile.address}</div>
      <div>{profile.email}</div>
      <div>{profile.phone}</div>
    </div>
  );
};

export default Profile;