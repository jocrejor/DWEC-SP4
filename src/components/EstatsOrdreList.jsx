import React, { useState, useEffect} from 'react'
import {url,getData} from'../apiAccess/crud'


function EstatsOrdreList({action}) {

  const [data, setData] = useState([]);

useEffect( async ()=>{
    // Order estates
    const data = await getData(url, "OrderReception_Status")
    setData(data)
},[]);


  
  return (
   
    <div className="col-10 padding-zero">
    <div>
        <h2>Estats d'Ordes</h2>
        <div className="container-fluid">
            <div className="row rowFiltres">
                <div className="col-4">
                    <div className="boxFiltre">
                        <label htmlFor="name">Nom:</label>
                        <input type="text" placeholder="Filtrar per nom" />
                    </div>
                </div>
            </div>

            <div className="row rowFiltres">
                <div className="col-12">
                    <div className="container-button-filter botonesFiltros">
      <div>
        <button >Esborrar</button>
        <button >Filtrar</button>
      </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="boxTaula">
                        <div className="boxBtn">
                            <button onClick={() => action('Alta')} >Nou Producte</button>
                            <label htmlFor="accionsLot">Accions en lot</label>
                            <select name="accionsLot">
                                <option value="">Selecciona una acció</option>
                                <option value="">Eliminar</option>
                            </select>
                        </div>
                        <table className="taulaGestio">
                            <thead>
                                <tr>
                                    <th className="checkBoxth">
                                        <input type="checkbox" />
                                    </th>
                                    <th scope="col">Id</th>
                                    <th scope="col">Nom</th>
                                    <th scope="col">Accions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {data.map(ele=>{
                                   return(
            <tr key={ele.id}>
          <td className="checkBoxth">
              <input type="checkbox" />
          </td>
          <td>{ele.id}</td>
          <td>{ele.name}</td>
          <td>
                <button className="btn btn-primary" onClick={()=>{valoresFormulario('modificar',rol.id); modalMostrar(); }}>Edit</button>
                {"   "}
                <button className="btn btn-danger" onClick={()=>{peticionDelete(rol.id)}}>Del</button>
                </td>
          </tr>
          )
        })}
                            </tbody>
                        </table>

                    </div>
                </div>
                <div className="veureMes">
                    <a href="#">Veure Més</a>
                </div>
            </div>

        </div>
    </div>
</div>
  )
}

export default EstatsOrdreList
