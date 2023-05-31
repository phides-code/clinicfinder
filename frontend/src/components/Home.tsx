import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router';
import appointmentsImg from '../assets/appointments.svg';
import findProviderImg from '../assets/findaprovider.svg';
import messagesImg from '../assets/mail.svg';
import receiptsImg from '../assets/receipts.svg';
import patientsImg from '../assets/patients.svg';

const Home = () => {
    const navigate = useNavigate();
    const { currentUser, userLogin, isLoading } = useContext(UserContext);

    const [clinic, setClinic] = useState(null);

    useEffect(() => {
        if (currentUser && currentUser.userType === 'patient') {
            console.log('patient logged in');
        } else if (currentUser && currentUser.userType === 'clinician') {
            console.log('clinician logged in. looking up clinic info... ');
            (async () => {
                try {
                    const res = await fetch(
                        `/api/provider/${currentUser.clinicId}`
                    );
                    const data = await res.json();

                    if (data.status === 200) {
                        console.log(
                            `got clinic info for ${currentUser.clinicId}`
                        );
                        setClinic(data.provider);
                    } else {
                        console.log('error fetching clinic info');
                        console.log(data.message);
                        window.alert('error fetching clinic info');
                    }
                } catch (err) {
                    console.log('caught error fetching clinic info');
                    console.log(err);
                    window.alert('caught error fetching clinic info');
                }
            })();
        }
    }, [currentUser]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Wrapper>
            {currentUser ? (
                <MainGrid>
                    <MenuRow>
                        {currentUser.userType === 'patient' ? (
                            <MenuIcon>
                                <StyledLink to='/findaprovider'>
                                    <StyledImg src={findProviderImg} />
                                    Find a Clinic
                                </StyledLink>
                            </MenuIcon>
                        ) : (
                            clinic && (
                                <MenuIcon>
                                    <StyledLink to='/viewpatients'>
                                        <StyledImg src={patientsImg} />
                                        Patients
                                    </StyledLink>
                                </MenuIcon>
                            )
                        )}
                        <MenuIcon>
                            <StyledLink to='/myappointments'>
                                <StyledImg src={appointmentsImg} />
                                Appointments
                            </StyledLink>
                        </MenuIcon>
                    </MenuRow>

                    <MenuRow>
                        <MenuIcon>
                            <StyledLink to='/messages'>
                                <StyledImg src={messagesImg} />
                                Messages
                            </StyledLink>
                        </MenuIcon>
                        <MenuIcon>
                            <StyledLink to='/documents'>
                                <StyledImg src={receiptsImg} />
                                Receipts
                            </StyledLink>
                        </MenuIcon>
                    </MenuRow>
                </MainGrid>
            ) : (
                <LoginSignupArea>
                    <LoginDiv>
                        <LoginSection>
                            <LoginButton
                                onClick={() => {
                                    navigate('/login');
                                }}
                            >
                                Login
                            </LoginButton>
                        </LoginSection>
                        <DemoLoginSection>
                            <form onSubmit={(ev) => userLogin(ev)}>
                                <div style={{ display: 'none' }}>
                                    <input
                                        name='patientId'
                                        readOnly
                                        value='demo'
                                    />

                                    <input
                                        type='password'
                                        name='password'
                                        value='demo'
                                        readOnly
                                    />
                                </div>

                                <DemoLoginButton type='submit' value='Login'>
                                    Demo Login
                                </DemoLoginButton>
                            </form>
                        </DemoLoginSection>
                    </LoginDiv>

                    <SignupDiv>
                        <PatientSignup>
                            <PatientSignupButton
                                onClick={() => {
                                    navigate('/signup');
                                }}
                            >
                                Patient Sign up
                            </PatientSignupButton>
                        </PatientSignup>

                        <ClinicianSignup>
                            <ClinicianSignupButton
                                onClick={() => {
                                    navigate('/cliniciansignup');
                                }}
                            >
                                Clinician Sign up
                            </ClinicianSignupButton>
                        </ClinicianSignup>
                    </SignupDiv>
                </LoginSignupArea>
            )}
        </Wrapper>
    );
};

const StyledImg = styled.img`
    margin-bottom: 10px;
    transition: transform 0.2s;
    &:hover {
        transform: scale(1.1);
    }
`;

const StyledLink = styled(Link)`
    font-size: large;
    text-decoration: none;
    color: black;
    margin: 0 auto;
    &:visited {
        color: black;
    }
    &:hover {
        opacity: 90%;
    }
`;

const MenuIcon = styled.div`
    height: 120px;
    width: 120px;
    background-color: lightblue;
    border-radius: 5px;
    padding: 5px 10px;
    margin: 20px;
`;

const MenuRow = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    align-content: stretch;
`;

const MainGrid = styled.div`
    background-color: white;
    border-radius: 10px;
    margin: 50px 50px;
    padding: 20px 10px;
    max-width: 360px;
`;

const PatientSignupButton = styled.button`
    font-size: large;
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
    font-size: large;
    padding: 10px 20px;
    border-radius: 5px;
    border: none;
    background: pink;
    &:active {
        opacity: 60%;
    }
`;

const LoginButton = styled.button`
    font-size: large;
    padding: 10px 20px;
    border-radius: 5px;
    border: none;
    background: lightblue;
    color: black;
    &:active {
        opacity: 60%;
    }
`;

const DemoLoginButton = styled(LoginButton)``;

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
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    width: 100%;
`;

const SignupDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
`;

const LoginSection = styled.div`
    margin-right: 20px;
`;
const DemoLoginSection = styled.div``;

const PatientSignup = styled.div`
    margin-right: 20px;
`;

const ClinicianSignup = styled.div``;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: stretch;
`;

export default Home;
