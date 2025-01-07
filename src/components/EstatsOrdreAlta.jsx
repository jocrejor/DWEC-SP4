import React from 'react'

function EstatsOrdreAlta({action}) {
  return (
    <>
    <div>EstatsOrdreAlta</div>
    <button onClick={() => action('Lista')}>Tormar al llistat</button>
    </>
  )
}

export default EstatsOrdreAlta