import { useState, useEffect } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud'
import { Button, Modal} from 'react-bootstrap';
import Table from 'react-bootstrap/Table';

const ProveidorSchema = Yup.object().shape({
  name: Yup.string().min(4, 'Valor mínim de 4 caracters.').max(50, 'El valor màxim és de 60 caracters').required('Valor requerit'),
  address: Yup.string().required('Valor requerit'),
  nif: Yup.string().required('Valor requerit'),
  phone: Yup.string().required('Valor requerit'),
  email: Yup.string().required('Valor requerit'),
  state_name: Yup.string().required('Valor requerit'),
  province: Yup.string().required('Valor requerit'),
  city: Yup.string().required('Valor requerit'),
  cp: Yup.string().required('Valor requerit')
})


function Proveidors() {

  const [proveidors, setProveidors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tipoModal, setTipoModal] = useState('Crear');
  const [valorsInicials, setValorsInicials] = useState({name: '', address: '', nif: '', phone: '', email: '', state_name: '', province: '', city: '', cp: ''});

  useEffect(() => {
    getData(url, 'Supplier').then(data => {
      setProveidors(data);
    })
  }, [])

  const canviEstatModal = () => {
    setShowModal(!showModal);
  }

  return (

    <>  

    <div>
      <h1 className='text-center'>Proveidors</h1>
      <Button className='w-100 py-2' variant='success' onClick={()=>{canviEstatModal(); setTipoModal("Crear")}}>Alta Producte</Button>
      <Table>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Address</th>
          <th>Nif</th>
          <th>Phone</th>
          <th>Email</th>
          <th>State Name</th>
          <th>Province</th>
          <th>City</th>
          <th>Cp</th>
          <th>Actions</th>
        </tr>
      </Table>
    </div>

    </>

  )
}

export default Proveidors
