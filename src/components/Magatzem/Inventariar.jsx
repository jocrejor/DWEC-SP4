import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

function Inventariar() {
    const {id} = useParams();
    console.log(id)
    useEffect(()=>{
        console.log("ID: ", id)
    }, [id])
    return (
    <div>
      <h1>{id}</h1>

      
    </div>
  )
}

export default Inventariar
/*className='text-decoration-none text-orange cursor-pointer'*/