import React from 'react'
import logo from '../assets/logo_footer2.png';


function Lateral() {
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
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="#">Usuaris</a></li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="#">Rols</a></li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="#">Dades geogràfiques</a></li>
                        <li className="list-group-item px-0 opacity-75 activo"><a className="text-decoration-none d-block" href="#"><i className="bi bi-caret-right-fill pe-1"></i>Transportistes</a></li>
                        <li className="list-group-item py-3 px-1 text-white fondo-azul border-top no-hover"><i className="bi bi-send px-1 text-white"></i>Enviament</li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="#">Clients</a></li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="#">Ordres d'enviament <span className="badge rounded-pill bg-danger px-3 ms-2 text-white">9</span></a></li>
                        <li className="list-group-item py-3 px-1 text-white fondo-azul border-top no-hover"><i className="bi bi-inboxes px-1 text-white"></i>Recepció</li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="#">Proveïdors</a></li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="#">Estats Ordres</a></li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="#">Estats Línia</a></li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="#">Productes</a></li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="#">Lots</a></li>
                        <li className="list-group-item py-3 px-1 text-white fondo-azul border-top no-hover"><i className="bi bi-shop-window px-1 text-white"></i>Magatzem</li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="#">Gestió de magatzem</a></li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="#">Inventaris</a></li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="#">Incidències</a></li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="#">Moviments</a></li>
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


