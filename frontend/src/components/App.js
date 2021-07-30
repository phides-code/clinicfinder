import React, { useEffect } from "react";
import styled from "styled-components";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import GlobalStyles from "./GlobalStyles";
import Header from "./Header";
import Home from "./Home";
import MyPage from "./MyPage";
import Footer from "./Footer";
import Login from "./Login";
import Signup from "./Signup";

const App = () => {

  // useEffect

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
            <Route exact path="/mypage">
              <MyPage />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/signup">
              <Signup />
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
  background-color: lightblue;
  min-height: 580px;
`;

export default App;
