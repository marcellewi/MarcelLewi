import React from 'react';	
import { StButton } from './styles/StButton';

interface ButtonProps {
    text: string;
    onClick: () => void; 
}

const Button = ({text, onClick}: ButtonProps) => {
    return (
      <StButton onClick={onClick}>
        {text}
      </StButton>
    );
  };
  
  export default Button;