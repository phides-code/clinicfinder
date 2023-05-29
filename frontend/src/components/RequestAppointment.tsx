import React, { useContext } from 'react';
import { UserContext } from './UserContext';
import styled from 'styled-components';
import { Clinic } from './ClinicDetail';

interface RequestAppointmentProps {
    clinic: Clinic;
}

const RequestAppointment = ({ clinic }: RequestAppointmentProps) => {
    const { currentUser, setRequestAppointment, setMessageSuccess } =
        useContext(UserContext);

    const postMessage = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        const target = ev.target as HTMLFormElement;

        const messageObject = {
            recipientId: clinic.id,
            recipientName: clinic.name,
            senderId: currentUser?._id,
            senderName: currentUser?.name,
            senderEmail: currentUser?.email,
            senderPhone: currentUser?.phone,
            requestedDate:
                target.requestedDate.value + ' ' + target.requestedTime.value,
            serviceCategory: target.serviceCategory.value,
            timestamp: Date.now(),
            message: target.messagetext.value,
            type: 'appointmentRequest',
            read: false,
            status: 'pending',
        };

        console.log('posting message: ');
        console.log(messageObject);

        try {
            const res = await fetch('/api/postmessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(messageObject),
            });
            const data = await res.json();

            if (data.status === 201) {
                setRequestAppointment(false);
                setMessageSuccess(true);
                target.messagetext.value = '';
            } else {
                window.alert(`got unexpected status:
        ${data.status}: ${data.message}`);
            }
        } catch (err) {
            console.log(`postMessage caught an error:`);
            console.log(err);
            window.alert(`postMessage caught an error...`);
        }
    };

    return (
        <div>
            <h3>Request an Appointment with {clinic.name}:</h3>

            <div>Your Name: {currentUser?.name}</div>
            <div>Email: {currentUser?.email}</div>
            <div>Phone: {currentUser?.phone}</div>
            <form onSubmit={(ev) => postMessage(ev)}>
                <div>
                    Requested Date:{' '}
                    <input type='date' name='requestedDate' required />
                </div>
                <div>
                    Requested Time:{' '}
                    <input type='time' name='requestedTime' required />
                </div>
                <div>
                    Requested Service Category:{` `}
                    <select name='serviceCategory' required>
                        {clinic.categories.map((category) => {
                            return (
                                <option value={category.title}>
                                    {category.title}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div>Message (optional): </div>
                <div>
                    <MessageText name='messagetext' />
                </div>
                <SendButton type='submit' value='Send' />
                <ResetButton
                    onClick={() => {
                        setRequestAppointment(false);
                    }}
                >
                    Cancel
                </ResetButton>
            </form>
        </div>
    );
};

const MessageText = styled.textarea`
    width: 300px;
    height: 200px;
`;

const SendButton = styled.input`
    margin: 5px;
    padding: 10px 20px;
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
    padding: 10px 20px;
    background: lightpink;
    border: none;
    border-radius: 5px;
    &:active {
        opacity: 60%;
    }
`;

export default RequestAppointment;
