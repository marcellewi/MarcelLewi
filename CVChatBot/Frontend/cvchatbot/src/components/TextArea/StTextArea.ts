import styled from 'styled-components';
import { NAVBAR_COLOR } from '../../utils/constants';

const StTextArea = styled.div`
  width: 100%;
  padding: 20px;
  text-align: center;
  position: relative;

  img {
    width: 4%;
    height: auto;
    position: fixed;
    top: 652px;
    left: 93%; 
    z-index: 1000;
    cursor: pointer;
  }

  textarea {
    width: 95%;
    color: black;
    border: 2px solid ${NAVBAR_COLOR};
    font-size: 16px;
    line-height: 1.5; 
    resize: none;
    border-radius: 20px;
    padding: 20px;
    padding-right: 70px;

    :focus {
      color: #000;
      outline: none;
      border: 2px solid black;
    }
  }
`;

export default StTextArea;
