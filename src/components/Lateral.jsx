import React from 'react'
import logo from '../assets/logo_footer2.png';


function Lateral() {
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
                    <li><a href="/OrdesRecepcio/"><i className="fa-solid fa-circle-chevron-right"></i>Ordres de recepció</a></li>
                    <li><a href="/estatsOrdre/"><i className="fa-solid fa-circle-chevron-right"></i>Estats Ordre</a></li>
                    <li><a href="/estatsLinia"><i className="fa-solid fa-circle-chevron-right"></i>Estats Línia</a></li>
                    <li><a className="paginaActiva" href="/productes/"><i className="fa-solid fa-circle-chevron-right paginaActiva"></i>Productes</a></li>
                    <li><a href="../../../recepcio/lots/lots.html"><i className="fa-solid fa-circle-chevron-right"></i>Lots</a></li>
                </ul>
            </li>
            <li>
                <a><i className="fa-solid fa-box-open"></i>Magatzem</a>
                <ul className="padding-izq-zero">
                    <li><a href="../../../magatzem/gestioMagatzem/Magatzem/Llistat/LlistaMagatzem.html"><i className="fa-solid fa-circle-chevron-right"></i>Gestió del magatzem</a></li>
                    <li><a href="../../../magatzem/inventari/processarInventari/processarInventari.html"><i className="fa-solid fa-circle-chevron-right"></i>Inventaris</a></li>
                    <li><a href="../../../magatzem/incidents/incidencies.html"><i className="fa-solid fa-circle-chevron-right"></i>Incidències</a></li>
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
}

export default Lateral


