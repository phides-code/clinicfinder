import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import { useHistory } from "react-router";

const Header = () => {
  const history = useHistory();
  const {
    currentUser,
    setCurrentUser
  } = useContext(UserContext);

  return (
    <Wrapper>
      <HeaderSection><Link to="/">Healthcare-App</Link></HeaderSection>
      {/* <HeaderSection>Welcome</HeaderSection> */}
      {/* <HeaderSection> */}
        {
          currentUser ?
            <>
              <HeaderSection><Link to="/findaprovider">Click here to find a provider</Link></HeaderSection>
              <HeaderSection>
                Welcome, {` `} 
                <Link to={`/profile/${currentUser._id}`}>
                  {currentUser.name}
                </Link>.{` `}
            
                ( <Link to="/"
                  onClick={() => {
                    setCurrentUser(null);
                    localStorage.removeItem("healthUser");
                    localStorage.removeItem("healthHash");
                    console.log(`Logging out`);

                  }}>Logout</Link> )
              </HeaderSection>
            </> :
            <>
              <HeaderSection>
                <div><Link to="/login">Log in</Link></div>
                <div><Link to="/signup">Sign up as a Patient</Link></div>
                <div><Link to="/cliniciansignup">Sign up as a Clinician</Link></div>
              </HeaderSection>
            </>
        }
      {/* </HeaderSection> */}
    </Wrapper>
  );
};

const HeaderSection = styled.div`
  padding-top: 1%;
  padding-bottom: 2%;
`;

const Wrapper = styled.div`
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: space-around;
	align-items: stretch;
	align-content: stretch;
`;

export default Header;