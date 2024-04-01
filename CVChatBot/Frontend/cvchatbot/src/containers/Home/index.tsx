import {StHome, StImg}  from './StHome';
import Button from '../../components/Buttons';
import { useNavigate } from 'react-router-dom';
import chatbot_img from '../../resources/chatbot_img.png';


function Home() {

    const navigate = useNavigate();

    const goToChatbot = () => {
        navigate('/chatbot');
    };

    return (
        <StHome>
           <h3>Bienvenidos al Curriculum Vitae de Marcel Lewi!</h3>
            <h4>Este chatbot funciona a modo de CV interactivo.
            Podés preguntarle lo que quieras y cuando quieras. <br />
            ¡El chatbot te responderá con la
            información más precisa sobre mi recorrido a lo largo de los años!</h4>
            <StImg src={chatbot_img} alt="Logo chatbot" />
            <Button text="Iniciar Chat" onClick={goToChatbot} />
        </StHome>
    );
  }
  
  export default Home;