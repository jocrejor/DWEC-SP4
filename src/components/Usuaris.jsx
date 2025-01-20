
import React from 'react'


function Usuaris() {
 const usuariActual = useContext(currentUser)
  return (
    <div>
       <h1>Usuari</h1>
          <p>susari Actual: {usuariActual}</p>
    </div>
  )
}

export default Usuaris
