import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import {Button, Container} from 'react-bootstrap';



function Logout () {
    const borrarToken = ()=>{
        localStorage.clear();
    }
    return(
        <Container>
        <h1>Logout</h1>
        <h4 >Quieres salir de tu perfil de usuario?</h4>
    
          <Button type="submit"
                  id="enviar"
                  className="mt-2"
                  onClick={()=> borrarToken()}
                  >
              Salir
          </Button>
        </Container>
    )
  
} 

export default Logout; 