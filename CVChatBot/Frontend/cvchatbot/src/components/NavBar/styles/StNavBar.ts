
import styled from "styled-components";

export const StNavBar = styled.nav`
  background: skyblue;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-radius: 20px;
`;

export const NavLink = styled.a`
  color: black;
  text-decoration: none;
  margin-right: 20px;
  font-size: 25px;

  &:hover {
    text-decoration: underline;
  }
`;

export const StButtons = styled.nav`
  display: flex;
  padding: 0px 20px;
`;