import styled from 'styled-components';
import { BACKGROUND_COLOR, NAVBAR_COLOR } from '../../../utils/constants';

export const StButton = styled.button`
  background: ${NAVBAR_COLOR};
  border: none;
  border-radius: 20px;
  color: black;
  padding: 10px 20px;
  font-size: 20px;
  cursor: pointer;
  margin: 0px 10px;
  transition: all 0.3s ease-in-out;

  &:hover {
    background:${BACKGROUND_COLOR} ;
  }
`;