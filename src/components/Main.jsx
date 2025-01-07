import React from 'react'

function Main() {

  return (
    <>
        <div className="col-10 padding-zero">
            <div>
                <div className="container-fluid">
                    <div className="row rowFiltres">
                        <div className="col-4">
                            <div className="boxFiltre">
                                <label for="name">Nom:</label>
                                <input type="text" id="name" placeholder="Filtrar per nom"/>
                            </div>
                        </div>

                        <div className="col-4">
                            <div className="boxFiltre">
                                <label for="description">Descripció:</label>
                                <input type="text" id="description" placeholder="Filtrar per descripció"/>
                            </div>
                        </div>

                        <div className="col-4">
                            <div className="boxFiltre">                
                                <label for="sku">SKU:</label>
                                <input type="text" id="sku" placeholder="Filtrar per SKU"/>                 
                            </div>
                        </div>
                    </div>

                    {/*<!--<div className="row rowFiltres">                           
                        <div className="col-4">
                            <div className="boxFiltre">
                                <label for="lot">Filtrar per Lot/Serial:</label>
                                <input type="text" id="lot">
                            </div>
                        </div>
                    </div>-->*/}

                    {/**FILTRES BOTÓ */}
                    <div className="row rowFiltres">
                        <div className="col-12">
                            <div className="container-button-filter botonesFiltros">
                                <button id="netejaFiltros">Esborrar</button>
                                <button id="filtrarProductes">Filtrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
   </>
  )
}

export default Main