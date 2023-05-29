import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from './UserContext';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Appointment } from './MyAppointments';

interface ProfileType {
    _id: string;
    name: string;
    userType: string;
    clinicName?: string;
    address: string;
    city: string;
    province: string;
    postalcode: string;
    email: string;
    phone: string;
}

const Profile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    console.log('got id: ');
    console.log(id);

    const [profile, setProfile] = useState<ProfileType | null>(null);
    const { currentUser } = useContext(UserContext);
    const [appointments, setAppointments] = useState<Appointment[] | null>(
        null
    );
    const localUserId = localStorage.getItem('healthUser');

    useEffect(() => {
        if (!localUserId || !currentUser) {
            console.log(`no logged in user found, redirecting...`);
            navigate('/login');
        } else {
            (async () => {
                try {
                    const res = await fetch(`/api/profile/${id}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ requestingId: localUserId }),
                    });
                    const data = await res.json();

                    if (data.status === 200) {
                        console.log(`got profile:`);
                        console.log(data.profile);
                        setProfile(data.profile);

                        // if a clinician is viewing a patient, also fetch their appointments
                        if (
                            currentUser.userType === 'clinician' &&
                            data.profile.userType === 'patient'
                        ) {
                            try {
                                const apptRes = await fetch(
                                    `/api/getappointments`,
                                    {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            viewerId: data.profile._id,
                                            viewerType: 'patient',
                                        }),
                                    }
                                );
                                const apptData = await apptRes.json();

                                if (apptData.status === 200) {
                                    console.log(`got appointments`);
                                    console.log(apptData.appointments);
                                    setAppointments(apptData.appointments);
                                } else {
                                    console.log('no appointments found');
                                    setAppointments(null);
                                }
                            } catch (err) {
                                console.log(
                                    `caught error fetching appointments`
                                );
                                console.log(err);
                            }
                        }
                        ////////////////////////////////////////////////////////////////////////////////////
                    } else if (data.status === 403) {
                        console.log('unauthorized');
                        console.log(data.message);
                        window.alert('unauthorized');
                    } else {
                        console.log('error fetching profile');
                        console.log(data.message);
                        window.alert('error fetching profile');
                    }
                } catch (err) {
                    console.log(`caught error fetching profile`);
                    console.log(err);
                    window.alert(`caught error fetching profile`);
                }
            })();
        }
    }, [id, currentUser, localUserId, navigate]);

    return profile && currentUser ? (
        <Wrapper>
            <div>
                <h1>
                    {profile._id === currentUser._id ? <>My </> : <>User </>}
                    profile
                </h1>
            </div>
            <div>
                <strong>ID:</strong> {profile._id}
            </div>
            <div>
                <strong>Name:</strong> {profile.name}
            </div>
            <div>
                <strong>Type:</strong> {profile.userType}
                {profile.userType === 'clinician' && (
                    <> with {profile.clinicName}</>
                )}
            </div>
            <div>
                <p>
                    <strong>Address:</strong>
                </p>
                {profile.address}
            </div>
            <div>
                {profile.city}, {profile.province}
            </div>
            <div>{profile.postalcode}</div>
            <div>
                <strong>Email:</strong> {profile.email}
            </div>
            <div>
                <strong>Phone:</strong> {profile.phone}
            </div>
            {profile.userType === 'patient' &&
                currentUser.userType === 'clinician' && (
                    <div>
                        <hr />
                        <strong>
                            Upcoming appointments at {currentUser.clinicName}:
                        </strong>
                    </div>
                )}
            {appointments && (
                <div>
                    {appointments.filter(
                        (appointment) =>
                            appointment.status !== 'completed' &&
                            appointment.clinicName === currentUser.clinicName
                    ).length === 0 && <>None found</>}
                    {appointments.map((appointment) => {
                        if (
                            appointment.status !== 'completed' &&
                            appointment.clinicName === currentUser.clinicName
                        ) {
                            return (
                                <div>
                                    <StyledLink
                                        to={`/viewappointment/${appointment._id}`}
                                    >
                                        {appointment.date} -{' '}
                                        {appointment.serviceCategory}
                                    </StyledLink>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            )}
        </Wrapper>
    ) : (
        <Wrapper>Loading ... </Wrapper>
    );
};

const StyledLink = styled(Link)`
    text-decoration: none;
    color: royalblue;
    &:visited {
        text-decoration: none;
        color: royalblue;
    }
`;

const Wrapper = styled.div`
    padding: 5px;
    border-radius: 10px;
    margin: 50px 50px;
    background-color: white;
`;

export default Profile;
