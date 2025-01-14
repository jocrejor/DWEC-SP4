import { useState, useEffect } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud'
import { Button, Modal } from 'react-bootstrap';

const ProducteSchema = Yup.object().shape({
  name: Yup.string().min(4, 'Valor mínim de 4 caracters.').max(50, 'El valor màxim és de 60 caracters').required('Valor requerit'),
  description: Yup.string().min(4, 'Valor mínim de 4 caracters.').max(200, 'El valor màxim és de 60 caracters'),
  volume: Yup.number().positive('El valor ha de ser positiu').required('Valor requerit'),
  weight: Yup.number().positive('El valor ha de ser positiu').required('Valor requerit'),
  lotorserial: Yup.string().matches(/(Lot|Serial|Non)/).required('Valor requerit'),
  sku: Yup.string().matches(/^[A-Z0-9]{5,10}$/, 'El SKU ha de tindre alfanumèrics en majúscules i números (5 i 10) ').required('Valor requerit'),
  image_url: Yup.string().url("La url ha de ser correcta")
})

function Productes() {

  const [products, setProducts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [tipoModal, setTipoModal]  = useState("Crear")
  const [valorsInicials, setValorsInicials] = useState({ name: '', description: '', volume: 0, weight: 0, lotorserial: 'Non', sku: '', image_url: '' })
  


  useEffect(async () => {
    const data = await getData(url, "Product")
    setProducts(data)
  }, [])

  const eliminarProducte = (id) =>{
    deleteData(url, "Product", id) 
    const newproducts = products.filter(item => item.id != id)
    setProducts(newproducts)
  }

  const modificarProducte = (valors) =>{
  setTipoModal("Modificar")
  setValorsInicials(valors);
  }


  const canviEstatModal = () =>{
      setShowModal(!showModal)
  }

  function Lots() {
    return (
      <div>
        <h1>sdkfsdfkjskdf</h1>
      </div>
    )
  }
}

export default Lots
