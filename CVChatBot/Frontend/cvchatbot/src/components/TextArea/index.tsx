import { FunctionComponent, useState } from 'react';
import StTextArea from './StTextArea';
import enterLogo from "../../resources/enterLogo.png"

interface TextAreaProps {
  placeholder?: string;
  onChange(text: string): void;
  logo?: boolean;
}

const TextArea: FunctionComponent<TextAreaProps> = ({
  placeholder,
  onChange,
  logo,
}) => {
  const [text, setText] = useState(''); 

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault(); 
      onChange(text);
      setText(''); 
    };

    const handleClick = () => {
      onChange(text);
      setText('');
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit(e);
      }
    };

  return (
    <StTextArea>
      <form onSubmit={handleSubmit}>
       <div className="content-wrapper">
        {logo &&<img src={enterLogo} alt="enter logo" onClick={() => {handleClick()}}/>}
        <textarea     
          onChange={e => setText(e.target.value)}
          placeholder={placeholder}
          value={text}
          onKeyDown={handleKeyDown}
        />
       </div>
      </form>
    </StTextArea>
  );
};

export default TextArea;