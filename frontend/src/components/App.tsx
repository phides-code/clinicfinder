import { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalStyles from './GlobalStyles';
import Header from './Header';
import Home from './Home';
import Footer from './Footer';
import Login from './Login';
import Signup from './Signup';
import ClinicianSignup from './ClinicianSignup';
import Welcome from './Welcome';
import { UserContext } from './UserContext';
import Profile from './Profile';
import FindAProvider from './FindAProvider';
import ClinicDetail from './ClinicDetail';
import Messages from './Messages';
import ViewMessage from './ViewMessage';
import MyAppointments from './MyAppointments';
import ViewAppointment from './ViewAppointment';
import ViewPatients from './ViewPatients';
import ViewDocument from './ViewDocument';
import Documents from './Documents';
import ClinicPhotos from './ClinicPhotos';

const App = () => {
    const { currentUser, setCurrentUser, redirectToRoute, setIsLoading } =
        useContext(UserContext);

    let localUser: string;
    let localHash: string;

    // when the user id and hashed password are in localStorage,
    // but the currentUser state is lost,
    // App will try to login the user automatically
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        localUser = localStorage.getItem('healthUser') as string;
        if (localUser && !currentUser) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            // log the user in
            console.log(`Lost state... login this user automatically`);
            // eslint-disable-next-line react-hooks/exhaustive-deps
            localHash = localStorage.getItem('healthUserHash') as string;
            userLogin();
        }
    }, []);

    const userLogin = async () => {
        console.log(`App.js verifying patientId: ${localUser}`);

        try {
            setIsLoading(true);
            const res = await fetch('/api/users/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId: localUser,
                    password: localHash,
                }),
            });
            const data = await res.json();

            if (data.status === 200) {
                // valid login
                console.log('valid login');
                setCurrentUser(data.user);
            } else if (data.status === 403) {
                // invalid login
                console.log('invalid login');
                window.alert('invalid login');
                setCurrentUser(null);
                localStorage.removeItem('healthUser');
                localStorage.removeItem('healthHash');
                redirectToRoute('/login');
            } else {
                window.alert(`got unexpected status:
        ${data.status}: ${data.message}`);
                setCurrentUser(null);
                localStorage.removeItem('healthUser');
                localStorage.removeItem('healthHash');
                redirectToRoute('/login');
            }
        } catch (err) {
            console.log(`App.js userLogin caught an error:`);
            console.log(err);
            window.alert(`App.js userLogin caught an error...`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Wrapper>
            <BrowserRouter>
                <GlobalStyles />
                <Header />
                <Main>
                    <Routes>
                        <Route path='/' element={<Home />} />

                        <Route path='/login' element={<Login />} />

                        <Route path='/signup' element={<Signup />} />

                        <Route
                            path='/cliniciansignup'
                            element={<ClinicianSignup />}
                        />

                        <Route path='/welcome' element={<Welcome />} />

                        <Route
                            path='/clinicdetail/:clinicId'
                            element={<ClinicDetail />}
                        />

                        <Route
                            path='/clinicphotos/:clinicId'
                            element={<ClinicPhotos />}
                        />

                        <Route path='/profile/:id' element={<Profile />} />

                        <Route
                            path='/findaprovider'
                            element={<FindAProvider />}
                        />

                        <Route path='/messages' element={<Messages />} />

                        <Route path='/documents' element={<Documents />} />

                        <Route
                            path='/viewmessage/:messageId'
                            element={<ViewMessage />}
                        />

                        <Route
                            path='/viewdocument/:documentId'
                            element={<ViewDocument />}
                        />

                        <Route
                            path='/myappointments'
                            element={<MyAppointments />}
                        />

                        <Route
                            path='/viewappointment/:appointmentId'
                            element={<ViewAppointment />}
                        />

                        <Route
                            path='/viewpatients'
                            element={<ViewPatients />}
                        />

                        <Route path=''>404: Oops!</Route>
                    </Routes>
                </Main>
                <Footer />
            </BrowserRouter>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: stretch;
    align-content: stretch;
`;

const Main = styled.div`
    background-color: lightblue;
    min-height: 535px;
`;

export default App;
