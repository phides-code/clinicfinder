import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "./UserContext";
import { useHistory } from "react-router";
import RequestAppointment from "./RequestAppointment";
import { Link } from "react-router-dom";
import styled from "styled-components";

const ClinicPhotos = () => {
  const history = useHistory();
  const {currentUser, requestAppointment, setRequestAppointment,
    messageSuccess, setMessageSuccess
  } = useContext(UserContext);
  const {clinicId} = useParams();
  console.log(`Looking up clinic details for id ${clinicId}`);

  const [clinic, setClinic] = useState(null);

  useEffect(() => {
    setMessageSuccess(false);
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
      <Wrapper>
        <BackButton onClick={() => {
          history.goBack();
        }}>Back</BackButton>
        {
          clinic.photos.map(photoUrl => {
            return (
              <div>
                <StyledImg src={photoUrl}/>
              </div>
            )
          })
        }
      </Wrapper>
      : 
      <Wrapper>Loading ... </Wrapper>
  );
};

const StyledLink = styled(Link)`
  text-decoration: none;
  color: royalblue;
  &:visisted {
    text-decoration: none;
    color: royalblue;
  }
`;

const StyledImg = styled.img`
  /* height: 100px; */
  margin-top: 10px;
  max-width: 380px;

`;

const Wrapper = styled.div`
  padding: 5px;
  border-radius: 10px;
  margin: 10px 10px;
  background-color: white;
`;

const BackButton = styled.button`
  margin-top: 5px;
  background-color: pink;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  color: black;
  &:active {
    background-color: lightblue;
  }
`;

export default ClinicPhotos;