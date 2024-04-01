import { useState, useEffect } from 'react';
import { CubeContainer, Cube } from './styles/StTextGenerator';
import { ask } from '../../api/api_call';


interface TextGeneratorProps {
  query: string;
}

const TextGenerator = ({ query }: TextGeneratorProps) => {

  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    setGeneratedText('');
    generateText();
  }, [query]);

  const getTextFromBackend = async () => {
    try {
      setIsGenerating(true);
      const resp = await ask(query);
      setIsGenerating(false);
      return resp.message;
    } catch (error) {
      console.error('Error asking question:', error);
      setError(true);
      setIsGenerating(false);
      return
    }
  };

  
  const generateText = async () => {
    setError(false);
    setIsGenerating(true);
    if (query === '') {
      setGeneratedText('Bienvenido a CV Chatbot! Hazme una pregunta para comenzar.');
      setIsGenerating(false);
    } else {
      const textFromBackend = await getTextFromBackend();
      setGeneratedText(textFromBackend);
      setIsGenerating(false);
    }
  };
 

  return (
    <CubeContainer>
      <Cube>
        {error ? 
        'Error al generar la respuesta' :
        generatedText}
        {isGenerating && <span>|</span>} 
      </Cube>
    </CubeContainer>
  );
};

export default TextGenerator;
