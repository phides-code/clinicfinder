import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router';
const CryptoJS = require('crypto-js');

const Login = () => {
    const [invalidUser, setInvalidUser] = useState(false);
    const navigate = useNavigate();
    const { setCurrentUser } = useContext(UserContext);

    useEffect(() => {
        const checkLocalUser = localStorage.getItem('healthUser');
        if (checkLocalUser) {
            console.log(`checkLocalUser yes, redirecting...`);
            navigate('/');
        }
    }, [navigate]);

    const userLogin = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        const target = ev.target as HTMLFormElement;

        console.log(`verifying patientId: ${target.patientId.value}`);
        const hashedPassword = CryptoJS.AES.encrypt(
            target.password.value,
            'hello'
        ).toString();

        try {
            const res = await fetch('/api/users/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId: target.patientId.value,
                    password: hashedPassword,
                }),
            });
            const data = await res.json();

            if (data.status === 200) {
                // valid login
                console.log('valid login');
                setCurrentUser(data.user);
                localStorage.setItem('healthUser', target.patientId.value);
                localStorage.setItem('healthUserHash', hashedPassword);

                navigate('/');
            } else if (data.status === 403) {
                // invalid login
                console.log('invalid login');
                setInvalidUser(true);
                target.patientId.value = '';
                target.password.value = '';
            } else {
                window.alert(`got unexpected status:
        ${data.status}: ${data.message}`);
            }
        } catch (err) {
            console.log(`userLogin caught an error:`);
            console.log(err);
            window.alert(`userLogin caught an error...`);
        }
    };

    return (
        <Wrapper>
            <h1>Login</h1>
            {/* <div> */}
            <LoginForm onSubmit={(ev) => userLogin(ev)}>
                <div>
                    <label>Patient or Clinician ID: </label>
                </div>
                <div>
                    <StyledInput name='patientId' required />
                </div>

                <div>
                    <label>Password: </label>
                </div>
                <div>
                    <StyledInput type='password' name='password' required />
                </div>
                {invalidUser && (
                    <InvalidLogin>*** Invalid Login ***</InvalidLogin>
                )}
                <LoginDiv>
                    <LoginButton type='submit' value='Login' />
                </LoginDiv>
            </LoginForm>
            {/* </div> */}
        </Wrapper>
    );
};

const StyledInput = styled.input`
    min-width: 260px;
`;

const InvalidLogin = styled.div`
    margin-top: 10px;
    color: red;
`;

const LoginForm = styled.form``;

const LoginButton = styled.input`
    margin: 20px 0px;
    padding: 10px 20px;
    background: lightblue;
    border: none;
    border-radius: 5px;
    &:active {
        opacity: 60%;
    }
`;

const LoginDiv = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    align-content: center;
`;

const Wrapper = styled.div`
    border-radius: 10px;
    margin: 50px 50px;
    background-color: white;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    align-content: center;
`;

export default Login;
