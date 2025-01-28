import React from 'react';
import Header from '../Header';
import {Routes,Route,Outlet } from 'react-router-dom';
import Magatzem from './Magatzem';
import Carrer from './Carrer';
import Estanteria from './Estanteria';
import Espai from './Espai';


const GestioMagatzem = () => {
    return (
        <div>
            <Header title="Gestió de Magatzem"></Header>
            <Outlet />
             <Routes >
                      <Route path="magatzem" element={<Magatzem />} />
                      <Route path="carrer/:magatzem" element={<Carrer />} />
                      <Route path="estanteria/:magatzem/:carrer" element={<Estanteria />} />
                      <Route path="espai/:magatzem/:carrer/:estateria" element={<Espai />} />
             </Routes>
             
        </div>
    );
}

export default GestioMagatzem;
