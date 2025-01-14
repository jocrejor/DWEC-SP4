import { useState } from 'react'
import './App.css'
import Lateral from './components/Lateral'
import Login from './components/login';
import Logout from './components/logout';
import Main from './components/Main'
import { Routes,Route} from "react-router-dom";
import Footer from './components/Footer'
import Productes from './components/Productes';
import Usuaris from './components/Usuaris';
import Rols from './components/Rols';
import DadesGeografiques from './components/DadesGeografiques';
import Transportistes from './components/Transportistes';
import Clients from './components/Clients';
import OrdesEnviament from './components/OrdesEnviament';
import Proveidors from './components/Proveidors';
import OrdesRecepcio from './components/OrdesRecepcio';
import EstatsOrdre from './components/EstatsOrdre';
import EstatsLinia from './components/EstatsLinia';
import Lots from './components/Lots';
import GestioMagatzem from './components/GestioMagatzem';
import Inventaris from './components/Inventaris';
import Incidencies from './components/Incidencies';
import Moviments from './components/Moviments';

function App() {


  return (
    <>
     <div className="container-fluid">
     <div className="row">
        {/* <Lateral /> */}
      
       <Routes>
       
       <Route path="/login" element={<Login/>}/>  

       <Route path="/logout" element={<Logout/>}/> 

       <Route path="/usuaris" element={<Usuaris/>}/>

       <Route path="/rols" element={<Rols/>}/> 

       <Route path="/dadesGeografiques" element={<DadesGeografiques/>}/>

       <Route path="/transportistes" element={<Transportistes/>}/>

       <Route path="/clients" element={<Clients/>}/>

       <Route path="/ordesEnviament" element={<OrdesEnviament/>}/>

       <Route path="/proveidors" element={<Proveidors/>}/>

       <Route path="/ordesRecepcio" element={<OrdesRecepcio/>}/>

       <Route path="/estatsOrdre" element={<EstatsOrdre/>}/>

       <Route path="/estatsLinia" element={<EstatsLinia/>}/>
       
       <Route path="/productes" element={<Productes/>}/>

       <Route path="/lots" element={<Lots/>}/>  

       <Route path="/gestioMagatzem" element={<GestioMagatzem/>}/>  

       <Route path="/inventaris" element={<Inventaris/>}/>  

       <Route path="/incidencies" element={<Incidencies/>}/>  

       <Route path="/moviments" element={<Moviments/>}/>  
       
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
