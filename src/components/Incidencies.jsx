import { useState, useEffect } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud'
import { Button, Modal } from 'react-bootstrap';
import { Header } from './Header'

const IncidenciaSchema = Yup.object().shape({
  date_creation: Yup.date().required('Data no vàlida'),
  description: Yup.string().min(4, 'Valor mínim de 4 caracters.').max(200, 'El valor màxim és de 60 caracters'),
})

function Incidencies() {

    const [incidents, setIncident]    = useState([])
    const [showModal, setShowModal]   = useState(false)
    const [tipoModal, setTipoModal]   = useState("Crear")
    const [valorsInicials, setValorsInicials] = useState({ date_creation: '', description: '', name: ''})


    useEffect(() => {      
        (async () => {
          const dataIncident = await getData(url, "Incident");
          setIncident(dataIncident);          
        })();
      }, []);

const eliminarIncident = (id) =>{
  deleteData(url, "Incident", id) 
  const newIncident = incidents.filter(item => item.id != id)
  setIncident(newIncident)
}

const modificarIncident = (valors) =>{
 setTipoModal("Modificar")
 setValorsInicials(valors);
}


const canviEstatModal = () =>{
    setShowModal(!showModal)
}

  return (
    <>
    <Header title="Incidències"/>
    <Button variant='success' onClick={()=>{canviEstatModal(); setTipoModal("Crear")}}>Llistat ordres de recepció</Button>
      <table>
        <tr>
          <th>Data de creació</th>
          <th>Descripció</th>
          <th>Producte</th>
          <th>Unitats demanades</th>
          <th>Unitats rebudes</th>
          <th>Estat</th>
          <th>Modificar</th>
          <th>Eliminar</th>
        </tr>
        {(incidents.length == 0)?
          <div>No hi han articles</div>
        :incidents.map((valors) => {
          return (
          <tr key={valors.id}>
            <td></td>
            <td>{valors.description}</td>
            <td>{valors.name}</td>
            <td></td>
            <td></td>
            <td></td>
            <td><Button variant="warning"  onClick={()=> {modificarIncident(valors);canviEstatModal(); }}>Modificar</Button></td>
            <td><Button variant="primary"  onClick={()=> {eliminarIncident(valors.id)}}>Eliminar</Button></td>
          </tr>)
        })}
      </table>

      <Modal show={showModal} onHide={canviEstatModal}>
        <Modal.Header closeButton >
          <Modal.Title>{tipoModal} Producte</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          
      <Formik
        initialValues= {(tipoModal==='Modificar'?valorsInicials: {name: '', description: '' })}
        validationSchema={IncidenciaSchema}
        onSubmit={values => {
          console.log(values)
          tipoModal==="Crear"?postData(url,"Product", values):updateId(url,"Product",values.id,values)  
          canviEstatModal()         
        }}
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
                placeholder="Nom del producte"
                autoComplete="off"

                value={values.name}
              />
              {errors.name && touched.name ? <div>{errors.name}</div> : null}
            </div>
            {/*Em senc atacat*/}
            <div>
              <label htmlFor='description'>Descripció </label>
              <Field
                as='textarea'
                type="text"
                name="description"
                placeholder="Descripció del producte"
                autoComplete="off"

                value={values.description}
              />
              {errors.description && touched.description ? <div>{errors.description}</div> : null}
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

export default Incidencies

