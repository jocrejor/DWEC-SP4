import React from 'react'
import Header from './Header'

function Main() {

  return (
    <>
        <div class="col-10 padding-zero">
            <div>
                <Header title="Llistat de productes" />
                <div class="container-fluid">
                    <div class="row rowFiltres">
                        <div class="col-4">
                            <div class="boxFiltre">
                                <label for="name">Nom:</label>
                                <input type="text" id="name" placeholder="Filtrar per nom"/>
                            </div>
                        </div>

                        <div class="col-4">
                            <div class="boxFiltre">
                                <label for="description">Descripció:</label>
                                <input type="text" id="description" placeholder="Filtrar per descripció"/>
                            </div>
                        </div>

                        <div class="col-4">
                            <div class="boxFiltre">                
                                <label for="sku">SKU:</label>
                                <input type="text" id="sku" placeholder="Filtrar per SKU"/>                 
                            </div>
                        </div>
                    </div>

                    {/*<!--<div class="row rowFiltres">                           
                        <div class="col-4">
                            <div class="boxFiltre">
                                <label for="lot">Filtrar per Lot/Serial:</label>
                                <input type="text" id="lot">
                            </div>
                        </div>
                    </div>-->*/}

                    {/**FILTRES BOTÓ */}
                    <div class="row rowFiltres">
                        <div class="col-12">
                            <div class="container-button-filter botonesFiltros"/>
                        <div>
                            <button id="netejaFiltros">Esborrar</button>
                            <button id="filtrarProductes">Filtrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
   </>
  )
}

export default Main