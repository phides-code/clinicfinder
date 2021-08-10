import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "./UserContext";
import { useHistory } from "react-router";
import RequestAppointment from "./RequestAppointment";
import { Link } from "react-router-dom";
import styled from "styled-components";

const ClinicDetail = () => {
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
        <ClinicInfo>
          <LeftColumn>
            {/* <StyledLink to="/findaprovider">{`< go back`}</StyledLink> */}
            <BackButton onClick={() => {history.goBack();}}>Back</BackButton>

            <h1>{clinic.name}</h1>

            {
              clinic.location.display_address.map((addressLine, i) => {
                return <div key={i}>{addressLine}</div>
              })
            }

            <div>{clinic.display_phone}</div>
            <div><strong>Services offered:</strong> </div>

            {
              clinic.categories.map(category => {
                return <div>{category.title}</div>;
              })
            }
          </LeftColumn>
          <RightColumn>
            <StyledImg src={clinic.image_url}/>
            { (!messageSuccess && currentUser.userType === "patient") && 
              <RequestButton onClick={() => {setRequestAppointment(true);}}>Request an appointment</RequestButton>
            }
          </RightColumn>
        </ClinicInfo>
            {requestAppointment && <RequestAppointment clinic={clinic}/>}
          
        
        {messageSuccess && 
          <div>
            <div>Message sent !</div>
            <div>
              {/* <StyledLink to="/">Click to return to the homepage</StyledLink> */}
              <BackButton onClick={() => {
                history.push("/");
              }}>Back to Home page</BackButton>
            </div>
          </div>
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

const RightColumn = styled.div`
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	justify-content: flex-start;
	align-items: flex-end;
	align-content: stretch;

`;
const LeftColumn = styled.div`
  display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	justify-content: flex-start;
	align-items: flex-start;
	align-content: stretch
`;

const StyledImg = styled.img`
  height: 100px;
`;

const ClinicInfo = styled.div`
  display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: space-between;
	align-items: stretch;
	align-content: stretch;
`;

const Wrapper = styled.div`
  padding: 5px;
  border-radius: 10px;
  margin: 50px 50px;
  background-color: white;
`;

const RequestButton = styled.button`
  margin: 20px 5px;
  padding: 10px 20px;
  background: lightblue;
  border: none;
  border-radius: 5px;
  &:active {
    opacity: 60%;
  }
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

/* const BackButton = styled.div`
  cursor: pointer;
  color: royalblue;
`; */

export default ClinicDetail;