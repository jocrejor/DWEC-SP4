import React from 'react';
import Header from '../Header';
import { Outlet } from 'react-router-dom';

const GestioMagatzem = () => {
    return (
        <div>
            <Header title="Gestió de Magatzem"></Header>

            <Outlet />
        </div>
    );
}

export default GestioMagatzem;
