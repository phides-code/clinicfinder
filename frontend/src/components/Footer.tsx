import React from 'react';
import styled from 'styled-components';

const Footer = () => {
    return <Wrapper>ClinicFinder © Philippe DeSousa 2021, 2025</Wrapper>;
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
