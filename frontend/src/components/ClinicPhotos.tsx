import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { Clinic } from './ClinicDetail';

const ClinicPhotos = () => {
    const navigate = useNavigate();
    const { currentUser, setMessageSuccess } = useContext(UserContext);
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
            <BackButton
                onClick={() => {
                    navigate(-1);
                }}
            >
                Back
            </BackButton>
            {clinic.photos.map((photoUrl) => {
                return (
                    <div>
                        <StyledImg src={photoUrl} />
                    </div>
                );
            })}
        </Wrapper>
    ) : (
        <Wrapper>Loading ... </Wrapper>
    );
};

const StyledImg = styled.img`
    /* height: 100px; */
    margin-top: 10px;
    max-width: 380px;
`;

const Wrapper = styled.div`
    padding: 5px;
    border-radius: 10px;
    margin: 10px 10px;
    background-color: white;
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

export default ClinicPhotos;
