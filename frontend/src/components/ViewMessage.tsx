import React, { useEffect, useContext, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from './UserContext';
import styled from 'styled-components';
import { Message } from './Messages';
const moment = require('moment');

const ViewMessage = () => {
    const { currentUser } = useContext(UserContext);
    const navigate = useNavigate();
    const { messageId } = useParams();
    const [message, setMessage] = useState<Message | null>(null);

    const updateMessage = useCallback(
        async (update: Partial<Message>) => {
            const res = await fetch(`/api/updatemessage`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messageId: messageId,
                    update: update,
                }),
            });
            const data = await res.json();
            console.log(`${data.status} ${data.message} updated message: `);
            console.log(update);
        },
        [messageId]
    );

    // respond to patient's request, either confirm or deny appointment
    const postReply = async (
        ev: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        ev.preventDefault();

        const target = ev.target as HTMLFormElement;

        let messageText;
        let replyType;
        if (target.name === 'confirm') {
            messageText = `your appointment request for ${message?.serviceCategory} at ${currentUser?.clinicName} on ${message?.requestedDate} has been confirmed`;
            replyType = 'confirmed';

            // if confirmed, creating appointment in db
            try {
                const res = await fetch('/api/createappointment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        patientId: message?.senderId,
                        patientName: message?.senderName,
                        patientEmail: message?.senderEmail,
                        patientPhone: message?.senderPhone,
                        date: message?.requestedDate,
                        serviceCategory: message?.serviceCategory,
                        clinicId: currentUser?.clinicId,
                        clinicName: currentUser?.clinicName,
                        requestId: message?._id,
                        status: 'confirmed',
                    }),
                });
                const data = await res.json();

                if (data.status === 201) {
                    console.log('created appointment in db');
                } else {
                    console.log(`got unexpected status:
          ${data.status}: ${data.message}`);
                }
            } catch (err) {
                console.log(
                    `postReply caught an error while creating appointment:`
                );
                console.log(err);
                window.alert(
                    `postReply caught an error while creating appointment.`
                );
            }
        } else {
            messageText = 'your appointment has been denied';
            replyType = 'denied';
        }

        // post a message to the patient confirming or denying the appointment
        try {
            const res = await fetch('/api/postmessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipientId: message?.senderId,
                    recipientName: message?.senderName,
                    senderId: currentUser?.clinicId,
                    senderName:
                        currentUser?.name + ' at ' + currentUser?.clinicName,
                    senderEmail: currentUser?.email,
                    senderPhone: currentUser?.phone,
                    timestamp: Date.now(),
                    requestedDate: message?.requestedDate,
                    message: messageText,
                    type: 'reply',
                    status: replyType,
                    read: false,
                }),
            });
            const data = await res.json();

            if (data.status === 201) {
                // set the request status to "confirmed" or "denied"
                await updateMessage({ status: replyType });
                navigate('/messages');
            } else {
                window.alert(`got unexpected status:
        ${data.status}: ${data.message}`);
            }
        } catch (err) {
            console.log(`postReply caught an error:`);
            console.log(err);
            window.alert(`postReply caught an error...`);
        }
    };

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
                    const res = await fetch(`/api/getmessagebyid`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            messageId: messageId,
                            requestingId: thisRequestingId,
                        }),
                    });
                    const data = await res.json();

                    if (data.status === 200) {
                        console.log(`got message:`);
                        console.log(data.message);
                        setMessage(data.message);
                        // only mark it read if this user is not the sender
                        if (
                            data.message.read === false &&
                            data.message.senderId !== currentUser._id &&
                            data.message.senderId !== currentUser.clinicId
                        ) {
                            await updateMessage({ read: true });
                        }
                    } else if (data.status === 403) {
                        console.log('unauthorized');
                        console.log(data.message);
                        window.alert('unauthorized');
                    } else {
                        console.log('error fetching message');
                        console.log(data.message);
                        window.alert('error fetching message');
                    }
                } catch (err) {
                    console.log(`caught error fetching message`);
                    console.log(err);
                    window.alert(`caught error fetching message`);
                }
            })();
        }
    }, [currentUser, messageId, navigate, updateMessage]);

    return message && currentUser ? (
        <Wrapper>
            <div>
                <strong>From:</strong> {message.senderName}
            </div>
            <div>
                <strong>To:</strong> {message.recipientName}
            </div>
            <div>
                <strong>Sent:</strong>{' '}
                {moment(message.timestamp).format('MMMM Do YYYY, hh:mm:ss a')}
            </div>
            <div>
                <strong>Type:</strong> {message.type}
            </div>

            {(message.type === 'appointmentRequest' ||
                message.type === 'reply') && (
                <div>
                    <div>
                        <strong>Status:</strong> {message.status}
                    </div>
                    <div>
                        <strong>Requested Date:</strong> {message.requestedDate}
                    </div>
                </div>
            )}
            <hr />
            <div>{message.message}</div>

            {currentUser.userType === 'clinician' && (
                <div>
                    <ConfirmButton
                        name='confirm'
                        onClick={(ev) => postReply(ev)}
                    >
                        Confirm
                    </ConfirmButton>
                    <DenyButton name='deny' onClick={(ev) => postReply(ev)}>
                        Deny
                    </DenyButton>
                </div>
            )}
            {message.type === 'receipt' && (
                <div>
                    {/* <StyledLink to={`/viewdocument/${message.receiptId}`}>View receipt</StyledLink> */}

                    <StyledButton
                        onClick={() => {
                            navigate(`/viewdocument/${message.receiptId}`);
                        }}
                    >
                        View Receipt
                    </StyledButton>
                </div>
            )}
            <div>
                {/* <StyledLink to="/messages">Back to Messages</StyledLink> */}
                <BackButton
                    onClick={() => {
                        navigate(`/messages`);
                    }}
                >
                    Back to Messages
                </BackButton>
            </div>
        </Wrapper>
    ) : (
        <Wrapper>Loading ... </Wrapper>
    );
};

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

const ConfirmButton = styled.button`
    margin-right: 5px;
    margin-top: 5px;
    background-color: green;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    color: white;
    &:active {
        background-color: lightblue;
    }
`;

const DenyButton = styled.button`
    margin-top: 5px;
    background-color: red;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    color: white;
    &:active {
        background-color: lightblue;
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

export default ViewMessage;
