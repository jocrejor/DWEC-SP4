import { useState, useEffect } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud'
import { Button, Modal } from 'react-bootstrap';
import Header from './Header';
import { useNavigate } from "react-router-dom";



const citiesSchema = Yup.object().shape({
  name: Yup.string().min(4, 'Valor mínim de 4 caracters.').max(50, 'El valor màxim és de 60 caracters').required('Valor requerit'),
 })

function City() {

    const [cities, setCities] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [tipoModal, setTipoModal]  = useState("Crear")
    const [valorsInicials, setValorsInicials] = useState({ name: ''})
    
    const { state_id, province_id } = useParams();
    console.log(state_id)

  return (
    <div>city</div>
  )
}

export default City