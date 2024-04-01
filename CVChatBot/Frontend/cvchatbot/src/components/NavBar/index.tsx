import React from "react";
import { NavLink, StButtons, StNavBar,  } from "./styles/StNavBar";

const Navbar = () => {
    return (
      <StNavBar>
        <StButtons>
          <NavLink href="/">Home</NavLink>
          <NavLink href="/chatbot">Chatbot</NavLink>
        </StButtons>
      </StNavBar>
    );
  };
  
  export default Navbar;