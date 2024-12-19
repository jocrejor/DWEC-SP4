import { useState } from 'react'
import './App.css'
import Lateral from './components/Lateral'
import Login from './components/login';
import Logout from './components/logout';
import Main from './components/Main'
import { Routes,Route} from "react-router-dom";
import Footer from './components/Footer'

function App() {


  return (
    <>
     <div className="container-fluid">
     <div className="row">
        <Lateral />
      
       <Routes>
       
       <Route path="/login" element={<Login/>}/>  

       <Route path="/logout" element={<Logout/>}/>  
       
       <Route path="/" element={<Main/>} />
          
       <Route path="/404" element={<Error404/>} />
          
       <Route path="*" element={<Error404/>} />

       </Routes>

      <div>
        <Footer />
      </div>



    </div>
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
