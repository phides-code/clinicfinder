import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Header = () => {

  return (
    <div>
      <span><Link to="/">Healthcare-App</Link></span>
      <span>This is the header.</span>
      <span><Link to="/mypage">Click for MyPage</Link></span>
    </div>
  );
};

export default Header;