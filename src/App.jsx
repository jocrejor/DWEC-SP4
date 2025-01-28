import { Routes, Route } from "react-router-dom";
import './App.css'
import Lateral from './components/Lateral'
import Login from './components/login';
import Logout from './components/logout';
import Home from './components/Home.jsx'

import Productes from './components/Recepcio/Productes';
import Usuaris from './components/Administracio/Usuaris';
import Rols from './components/Administracio/Rols';
import DadesGeografiques from './components/Administracio/DadesGeografiques';
import Transportistes from './components/Administracio/Transportistes';
import Clients from './components/Enviament/Clients';
import OrdesEnviament from './components/Enviament/OrdesEnviament';
import Proveidors from './components/Recepcio/Proveidors';
import OrdesRecepcio from './components/Recepcio/OrdesRecepcio';
import EstatsOrdreRecepcio from './components/Recepcio/EstatsOrdreRecepcio';
import EstatsOrdeRecepcioLinia from './components/Recepcio/EstatsOrdreRecepcioLinia.jsx';
import Lots from './components/Recepcio/Lots';


import GestioMagatzem from './components/Administracio/DadesGeografiques';
import Magatzem from './components/Magatzem/Magatzem';
import Carrer from './components//Magatzem/Carrer';
import Estanteria from './components/Magatzem/Estanteria';
import Espai from './components/Magatzem/Espai';

import Inventaris from './components/Magatzem/Inventaris';
import Incidencies from './components/Magatzem/Incidencies';
import Moviments from './components/Magatzem/Moviments';
import Inventariar from './components/Magatzem/Inventariar';
import CompletarInventari from './components/Magatzem/CompletarInventari';
import './App.js';
import OrderPickingReception from './components/Recepcio/OrderPickingReception';
import OrderPickingShipping from './components/Enviament/OrderPickingShipping';

function App() {


  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <Lateral />
          <div className="col-12 col-xl-10 px-0">
            <div>

              <Routes>

                <Route path="/login" element={<Login />} />

                <Route path="/logout" element={<Logout />} />

                <Route path="/usuaris" element={<Usuaris />} />

                <Route path="/rols" element={<Rols />} />

                <Route path="/dadesGeografiques" element={<DadesGeografiques />} />

                <Route path="/transportistes" element={<Transportistes />} />

                <Route path="/clients" element={<Clients />} />

                <Route path="/ordresEnviament" element={<OrdesEnviament />} />

                <Route path="/proveidors" element={<Proveidors />} />

                <Route path="/ordresRecepcio" element={<OrdesRecepcio />} />

                <Route path="/estatsOrdreRecepcio" element={<EstatsOrdreRecepcio />} />

                <Route path="/estatsOrdreRecepcioLinia" element={<EstatsOrdeRecepcioLinia />} />

                <Route path="/productes" element={<Productes />} />

                <Route path="/lots" element={<Lots />} />

                <Route path="/GestioMagatzem" element={<GestioMagatzem/>} >
                   <Route path="magatzem" element={<Magatzem />} />
                      <Route path="Carrer/:magatzem" element={<Carrer />} />
                      <Route path="Estanteria/:carrer" element={<Estanteria />} />
                      <Route path="Espai/:estateria" element={<Espai />} />
                   </Route>
                
                <Route path="/inventaris/" element={<Inventaris />} />
                <Route path="/inventaris/inventariar/:id" element={<Inventariar />} />
                <Route path="/inventaris/completarInventari/:id" element={<CompletarInventari />} />
                


                <Route path="/incidencies" element={<Incidencies />} />

                <Route path="/moviments" element={<Moviments />} />
                
                <Route path="/orderpickingreception" element={<OrderPickingReception />} />

                <Route path="/orderpickingshipping" element={<OrderPickingShipping />} />

                <Route path="/" element={<Home />} />

                <Route path="/404" element={<Error404 />} />

                <Route path="*" element={<Error404 />} />

              </Routes>


            </div>
          </div>
        </div>
      </div>

    </>
  )
}

function Error404() {

  return (
    <div>
      <h2>ERROR 404</h2>
    </div>
  );
}

export default App