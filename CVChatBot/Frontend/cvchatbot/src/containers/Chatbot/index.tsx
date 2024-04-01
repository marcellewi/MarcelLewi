import { useState } from 'react';
import { StChatbot } from './styles/StChatbot';
import TextGenerator from '../../components/TextGenerator';
import TextArea from '../../components/TextArea';

function Chatbot() {
    const [query, setQuery] = useState('');

    const handleChange = (e: any) => {
        setQuery(e);
    };

    return (
        <StChatbot>
            <TextGenerator query={query} />
            <TextArea onChange={e => handleChange(e)} placeholder={'Pregunta lo que quieras...'}/>
        </StChatbot>
    );
  }
  
  export default Chatbot;