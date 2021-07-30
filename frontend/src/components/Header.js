import React, { useContext } from "react";
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
      <HeaderSection>
        {
          currentUser ?
            <>Welcome, {currentUser.name}.<Link
              onClick={() => {
                setCurrentUser(null);
                history.push("/");
              }}>Logout</Link></> :
            <><Link to="/login">Log in</Link> or <Link to="/signup">Sign up</Link></>
        }
      </HeaderSection>
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