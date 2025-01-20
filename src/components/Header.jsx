import React from 'react'

function Header(props) {

  const { title } = props;
  return (
    <div>
      <h1 className="text-center py-4 fs-4 fw-bold m-0 text-white bg-title">{title}</h1>
      <p className='position-absolute top-0 end-0 me-4 mt-4 fw-bold fs-5 text-white'><i class="bi bi-person-circle pe-2"></i>Usuari Admin</p>
    </div>

  )
}

export default Header