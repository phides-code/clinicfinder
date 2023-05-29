import { useEffect, useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from './UserContext';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Appointment } from './MyAppointments';

const ViewAppointment = () => {
    const { currentUser } = useContext(UserContext);
    const navigate = useNavigate();
    const { appointmentId } = useParams();
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [showCostBox, setShowCostBox] = useState(false);

    useEffect(() => {
        const checkLocalUser = localStorage.getItem('healthUser');
        if (!checkLocalUser || !currentUser) {
            console.log(`no logged in user found, redirecting...`);
            navigate('/login');
        } else {
            (async () => {
                try {
                    let thisRequestingId;
                    if (currentUser.userType === 'patient') {
                        thisRequestingId = currentUser._id;
                    } else {
                        thisRequestingId = currentUser.clinicId;
                    }
                    const res = await fetch(`/api/getappointmentbyid`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            appointmentId: appointmentId,
                            requestingId: thisRequestingId,
                        }),
                    });
                    const data = await res.json();

                    if (data.status === 200) {
                        console.log(`got appointment:`);
                        console.log(data.appointment);
                        setAppointment(data.appointment);
                    } else if (data.status === 403) {
                        console.log('unauthorized');
                        console.log(data.appointment);
                        window.alert('unauthorized');
                    } else {
                        console.log('error fetching appointment');
                        console.log(data.appointment);
                        window.alert('error fetching appointment');
                    }
                } catch (err) {
                    console.log(`caught error fetching appointment`);
                    console.log(err);
                    window.alert(`caught error fetching appointment`);
                }
            })();
        }
    }, [appointmentId, currentUser, navigate]);

    const updateAppointment = async (update: Partial<Appointment>) => {
        const res = await fetch(`/api/updateappointment`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                appointmentId: appointmentId,
                update: update,
            }),
        });
        const data = await res.json();
        console.log(`${data.status} ${data.message} updated appointment: `);
        console.log(update);
    };

    const updateMessage = async (update: Partial<Appointment>) => {
        const res = await fetch(`/api/updatemessage`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messageId: appointment?.requestId,
                update: update,
            }),
        });
        const data = await res.json();
        console.log(`${data.status} ${data.message} updated message: `);
        console.log(update);
    };

    const issueReceipt = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        console.log(`issue receipt for appointment ${appointment?._id}`);
        await updateAppointment({ status: 'completed' });
        await updateMessage({ status: 'completed' });
        // create receipt object in the DB...
        const target = ev.target as HTMLFormElement;

        const receipt = {
            appointmentId: appointment?._id,
            patientId: appointment?.patientId,
            patientName: appointment?.patientName,
            clinicId: appointment?.clinicId,
            clinicName: appointment?.clinicName,
            appointmentDate: appointment?.date,
            serviceCategory: appointment?.serviceCategory,
            cost: target.cost.value,
            timestamp: Date.now(),
            type: 'receipt',
        };

        let newReceipt;

        try {
            console.log(`trying fetch...`);
            const res = await fetch('/api/postdocument', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(receipt),
            });
            const data = await res.json();

            newReceipt = data.newDocument;
            // setNewReceipt(data.newDocument);

            if (data.status === 201) {
                console.log('created document in db');
            } else {
                console.log(`got unexpected status:
        ${data.status}: ${data.message}`);
            }
        } catch (err) {
            console.log(
                `issueReceipt caught an error while creating document:`
            );
            console.log(err);
            window.alert(
                `issueReceipt caught an error while creating document.`
            );
        }

        // post a notification message to the patient
        try {
            const res = await fetch('/api/postmessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipientId: appointment?.patientId,
                    recipientName: appointment?.patientName,
                    senderId: currentUser?.clinicId,
                    senderName:
                        currentUser?.name + ' at ' + currentUser?.clinicName,
                    senderEmail: currentUser?.email,
                    senderPhone: currentUser?.phone,
                    timestamp: Date.now(),
                    message: `You have a new receipt from ${currentUser?.clinicName}`,
                    receiptId: newReceipt._id,
                    type: 'receipt',
                    status: 'n/a',
                    read: false,
                }),
            });
            const data = await res.json();

            if (data.status === 201) {
                console.log(`posted notification message to patient`);
            } else {
                window.alert(`got unexpected status:
        ${data.status}: ${data.message}`);
            }
        } catch (err) {
            console.log(`issueReceipt caught an error while posting message:`);
            console.log(err);
            window.alert(
                `issueReceipt caught an error while posting message...`
            );
        }
        navigate('/myappointments');
    };

    return appointment ? (
        <Wrapper>
            <div>
                <strong>Appointment for:</strong> {appointment.patientName} at{' '}
                <StyledLink to={`/clinicdetail/${appointment.clinicId}`}>
                    {appointment.clinicName}
                </StyledLink>
            </div>
            <div>
                <strong>Date:</strong> {appointment.date}
            </div>
            <div>
                <strong>Service requested:</strong>{' '}
                {appointment.serviceCategory}
            </div>
            <div>
                <strong>Status:</strong> {appointment.status}
            </div>
            {appointment.status === 'completed' && (
                <div>
                    {/* <strong>Cost: </strong>{appointment.cost} */}
                    View Receipt id
                </div>
            )}
            {/* {
        (appointment.status === "completed") &&
        <div><StyledLink to={`/viewdocument/${document._id}`}>View receipt</StyledLink></div>
      } */}
            <hr />

            {currentUser?.userType === 'clinician' &&
                appointment.status !== 'completed' && (
                    <div>
                        <div>
                            <StyledButton
                                name='showCost'
                                onClick={() => {
                                    setShowCostBox(true);
                                }}
                            >
                                Complete Appointment
                            </StyledButton>
                        </div>

                        {showCostBox && (
                            <ChargeBox>
                                <form onSubmit={(ev) => issueReceipt(ev)}>
                                    <label>Enter cost: </label>
                                    <input type='text' name='cost' />

                                    <div>
                                        <SubmitButton
                                            type='submit'
                                            value='Issue Receipt'
                                        />
                                        <ResetButton
                                            onClick={() => {
                                                setShowCostBox(false);
                                            }}
                                        >
                                            Cancel
                                        </ResetButton>
                                    </div>
                                </form>
                            </ChargeBox>
                        )}
                    </div>
                )}
            <div>
                <BackButton
                    onClick={() => {
                        navigate(`/myappointments`);
                    }}
                >
                    Back to Appointments
                </BackButton>
            </div>
        </Wrapper>
    ) : (
        <Wrapper>Loading ... </Wrapper>
    );
};

const ChargeBox = styled.div`
    margin: 10px;
`;

const SubmitButton = styled.input`
    margin: 5px;
    padding: 5px 10px;
    background: lightblue;
    border: none;
    border-radius: 5px;
    transition: transform 0.2s;
    &:hover {
        transform: scale(1.1);
    }
    &:active {
        opacity: 60%;
    }
`;

const ResetButton = styled.button`
    margin: 5px;
    padding: 5px 10px;
    background: lightpink;
    border: none;
    border-radius: 5px;
    &:active {
        opacity: 60%;
    }
`;

const StyledButton = styled.button`
    margin-top: 5px;
    background-color: royalblue;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    color: white;
    &:active {
        background-color: lightblue;
    }
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: royalblue;
    &:visited {
        text-decoration: none;
        color: royalblue;
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

const Wrapper = styled.div`
    padding: 5px;
    border-radius: 10px;
    margin: 50px 50px;
    background-color: white;
`;

export default ViewAppointment;
