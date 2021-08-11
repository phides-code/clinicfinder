import React, { useEffect, useContext } from "react";
import styled from "styled-components";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import GlobalStyles from "./GlobalStyles";
import Header from "./Header";
import Home from "./Home";
import Footer from "./Footer";
import Login from "./Login";
import Signup from "./Signup";
import ClinicianSignup from "./ClinicianSignup";
import Welcome from "./Welcome";
import { UserContext } from "./UserContext";
import { useHistory } from "react-router";
import Profile from "./Profile";
import FindAProvider from "./FindAProvider";
import ClinicDetail from "./ClinicDetail";
import Messages from "./Messages";
import ViewMessage from "./ViewMessage";
import MyAppointments from "./MyAppointments";
import ViewAppointment from "./ViewAppointment";
import ViewPatients from "./ViewPatients";
import ViewDocument from "./ViewDocument";
import Documents from "./Documents";
import clinicImg from "../assets/clinic.jpeg";
import ClinicPhotos from "./ClinicPhotos";

const App = () => {
  const {
    currentUser,
    setCurrentUser
  } = useContext(UserContext);
  const history = useHistory();

  let localUser;
  let localHash;

  // when the user id and hashed password are in localStorage,
  // but the currentUser state is lost,
  // App will try to login the user automatically
  useEffect(() => {
    localUser = localStorage.getItem("healthUser");
    if (localUser && !currentUser ) {
      // log the user in
      console.log(`Lost state... login this user automatically`);
      localHash = localStorage.getItem("healthUserHash");
      userLogin();
    }
  }, []);

  const userLogin = async () => {
    console.log(`App.js verifying patientId: ${localUser}`);

    try {
      const res = await fetch ("/api/users/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: localUser, 
          password: localHash
        })
      });
      const data = await res.json();

      if (data.status === 200) {
        // valid login
        console.log("valid login");
        setCurrentUser(data.user);

      } else if (data.status === 403){
        // invalid login
        console.log("invalid login");
        window.alert("invalid login");
        setCurrentUser(null);
        localStorage.removeItem("healthUser");
        localStorage.removeItem("healthHash");
        history.push("/login");

      } else {
        window.alert(`got unexpected status:
        ${data.status}: ${data.message}`);
        setCurrentUser(null);
        localStorage.removeItem("healthUser");
        localStorage.removeItem("healthHash");
        history.push("/login");
      }

    } catch (err) {
      console.log(`App.js userLogin caught an error:`);
      console.log(err);
      window.alert(`App.js userLogin caught an error...`);
    }
  };

  return (
    <Wrapper>
      <BrowserRouter>
        <GlobalStyles />
        <Header />
        <Main>
          <Switch>
            <Route exact path="/">
              <Home/>
            </Route>

            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/signup">
              <Signup />
            </Route>

            <Route exact path="/cliniciansignup">
              <ClinicianSignup />
            </Route>

            <Route exact path="/welcome">
              <Welcome />
            </Route>

            <Route exact path="/clinicdetail/:clinicId">
              <ClinicDetail />
            </Route>

            <Route exact path="/clinicphotos/:clinicId">
              <ClinicPhotos />
            </Route>
            
            <Route exact path="/profile/:id">
              <Profile />
            </Route>
            <Route exact path="/findaprovider">
              <FindAProvider />
            </Route>

            <Route exact path="/messages">
              <Messages />
            </Route>

            <Route exact path="/documents">
              <Documents />
            </Route>

            <Route exact path="/viewmessage/:messageId">
              <ViewMessage />
            </Route>

            <Route exact path="/viewdocument/:documentId">
              <ViewDocument />
            </Route>

            <Route exact path="/myappointments">
              <MyAppointments />
            </Route>

            <Route exact path="/viewappointment/:appointmentId">
              <ViewAppointment />
            </Route>

            <Route exact path="/viewpatients">
              <ViewPatients />
            </Route>

            <Route path="">404: Oops!</Route>
          </Switch>
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
  /* background-image: url(${clinicImg});
  background-size: 80%;
  background-repeat: no-repeat;
  background-position: center;*/
  background-color: lightblue; 
  min-height: 535px;
`;

export default App;
