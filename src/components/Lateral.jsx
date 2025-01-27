import React from 'react'
import logo from '../assets/logo_footer2.png';
import '../App'
import Nav from 'react-bootstrap/Nav';
import { useState } from 'react';
import { Link } from 'react-router-dom';


function Lateral() {
    const [activeOption, setActiveOption] = useState();
    const liActive     = 'list-group-item px-0 opacity-75 activo';
    const liInactive   = 'list-group-item fondo-azul-claro';
    const linkActive   = 'text-decoration-none d-block';
    const linkInactive = 'text-decoration-none text-white d-block';

    return (
        <>
        <div className="col-12 col-xl-2 p-0 fondo-azul">
            <div className="d-flex justify-content-between align-items-center overflow-visible d-xl-block">
                <div className="d-flex">
                    <img id="logo" className="m-4 py-xl-4 m-xl-auto" src={logo} alt="Logo Stockflow"/>
                </div>
                <nav id="menu" className="d-xl-block">
                    <ul className="list-group list-group-flush border-top border-bottom ">
                        <li className="list-group-item py-3 px-1 text-white fondo-azul no-hover"><i className="bi bi-house-fill px-1 text-white"></i>Administració</li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="/usuaris">Usuaris</a></li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="/rols">Rols</a></li>
                        <li className={activeOption == 'DadesGeografiques' ? liActive : liInactive}><Link className={activeOption == 'DadesGeografiques' ? linkActive : linkInactive} onClick={()=>{setActiveOption('DadesGeografiques'); console.log(activeOption)}} to="/dadesGeografiques">{activeOption == 'DadesGeografiques' ? <i className="bi bi-caret-right-fill pe-1"></i> : null}Dades geogràfiques</Link></li>
                        <li className={activeOption == 'Transportistes' ? liActive : liInactive}><Link className={activeOption == 'Transportistes' ? 'text-decoration-none d-block' : 'text-decoration-none text-white d-block'}  onClick={()=>{setActiveOption('Transportistes')}} to="/transportistes">{activeOption == 'Transportistes' ? <i className="bi bi-caret-right-fill pe-1"></i> : null}Transportistes</Link></li>
                        <li className="list-group-item py-3 px-1 text-white fondo-azul border-top no-hover"><i className="bi bi-send px-1 text-white"></i>Enviament</li>
                        <li className={activeOption == 'Clients' ? liActive: liInactive}><Link className={activeOption == 'Clients' ? 'text-decoration-none d-block' : 'text-decoration-none text-white d-block'} onClick={()=>{setActiveOption('Clients'); console.log(activeOption)}} to="/clients">{activeOption == 'Clients' ? <i className="bi bi-caret-right-fill pe-1"></i> : null}Clients</Link></li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="/ordesEnviament">Ordres d'enviament <span className="badge rounded-pill bg-danger px-3 ms-2 text-white">9</span></a></li>
                        <li className="list-group-item py-3 px-1 text-white fondo-azul border-top no-hover"><i className="bi bi-inboxes px-1 text-white"></i>Recepció</li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="/proveidors">Proveïdors</a></li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="/ordesRecepcio">Ordres de recepció</a></li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="/estatsOrdre">Estats Ordres</a></li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="/estatsLinia">Estats Línia</a></li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="/productes">Productes</a></li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="/lots">Lots</a></li>
                        <li className="list-group-item py-3 px-1 text-white fondo-azul border-top no-hover"><i className="bi bi-shop-window px-1 text-white"></i>Magatzem</li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="/gestioMagatzem">Gestió de magatzem</a></li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="/inventaris">Inventaris</a></li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="/incidencies">Incidències</a></li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="/moviments">Moviments</a></li>
                        <li className="list-group-item text-white logout"><a className="text-decoration-none text-white d-block" href="#"><i className="bi bi-box-arrow-right pe-1 text-white"></i>Tancar</a></li>
                    </ul>
                </nav>
                <button id="dropdown" className="d-xl-none d-block me-4 fondo-azul border border-0"><i className="bi bi-list text-white fs-1"></i></button>
            </div>
        </div>
        </>
    )
}

export default Lateral


