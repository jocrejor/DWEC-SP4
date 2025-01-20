import {useContext} from 'react';
import { useNavigate } from 'react-router';
import {Button, Container} from 'react-bootstrap';
import { UserContext } from '../contextData/UserContext';
import Header from './Header';



function Logout () {

    const { logout } = useContext(UserContext);
    const navigate = useNavigate();

    const borrarUser = ()=>{
        logout
        navigate('/');
    }
    return(

        <Container>
        <Header title="Logout" />
        
        <h4 >Quieres salir de tu perfil de usuario?</h4>
    
          <Button type="submit"
                  id="enviar"
                  className="mt-2"
                  onClick={()=> borrarUser()}
                  >
              Salir
          </Button>
        </Container>
    )
  
} 

export default Logout; 