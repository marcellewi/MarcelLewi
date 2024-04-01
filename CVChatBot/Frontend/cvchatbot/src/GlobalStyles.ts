import { createGlobalStyle } from "styled-components";
import { BACKGROUND_COLOR } from "./utils/constants";
export const GlobalStyle = createGlobalStyle`

  html,
  body {
    height: 100%;
    scroll-behavior: smooth;
    font-family: 'Nunito Sans', sans-serif;
    background-color: ${BACKGROUND_COLOR};
    overflow-y: hidden;
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    height: 100%;
    overflow-x: hidden;
    gap: 10px;
    margin-top: 10px;
  }
  `;