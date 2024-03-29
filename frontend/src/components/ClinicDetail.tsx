import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router';
import RequestAppointment from './RequestAppointment';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export interface Clinic {
    name: string;
    location: {
        display_address: string[];
    };
    display_phone: string;
    categories: {
        title: string;
    }[];
    image_url: string;
    photos: string[];
    id: string;
}

const ClinicDetail = () => {
    const navigate = useNavigate();
    const {
        currentUser,
        requestAppointment,
        setRequestAppointment,
        messageSuccess,
        setMessageSuccess,
    } = useContext(UserContext);
    const { clinicId } = useParams();
    console.log(`Looking up clinic details for id ${clinicId}`);

    const [clinic, setClinic] = useState<Clinic | null>(null);

    useEffect(() => {
        setMessageSuccess(false);
        const checkLocalUser = localStorage.getItem('healthUser');
        if (!checkLocalUser || !currentUser) {
            console.log(`no logged in user found, redirecting...`);
            navigate('/login');
        }

        (async () => {
            try {
                const res = await fetch(`/api/provider/${clinicId}`);
                const data = await res.json();

                if (data.status === 200) {
                    // console.log(`got data:`);
                    // console.log(data);
                    setClinic(data.provider);
                } else {
                    console.log('error fetching clinic info');
                    console.log(data.message);
                    window.alert('error fetching clinic info');
                }
            } catch (err) {
                console.log(`error fetching clinic info`);
                window.alert(`error fetching clinic info`);
            }
        })();
    }, [clinicId, currentUser, navigate, setMessageSuccess]);

    return clinic ? (
        <Wrapper>
            <ClinicInfo>
                <LeftColumn>
                    {/* <StyledLink to="/findaprovider">{`< go back`}</StyledLink> */}
                    <BackButton
                        onClick={() => {
                            navigate(-1);
                        }}
                    >
                        Back
                    </BackButton>

                    <h3>{clinic.name}</h3>

                    {clinic.location.display_address.map((addressLine, i) => {
                        return <div key={i}>{addressLine}</div>;
                    })}

                    <div>{clinic.display_phone}</div>
                    <div>
                        <strong>Services offered:</strong>{' '}
                    </div>

                    {clinic.categories.map((category) => {
                        return <div>{category.title}</div>;
                    })}
                </LeftColumn>
                <RightColumn>
                    <Link to={`/clinicphotos/${clinicId}`}>
                        <StyledImg src={clinic.image_url} />
                    </Link>
                    {!messageSuccess && currentUser?.userType === 'patient' && (
                        <RequestButton
                            onClick={() => {
                                setRequestAppointment(true);
                            }}
                        >
                            Request an appointment
                        </RequestButton>
                    )}
                </RightColumn>
            </ClinicInfo>
            {requestAppointment && <RequestAppointment clinic={clinic} />}

            {messageSuccess && (
                <div>
                    <hr />
                    <div>Message sent !</div>
                    <div>
                        {/* <StyledLink to="/">Click to return to the homepage</StyledLink> */}
                        <BackButton
                            onClick={() => {
                                navigate('/');
                            }}
                        >
                            Back to Home page
                        </BackButton>
                    </div>
                </div>
            )}
        </Wrapper>
    ) : (
        <Wrapper>Loading ... </Wrapper>
    );
};

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
    align-content: stretch;
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
    margin: 10px 10px;
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
