
import {useContext} from 'react'
import { currentUserContext } from '../contextData/Context'

function Usuaris() {
 const usuariActual = useContext(currentUserContext)
  return (
    <div>
       <h1>Usuari</h1>
          <p>susari Actual: {usuariActual}</p>
    </div>
  )
}

export default Usuaris
