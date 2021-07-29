import React from "react";
import styled from "styled-components";

const Footer = () => {

  return (
    <Wrapper>
      This is the Footer.
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding-top: 2%;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: space-around;
	align-items: stretch;
	align-content: stretch;
`;

export default Footer;