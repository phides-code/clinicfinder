import { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router';

const Login = () => {
    const navigate = useNavigate();
    const { invalidUser, userLogin } = useContext(UserContext);

    useEffect(() => {
        const checkLocalUser = localStorage.getItem('healthUser');
        if (checkLocalUser) {
            console.log(`checkLocalUser yes, redirecting...`);
            navigate('/');
        }
    }, [navigate]);

    return (
        <Wrapper>
            <h1>Login</h1>
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
