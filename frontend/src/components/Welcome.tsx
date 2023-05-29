import { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

const Welcome = () => {
    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext);

    useEffect(() => {
        const checkLocalUser = localStorage.getItem('healthUser');
        if (!checkLocalUser || !currentUser) {
            console.log(`no logged in user found, redirecting...`);
            navigate('/login');
        }
    }, [currentUser, navigate]);

    return (
        currentUser && (
            <div>
                <div>
                    <h1>
                        Welcome to the Clinic-Finder,{' '}
                        {currentUser.name.substr(
                            0,
                            currentUser.name.indexOf(' ')
                        )}
                        !
                    </h1>
                </div>
                <div>
                    Your {currentUser.userType} ID is:{' '}
                    <h2>{currentUser._id}</h2>
                </div>
                <div>Use it to login in the future.</div>
                {currentUser.userType === 'clinician' && (
                    <div>
                        You are registered with{' '}
                        <strong>{currentUser.clinicName}</strong>
                    </div>
                )}

                <div>
                    <StyledLink to='/'>Click here</StyledLink> to go to the home
                    page.
                </div>
            </div>
        )
    );
};

const StyledLink = styled(Link)`
    font-size: large;
    text-decoration: none;
    color: royalblue;
    margin: 0 auto;
    &:visited {
        color: royalblue;
    }
    &:hover {
        opacity: 90%;
    }
`;

export default Welcome;
