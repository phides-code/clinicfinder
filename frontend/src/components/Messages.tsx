import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
const moment = require('moment');

export interface Message {
    _id: string;
    type: string;
    senderId: string;
    senderName: string;
    senderEmail: string;
    senderPhone: string;
    recipientId: string;
    recipientName: string;
    timestamp: string;
    requestedDate: string;
    serviceCategory: string;
    message: string;
    status: string;
    read: boolean;
    receiptId: string;
}

const Messages = () => {
    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext);
    const [messages, setMessages] = useState<Message[] | null>(null);
    // let viewerId;

    useEffect(() => {
        const checkLocalUser = localStorage.getItem('healthUser');
        if (!checkLocalUser || !currentUser) {
            console.log(`no logged in user found, redirecting...`);
            navigate('/login');
        } else {
            (async () => {
                // if this is a patient, get messages for this patient ID
                // if this is a clinician, get messages for this clinic's ID
                try {
                    let viewerId;
                    if (currentUser.userType === 'patient') {
                        viewerId = currentUser._id;
                    } else {
                        viewerId = currentUser.clinicId;
                    }
                    console.log(`fetching messages for recipient ${viewerId}`);
                    const res = await fetch(`/api/getmessages`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            queryParams: {
                                $or: [
                                    { recipientId: viewerId },
                                    { senderId: viewerId },
                                ],
                            },
                        }),
                    });
                    const data = await res.json();

                    if (data.status === 200) {
                        console.log(`got messages`);
                        setMessages(data.messages);
                    } else {
                        console.log('no messages found');
                        console.log(data.message);
                        window.alert('no messages found');
                        setMessages([]);
                    }
                } catch (err) {
                    console.log(`caught error fetching messages`);
                    console.log(err);
                    window.alert(`caught error fetching messages`);
                }
            })();
        }
    }, [currentUser, navigate]);

    return messages && currentUser ? (
        <Wrapper>
            <h1>My Messages:</h1>
            {messages.length !== 0 ? (
                <MessageList>
                    {messages.filter(
                        (message) =>
                            message.recipientId === currentUser._id ||
                            message.recipientId === currentUser.clinicId
                    ).length === 0 && <>None found</>}
                    {messages.map((message) => {
                        if (
                            message.recipientId === currentUser._id ||
                            message.recipientId === currentUser.clinicId
                        ) {
                            return (
                                <div key={message._id}>
                                    <hr />{' '}
                                    {message.read === false && (
                                        <NewMessageFlag>NEW</NewMessageFlag>
                                    )}
                                    <StyledLink
                                        to={`/viewmessage/${message._id}`}
                                    >
                                        <div>
                                            <strong>From: </strong>
                                            {message.senderName}
                                        </div>
                                        <div>
                                            <strong>Date: </strong>
                                            {moment(message.timestamp).format(
                                                'MMMM Do YYYY, hh:mm:ss a'
                                            )}
                                        </div>
                                        {/* <div><strong>Status: </strong> {message.status}</div> */}
                                    </StyledLink>
                                </div>
                            );
                        }
                        return null;
                    })}
                </MessageList>
            ) : (
                <div>No messages found.</div>
            )}
            <h1>Sent messages:</h1>
            {messages.length !== 0 ? (
                <MessageList>
                    {messages.filter(
                        (message) =>
                            message.senderId === currentUser._id ||
                            message.senderId === currentUser.clinicId
                    ).length === 0 && <>None found</>}
                    {messages.map((message) => {
                        if (
                            message.senderId === currentUser._id ||
                            message.senderId === currentUser.clinicId
                        ) {
                            return (
                                <div key={message._id}>
                                    <hr />
                                    {/* <hr/> {message.read === false && <>NEW</>} */}
                                    <StyledLink
                                        to={`/viewmessage/${message._id}`}
                                    >
                                        <div>
                                            <strong>To: </strong>
                                            {message.recipientName}
                                        </div>
                                        <div>
                                            <strong>Date: </strong>
                                            {moment(message.timestamp).format(
                                                'MMMM Do YYYY, hh:mm:ss a'
                                            )}
                                        </div>
                                        {/* <div><strong>Message type: </strong> {message.type}</div>
                          <div><strong>Status: </strong> {message.status}</div> */}
                                    </StyledLink>
                                </div>
                            );
                        }
                        return null;
                    })}
                </MessageList>
            ) : (
                <div>No messages found.</div>
            )}
        </Wrapper>
    ) : (
        <Wrapper>Loading ...</Wrapper>
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

const MessageList = styled.div`
    display: flex;
    flex-direction: column-reverse;
`;

const NewMessageFlag = styled.span`
    color: red;
`;

export default Messages;
