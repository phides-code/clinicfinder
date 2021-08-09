import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import { useHistory } from "react-router";
import appIcon from "../assets/app.svg";

const Header = () => {
  const history = useHistory();
  const {
    currentUser,
    setCurrentUser,
  } = useContext(UserContext);

  return (
    <Wrapper>
      <HeaderSection>
        <HomeLink to="/">
          <MainIcon src={appIcon} alt="healthcarefinder icon" title="Home" />
        </HomeLink>
      </HeaderSection>
        {
          currentUser &&
            <>
              {/* {
                currentUser.userType === "patient" ?
                <HeaderSection>
                  <Link to="/findaprovider">Find a healthcare provider</Link>
                </HeaderSection> :
                <HeaderSection>
                  My Clinic: <Link to={`/clinicdetail/${currentUser.clinicId}`}>{currentUser.clinicName}</Link>
                </HeaderSection>
              } */}
              <RightHeaderSection>
                <div>
                  Welcome, {` `} 
                  <ProfileLink to={`/profile/${currentUser._id}`}>
                    {currentUser.name}
                  </ProfileLink>!{` `}
                </div>
                <div>
                  <LogoutButton
                    onClick={() => {
                      setCurrentUser(null);
                      history.push("/");
                      localStorage.removeItem("healthUser");
                      localStorage.removeItem("healthHash");
                      console.log(`Logging out`);
                      }}>Logout</LogoutButton>
                </div>

              </RightHeaderSection>
            </> 
            // :
            // <>
            //   <RightHeaderSection>
            //     <div><Link to="/login">Log in</Link></div>
            //     <div><Link to="/signup">Sign up as a Patient</Link></div>
            //     <div><Link to="/cliniciansignup">Sign up as a Clinician</Link></div>
            //   </RightHeaderSection>
            // </>
        }
    </Wrapper>
  );
};

const LogoutButton = styled.button`
  margin-top: 5px;
  background-color: red;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  color: white;
  &:active {
    background-color: lightblue;
  }
`;

const ProfileLink = styled(Link)`
  text-decoration: none;
  &:visited {
    color: royalblue;
    text-decoration: none;
  }
  &:hover {
    color: red;
  }
`;

const MainIcon = styled.img`
  /* margin-left: 5px; */
  margin: 10px;
  height: 40px;
  display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: space-between;
	align-items: center;
	align-content: center;
  transition: transform .2s;
  &:hover{
      transform: scale(1.1); 
    }
`;

const HomeLink = styled(Link)`
  text-decoration: none;
  /* font-size: 60px; */
  color: red;
`;

const HeaderSection = styled.div`
  /* padding-top: 1%;
  padding-bottom: 2%; */
`;

const RightHeaderSection = styled.div`
  margin-right: 10px;
  /* padding-top: 1%;
  padding-bottom: 2%; */
  display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	justify-content: center;
	align-items: flex-end;
	align-content: stretch;
`;

const Wrapper = styled.div`
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: space-between;
	align-items: center;
	align-content: center;
`;

export default Header;