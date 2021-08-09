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
    <Wrapper>
      {
        currentUser ?
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

        </div> :
        <LoginSignupArea>
          <LoginDiv>
            <LoginButton onClick={() => {
              history.push("/login")
            }}>Login</LoginButton>
          </LoginDiv>

          <SignupDiv>
            <PatientSignup>
              <PatientSignupButton onClick={() => {
                history.push("/signup")
              }}>Patient Sign up</PatientSignupButton>
            </PatientSignup>

            <ClinicianSignup>
              <ClinicianSignupButton onClick={() => {
                history.push("/cliniciansignup")
              }}>Clinician Sign up</ClinicianSignupButton>
            </ClinicianSignup>
          </SignupDiv>
        </LoginSignupArea>
      }
    </Wrapper>
  );
};

const PatientSignupButton = styled.button`
  font-size: xx-large;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  border: none;
  background: royalblue;
  color: white;
  &:active {
    opacity: 60%;
  }
`;

const ClinicianSignupButton = styled.button`
  font-size: xx-large;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  background: pink;
  &:active {
    opacity: 60%;
  }
`;

const LoginButton = styled.button`
  font-size: xx-large;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  background: lightblue;
  color: black;
  &:active {
    opacity: 60%;
  }
`;

const LoginSignupArea = styled.div`
  margin-top: 100px;
	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	justify-content: flex-start;
	align-items: center;
	align-content: stretch;
  background-color: white;
  padding: 20px 40px;
  border-radius: 5px;
`;

const LoginDiv = styled.div`
  margin-bottom: 20px;
`;

const SignupDiv = styled.div`
  display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: center;
	align-items: flex-start;
	align-content: stretch;
`;

const PatientSignup = styled.div`
  margin-right: 10px;

`;

const ClinicianSignup = styled.div`
  margin-left: 10px;
`;

const Wrapper = styled.div`
  display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	justify-content: flex-start;
	align-items: center;
	align-content: stretch;

`;

export default Home;