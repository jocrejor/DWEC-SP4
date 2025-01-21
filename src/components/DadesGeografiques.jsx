import { useState, useEffect } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud'
import { Button, Modal } from 'react-bootstrap';
import Header from './Header';
import { useNavigate, Link, Outlet } from "react-router-dom";
 

const StateSchema = Yup.object().shape({
  name: Yup.string().min(4, 'Valor mínim de 4 caracters.').max(50, 'El valor màxim és de 60 caracters').required('Valor requerit'),
 })

 function DadesGeografiques() {

  const [states, setStates] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [tipoModal, setTipoModal]  = useState("Crear")
  const [valorsInicials, setValorsInicials] = useState({ name: ''})
  

  const navigate = useNavigate();
  useEffect(async () => {
    const data = await getData(url, "State")
    setStates(data)
  }, [])

const eliminarState = (id) =>{
  deleteData(url, "State", id) 
  const newState = state.filter(item => item.id != id)
  setStates(newState)
}

const modificarState = (valors) =>{
 setTipoModal("Modificar")
 setValorsInicials(valors);
}


const canviEstatModal = () =>{
    setShowModal(!showModal)
}

const grabar = async (values)=>{
  if(tipoModal==="Crear"){
    await postData(url,'State', values)
  }else{
    await updateId(url,'State',values.id,values)
  }
  const data = await getData(url, "State")
  setStates(data)
  canviEstatModal()
}

const enviarProvincia = async (value) =>{
  const data = await getData(url, "Province")
  const resultat = data.filter(item => item.state_id == value)
   if (resultat.length != 0){navigate("provinces/"+ value); }
   }


  return (
    <>

    <Header title="Països" />
    <Button variant='success' className="m-2" onClick={()=>{canviEstatModal(); setTipoModal("Crear")}}>Alta País</Button>
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
        {(states.length == 0)?
          <tr><th>No hi han països</th></tr>
        :states.map((valors) => {
          return (
          <tr key={valors.id}>
            <td>{valors.id}</td>
            <td>{valors.name}</td>
            <td><Button variant="success"> <Link to={"province/" + valors.id}>Provincia</Link><Outlet /></Button></td>
            <td><Button variant="warning"  onClick={()=> {modificarState(valors);canviEstatModal(); }}>Modificar</Button></td>
            <td><Button variant="primary"  onClick={()=> {eliminarState(valors.id)}}>Eliminar</Button></td>

          </tr>)
        })}
         
        </tbody>
      </table>

      <Modal show={showModal} onHide={canviEstatModal}>
        <Modal.Header closeButton >
          <Modal.Title>{tipoModal} Pais</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          
      <Formik
        initialValues= {(tipoModal==='Modificar'?valorsInicials: {name: '' })}
        validationSchema={StateSchema}
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

export default DadesGeografiques
