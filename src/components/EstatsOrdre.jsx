import React, {useState} from 'react'
import EstatsOrdreList from './EstatsOrdreList'
import EstatsOrdreAlta from './EstatsOrdreAlta';
import EstatsOrdreMod from './EstatsOrdreMod';

 function EstatsOrdre() {
    
    const [estat, setEstat] = useState('Lista');

   const canviEstat =(valor)=>{
        console.log("dins" . valor)
        setEstat(valor)
   }
  
      {switch (estat){
        case 'Lista':
            return ( <EstatsOrdreList  action={canviEstat} />)
        case 'Alta':
            return ( <EstatsOrdreAlta action={canviEstat}/>)
        case 'Modificar':
            return ( <EstatsOrdreMod action={canviEstat}/>)    
        default:
            return ( <EstatsOrdreList  action={canviEstat} />)
      }    
      
}

 }
 export default EstatsOrdre