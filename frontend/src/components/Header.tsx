import { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router';
import appIcon from '../assets/app.svg';
import msgIcon from '../assets/mail.svg';

const Header = () => {
    const navigate = useNavigate();
    const { currentUser, setCurrentUser, newMessages, setNewMessages } =
        useContext(UserContext);

    useEffect(() => {
        //
        const interval = setInterval(() => {
            // interval to check for new messages
            if (currentUser) {
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
                        console.log(
                            `checking for new messages for recipient ${viewerId}`
                        );
                        const res = await fetch(`/api/getmessages`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                queryParams: {
                                    recipientId: viewerId,
                                    read: false,
                                },
                            }),
                        });
                        const data = await res.json();

                        if (data.status === 200) {
                            if (data.messages.length > 0) {
                                console.log(`found unread message`);
                                setNewMessages(true);
                            } else {
                                console.log('no unread messages found');
                                setNewMessages(false);
                            }
                        } else {
                            console.log('no unread messages found');
                        }
                    } catch (err) {
                        console.log(`caught error chekcing for messages`);
                        console.log(err);
                    }
                })();
            }
        }, 15000);
        return () => clearInterval(interval);
    }, [currentUser, setNewMessages]);

    return (
        <Wrapper>
            <LeftHeaderSection>
                <StyledLink to='/'>
                    <MainIcon
                        src={appIcon}
                        alt='healthcarefinder icon'
                        title='Home'
                    />
                </StyledLink>
                {currentUser && (
                    <StyledLink to='/messages'>
                        <MessageIcon
                            src={msgIcon}
                            alt='messages icon'
                            title='Messages'
                        />
                        {newMessages && <NewMessage>* New Message!</NewMessage>}
                    </StyledLink>
                )}
            </LeftHeaderSection>
            {currentUser && (
                <>
                    <RightHeaderSection>
                        <div>
                            Welcome, {` `}
                            <ProfileLink to={`/profile/${currentUser._id}`}>
                                {currentUser.name}
                            </ProfileLink>
                            !{` `}
                        </div>
                        <div>
                            <LogoutButton
                                onClick={() => {
                                    setCurrentUser(null);
                                    navigate('/');
                                    localStorage.removeItem('healthUser');
                                    localStorage.removeItem('healthHash');
                                    console.log(`Logging out`);
                                }}
                            >
                                Logout
                            </LogoutButton>
                        </div>
                    </RightHeaderSection>
                </>
            )}
        </Wrapper>
    );
};

const LogoutButton = styled.button`
    margin-top: 5px;
    background-color: red;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    color: white;
    transition: transform 0.2s;
    &:hover {
        transform: scale(1.1);
    }
    &:active {
        background-color: lightblue;
    }
`;

const ProfileLink = styled(Link)`
    text-decoration: none;
    &:visited {
        color: royalblue;
        text-decoration: none;
    }
    &:hover {
        color: red;
    }
`;

const MessageIcon = styled.img`
    margin: 10px;
    margin-right: 0px;
    height: 40px;
    transition: transform 0.2s;
    &:hover {
        transform: scale(1.1);
    }
`;

const MainIcon = styled.img`
    margin: 10px;
    height: 40px;
    transition: transform 0.2s;
    &:hover {
        transform: scale(1.1);
    }
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: red;
`;

const LeftHeaderSection = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: stretch;
`;

const RightHeaderSection = styled.div`
    margin-right: 10px;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: flex-end;
    align-content: stretch;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    align-content: center;
`;

const NewMessage = styled.span`
    color: red;
    font-size: xx-large;
`;

export default Header;
