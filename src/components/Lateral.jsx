import React from 'react'
import logo from '../assets/logo_footer2.png';


function Lateral() {
<<<<<<< HEAD
  return (
    <div className="col-2">
<div id="menu" className="fondo-azul">
    <div className="centrat separacio">
        <img src={logo} alt="Logo Stockflow" id="logo"/>
    </div>
    <nav className="fondo-azul">
        <ul id="opciones" className="padding-izq-zero">
            <li>
                <a><i className="fa-solid fa-warehouse"></i>Administració</a>
                <ul className="padding-izq-zero">
                    <li><a href="../../../administracio/usuaris/llistat/llistatUsuaris.html"><i className="fa-solid fa-circle-chevron-right"></i>Usuaris</a></li>
                    <li><a href="../../../administracio/rols/llistat/llistatUserProfile.html"><i className="fa-solid fa-circle-chevron-right"></i>Rols</a></li>
                    <li><a href="../../../administracio/estatsProvinciesCiutats/state/llistaEstat.html"><i className="fa-solid fa-circle-chevron-right"></i>Dades geogràfiques</a></li>
                    <li><a href="../../../administracio/transportistes/llistar/llistatTransportistes.html"><i className="fa-solid fa-circle-chevron-right"></i>Transportistes</a></li>
                </ul>
            </li>
            <li>
                <a><i className="fa-solid fa-file-invoice-dollar"></i>Enviament</a>
                <ul className="padding-izq-zero">
                    <li><a href="../../../enviament/clients/llistar/llistar.html"><i className="fa-solid fa-circle-chevron-right"></i>Clients</a></li>
                    <li><a href="../../../enviament/ordesEnviament/llistat/llistatOrdre.html"><i className="fa-solid fa-circle-chevron-right"></i>Ordens d'enviament</a></li>
                </ul>
            </li>
            <li>
                <a><i className="fa-solid fa-boxes-stacked"></i>Recepció</a>
                <ul className="padding-izq-zero">
                    <li><a href="../../../recepcio/proveidors/proveidors.html"><i className="fa-solid fa-circle-chevron-right"></i>Proveidors</a></li>
                    <li><a href="../../../recepcio/ordesRecepcio/llistar/llistar.html"><i className="fa-solid fa-circle-chevron-right"></i>Ordres de recepció</a></li>
                    <li><a href="/estatsOrdre"><i className="fa-solid fa-circle-chevron-right"></i>Estats Ordre</a></li>
                    <li><a href="../../../recepcio/estatsOrdesRecepcio/estatLinia/listar/listar.html"><i className="fa-solid fa-circle-chevron-right"></i>Estats Línia</a></li>
                    <li><a className="paginaActiva" href="/productes/"><i className="fa-solid fa-circle-chevron-right paginaActiva"></i>Productes</a></li>
                    <li><a href="../../../recepcio/lots/lots.html"><i className="fa-solid fa-circle-chevron-right"></i>Lots</a></li>
                </ul>
            </li>
            <li>
                <a><i className="fa-solid fa-box-open"></i>Magatzem</a>
                <ul className="padding-izq-zero">
                    <li><a href="../../../magatzem/gestioMagatzem/Magatzem/Llistat/LlistaMagatzem.html"><i className="fa-solid fa-circle-chevron-right"></i>Gestió del magatzem</a></li>
                    <li><a href="../../../magatzem/inventari/processarInventari/processarInventari.html"><i className="fa-solid fa-circle-chevron-right"></i>Inventaris</a></li>
                    <li><a href="/incidencies/"><i className="fa-solid fa-circle-chevron-right"></i>Incidències</a></li>
                    <li><a href="../../../magatzem/moviments/moviments.html"><i className="fa-solid fa-circle-chevron-right"></i>Moviments</a></li>
                </ul>
            </li>
            <li>
                <a href="" id="sesion"><i className="fa-solid fa-right-from-bracket"></i>Tancar sessió</a>
            </li>
        </ul>
    </nav>
    <button id="dropdown" className="fondo-azul"><i className="fa-solid fa-bars text-blanc"></i></button>
</div>
</div>
  )
=======
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
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="/dadesGeografiques">Dades geogràfiques</a></li>
                        <li className="list-group-item px-0 opacity-75 activo"><a className="text-decoration-none d-block" href="/transportistes"><i className="bi bi-caret-right-fill pe-1"></i>Transportistes</a></li>
                        <li className="list-group-item py-3 px-1 text-white fondo-azul border-top no-hover"><i className="bi bi-send px-1 text-white"></i>Enviament</li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="/clients">Clients</a></li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="/ordesEnviament">Ordres d'enviament <span className="badge rounded-pill bg-danger px-3 ms-2 text-white">9</span></a></li>
                        <li className="list-group-item py-3 px-1 text-white fondo-azul border-top no-hover"><i className="bi bi-inboxes px-1 text-white"></i>Recepció</li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="/proveidors">Proveïdors</a></li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="/ordesRecepcio">Ordres de Recepció</a></li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="/estatsOrdre">Estats Ordres</a></li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="/estatsLinia">Estats Línia</a></li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="/productes">Productes</a></li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="/lots">Lots</a></li>
                        <li className="list-group-item py-3 px-1 text-white fondo-azul border-top no-hover"><i className="bi bi-shop-window px-1 text-white"></i>Magatzem</li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="/gestioMagatzem">Gestió de magatzem</a></li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="/inventaris">Inventaris</a></li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="/incidencies">Incidències</a></li>
                        <li className="list-group-item fondo-azul-claro"><a className="text-decoration-none text-white d-block" href="/moviments">Moviments</a></li>
                        <li className="list-group-item text-white logout"><a className="text-decoration-none text-white d-block" href="/logout"><i className="bi bi-box-arrow-right pe-1 text-white"></i>Tancar</a></li>
                    </ul>
                </nav>
                <button id="dropdown" className="d-xl-none d-block me-4 fondo-azul border border-0"><i className="bi bi-list text-white fs-1"></i></button>
            </div>
        </div>
        </>
    )
>>>>>>> main
}

export default Lateral


