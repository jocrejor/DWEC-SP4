import { useProvince, useEffect } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud'
import { Button, Modal } from 'react-bootstrap';
import Header from './Header';
import { useNavigate, useParams } from "react-router-dom";
 

const provinceschema = Yup.object().shape({
  name: Yup.string().min(4, 'Valor mínim de 4 caracters.').max(50, 'El valor màxim és de 60 caracters').required('Valor requerit'),
 })

 function Province() {

  const [provinces, setprovinces] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [tipoModal, setTipoModal]  = useState("Crear")
  const [valorsInicials, setValorsInicials] = useState({ name: ''})
  
  const { state_id } = useParams();
  console.log(state_id)


  const navigate = useNavigate();
  useEffect(async () => {
    const data = await getData(url, "Province")
    setprovinces(data)
  }, [])

const eliminarProvince = (id) =>{
  deleteData(url, "Province", id) 
  const newProvince = Province.filter(item => item.id != id)
  setprovinces(newProvince)
}

const modificarProvince = (valors) =>{
 setTipoModal("Modificar")
 setValorsInicials(valors);
}


const canviEstatModal = () =>{
    setShowModal(!showModal)
}

const grabar = async (values)=>{
  if(tipoModal==="Crear"){
    await postData(url,'Province', values)
  }else{
    await updateId(url,'Province',values.id,values)
    }
  const data = await getData(url, "Province")
  await setprovinces(data)
  canviEstatModal()
}

const enviarCiutat = async (value) =>{
  const data = await getData(url, "City")
  const resultat = data.filter(item => item.Province_id == value)
  console.log(resultat)
   if (resultat.length != 0){navigate("city/"+value); }
   }


  return (
    <>

    <Header title="Provincia" />
    <Button variant='success' className="m-2" onClick={()=>{canviEstatModal(); setTipoModal("Crear")}}>Alta Provincia</Button>
      <table className="table">
        <thead>
        <tr>
          <th scope="col">Id</th>
          <th scope="col">Nom</th>
          <th scope="col">Provincia</th>
          <th scope="col">Modificar</th>
          <th cope="col">Eliminar</th>
        </tr>
        </thead>
        <tbody>
        {(provinces.length == 0)?
          <tr><th>No hi han Provincies</th></tr>
        :provinces.map((valors) => {
          return (
          <tr key={valors.id}>
            <td>{valors.id}</td>
            <td>{valors.name}</td>
            <td><Button variant="success"  onClick={()=> {enviarProvincia(valors.id) }}>Provincia</Button></td>
            <td><Button variant="warning"  onClick={()=> {modificarProvince(valors);canviEstatModal(); }}>Modificar</Button></td>
            <td><Button variant="primary"  onClick={()=> {eliminarProvince(valors.id)}}>Eliminar</Button></td>

          </tr>)
        })}
        </tbody>
      </table>

      <Modal show={showModal} onHide={canviEstatModal}>
        <Modal.Header closeButton >
          <Modal.Title>{tipoModal} Provincia</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          
      <Formik
        initialValues= {(tipoModal==='Modificar'?valorsInicials: {name: '' })}
        validationSchema={provinceschema}
        onSubmit={ values => { grabar(values)} }
      >
        {({
          values,
          errors,
          touched
          /* and other goodies */
        }) => (
          <Form>
            <div>
              <label htmlFor='name'>Nom </label>
              <Field
                type="text" 
                name="name"
                placeholder="Nom de l'estat"
                autoComplete="off"

                value={values.name}
              />
              {errors.name && touched.name ? <div>{errors.name}</div> : null}
            </div>
         
            <div>
            <Button variant="secondary" onClick={canviEstatModal}>Close</Button>

              <Button variant={tipoModal==="Modificar"?"success":"info"} type="submit">{tipoModal}</Button>      
        
           
            </div>
          </Form>
        )}

      </Formik>
       </Modal.Body>
      </Modal>
     
    </>
  )
}

export default Province
