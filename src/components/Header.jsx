import React,{useContext} from 'react'

import { UserContext } from '../contextData/UserContext';

function Header(props) {
  const { title } = props;
  const { currentUser } = useContext(UserContext);

  return (
    <div>
      <h1 className="text-center py-4 fs-4 fw-bold m-0 text-white bg-title">{title}</h1>
      <p className='position-absolute top-0 end-0 me-4 mt-4 fw-bold fs-5 text-white'><i className="bi bi-person-circle pe-2"></i>{currentUser.name}</p>
    </div>
  )
}

export default Header