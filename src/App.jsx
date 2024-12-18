import { useState } from 'react'
import './App.css'
import { Container} from 'react-bootstrap/';
import Login from './components/login';
import Logout from './components/logout';
import Main from './components/Main'
import { Routes,Route} from "react-router-dom";


function App() {


  return (
    <>
      <div><p>Header</p></div>
       <h1>EStructura</h1>
       <Container>
       <Routes>
       
       <Route path="/login" element={<Login/>}/>  

       <Route path="/logout" element={<Logout/>}/>  
       
       <Route path="/" element={<Main/>} />
          
       <Route path="/404" element={<Error404/>} />
          
       <Route path="*" element={<Error404/>} />

       </Routes>
       </Container>

      <div>
        <p>Footer</p>
      </div>
      
      
    </>
  )
}

function Error404 (){
  return (
    <div>
    <h2>ERROR 404</h2>
    </div>
    );
}

export default App
