import React from 'react'

function Header(props) {
    const {title} = props;
  return (
    <h1 className="text-center py-4 fs-4 fw-bold m-0 text-white bg-title">{title}</h1>
  )
}

export default Header