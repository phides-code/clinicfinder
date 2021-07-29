import React, { useContext } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

const Header = () => {
  const {
    currentUser,
    setCurrentUser
  } = useContext(UserContext);

  return (
    <Wrapper>
      <HeaderSection><Link to="/">Healthcare-App</Link></HeaderSection>
      <HeaderSection>This is the header.</HeaderSection>
      <HeaderSection>
        {
          currentUser ?
            <>Welcome, user. logout</> :
            <><Link to="/login">Log in</Link> or <Link to="/signup">Sign up</Link></>
        }
      </HeaderSection>
    </Wrapper>
  );
};

const HeaderSection = styled.div`
  padding: 2%;
`;

const Wrapper = styled.div`
  /* padding-top: 2%; */
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: space-around;
	align-items: stretch;
	align-content: stretch;
`;

export default Header;