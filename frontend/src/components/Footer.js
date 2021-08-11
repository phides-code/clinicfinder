import React from "react";
import styled from "styled-components";

const Footer = () => {

  return (
    <Wrapper>
      ClinicFinder © 2021
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: space-around;
	align-items: stretch;
	align-content: stretch;
`;

export default Footer;