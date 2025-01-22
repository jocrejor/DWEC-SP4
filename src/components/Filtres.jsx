import React from 'react'

function Filtres() {
    return (
        <>
            <div className="row bg-grey pt-3 px-2 mx-0">
                <div className="col-12 col-md-6 col-xl-4">
                    <div className="mb-3 text-light-blue">
                        <label for="nombre" className="form-label">Magatzem</label>
                        <input type="text" placeholder='Ex: 01' className="form-control" id="nombre" />
                    </div>
                </div>
                <div className="col-12 col-md-6 col-xl-4">
                    <div className="mb-3 text-light-blue">
                        <label for="carrer" className="form-label">Carrer</label>
                        <input type="text" placeholder='Ex: 02' className="form-control" id="carrer" />
                    </div>
                </div>
                <div className="col-12 col-md-6 col-xl-4">
                    <div className="mb-3 text-light-blue">
                        <label for="estanteria" className="form-label">Estanteria</label>
                        <input type="text" placeholder='Ex: 03' className="form-control" id="telefono" />
                    </div>
                </div>
                <div className="col-12 col-md-6 col-xl-4">
                    <div className="mb-3 text-light-blue">
                        <label for="espai" className="form-label">Espai</label>
                        <input type="email" placeholder='Ex: 04' className="form-control" id="espai" />
                    </div>
                </div>
                <div className="col-12 col-md-6 col-xl-4">
                    <div className="mb-3 text-light-blue">
                        <label for="producte" className="form-label">Producte</label>
                        <input type="email" placeholder='Ex: Producto uno' className="form-control" id="producte" />
                    </div>
                </div>
                <div className="col-12 col-md-6 col-xl-4">
                    <div className="mb-3 text-light-blue">
                        <label for="data" className="form-label">Data</label>
                        <input type="date" placeholder='Ex: Reception' className="form-control" id="data" />
                    </div>
                </div>
                <div className="col-12 col-md-6 col-xl-4">
                    <div className="mb-3 text-light-blue">
                        <label for="operari" className="form-label">Operari</label>
                        <input type="email" placeholder='Ex: 1' className="form-control" id="operari" />
                    </div>
                </div>
                <div className="col-12 col-md-6 col-xl-4">
                    <div className="mb-3 text-light-blue">
                        <label for="origen" className="form-label">Origen</label>
                        <input type="email" placeholder='Ex: Reception' className="form-control" id="origen" />
                    </div>
                </div>
                <div className="col-xl-4"></div>
                <div className="col-xl-4"></div>
            </div>
            <div className="row bg-grey pb-3 mx-0">
                <div className="col-xl-4"></div>
                <div className="col-xl-4"></div>
                <div className="col-12 col-xl-4 text-end">
                    <button className="btn btn-secondary ps-2 me-2 text-white"><i className="bi bi-trash px-1 text-white"></i>Netejar</button>
                    <button className="btn btn-primary me-2 ps-2 orange-button text-white"><i className="bi bi-funnel px-1 text-white"></i>Filtrar</button>
                </div>
            </div>
        </>
    )
}

export default Filtres