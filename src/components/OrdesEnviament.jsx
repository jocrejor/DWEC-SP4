import {useState, useEffect} from 'react'
import {url, postData, getData, deleteData, updateId}  from '../crud'
import {Formik, Form, Field} from 'formik'
import * as yup from 'yup'
import { Button, Modal } from 'react-bootstrap';

const ProducteSchema = yup.object().shape({
  client_id: yup.string().required('Valor requerit'),
  carrier_id: yup.string().required('Valor requerit'),
  prepared_by: yup.string().required('Valor requerit'),
  shipping_date: yup.date().required('Valor requerit'),
  ordershipping_status_id: yup.string().required('Valor requerit')
})

function OrdesEnviament() {
  const [orders, setOrder] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [tipoModal, setTipoModal] = useState('Crear')
  const [valorsInicials, setValorsInicials] = useState({client_id: '', carrier_id: '', prepared_by: '', shipping_date: '',ordershipping_status_id:''})
  const [clientes, setClientes] = useState([])
  const [carriers, setCarriers] = useState([])
  const [users, setUsers] = useState([])
  
  useEffect(async () => {
    const data = await getData(url,'OrderShipping')
    setOrder(data)
    const dataClient = await getData(url,'Client')
    setClientes(dataClient)
    const dataCarrier = await getData(url,'Carriers')
    setCarriers(dataCarrier)
    const dataUsers = await getData(url,'User')
    setUsers(dataUsers)
  }, [])

  const eliminarProducte = (id) => {
    deleteData(url,'Product', id)
    const newproducts = products.filter(product => product.id !== id)
    setProducts(newproducts)
  }
  
  const modificarProducte = (valors) => {
    setTipoModal('Modificar')
    console.log(valors)
    setValorsInicials(valors)
  }
  
  const canviEstatModal = () => {
      setShowModal(!showModal)
  }

  return (
    <>
    {/** Llistat Productes */}
   <div>
     <h2>Llistat Productes</h2>
     <Button variant="success" onClick={() => {canviEstatModal();setTipoModal("Crear")}}>Alta Orden</Button>
     <table>
       <tr>
         <th>ID</th>
         <th>Client</th>
         <th>Transportista</th>
         <th>Preparado</th>
         <th>Data Estimada</th>
         <th>Estat</th>
         <th>Accions</th>
       </tr>
       {orders.map((valors) => (
           <tr key={valors.id}>
             <td>{valors.id}</td>
             <td>{valors.client_id}</td>
             <td>{valors.carrier_id}</td>
             <td>{valors.prepared_by}</td>
             <td>{valors.shipping_date}</td>
             <td>{valors.ordershipping_status_id}</td>
             <td><Button variant='warning' onClick={() => {modificarProducte(valors); canviEstatModal()}}>Modificar</Button></td>
             <td><Button className='btn btn-primary' onClick={() => eliminarProducte(valors.id)}>Eliminar</Button></td>
           </tr>
       ))}
     </table>
   </div>

   <Modal show = {showModal} >
        <Modal.Header closeButton onHide={canviEstatModal}>
          <Modal.Title>{tipoModal} Ordre Enviament</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          
          <Formik
            initialValues={(tipoModal === 'Modificar' ? valorsInicials : {
              client_id: '', 
              carrier_id: '', 
              prepared_by: '', 
              shipping_date: '',
              ordershipping_status_id:''
            })}
            validationSchema={ProducteSchema}
            onSubmit={values => {
              console.log(values)
              tipoModal === "Crear"?postData(url,'OrderShipping/', values):updateId(url,"OrderShipping",values.id,values)
              canviEstatModal()
            }}
          >
          {({
              values,
              errors,
              touched,

              /* and other goodies */
          }) => (
              <Form>

                {/* NOM PRODUCTE */}
                <div>
                  <label htmlFor='client'>Cliente</label>
                  <Field as="select" name="client">
                    {clientes.map(cliente => {
                      return <option key={cliente.id} value={cliente.id}>{cliente.name}</option>
                    }) }
                  </Field>
                    {errors.client && touched.client ? <div>{errors.client}</div> : null}
                </div>

                <div>
                  <label htmlFor='carrier'>Transportista</label>
                  <Field as="select" name="carrier">
                    {carriers.map(carrier => {
                      return <option key={carrier.id} value={carrier.id}>{carrier.name}</option>
                    }) }
                  </Field>
                    {errors.carrier && touched.carrier ? <div>{errors.carrier}</div> : null}
                </div>

                <div>
                  <label htmlFor='user'>Preparado por</label>
                  <Field as="select" name="user">
                    {users.map(user => {
                      return <option key={user.id} value={user.id}>{user.name}</option>
                    }) }
                  </Field>
                    {errors.user && touched.user ? <div>{errors.user}</div> : null}
                </div>

                <div>
                  <label htmlFor='shipping_date'>Data estimada</label>
                  <Field type="date" name="shipping_date" />
                    {errors.shipping_date && touched.shipping_date ? <div>{errors.shipping_date}</div> : null}
                </div>

                  <div>
                    <Button onClick={() => canviEstatModal()} variant="secondary">Close</Button>
                    
                    <Button variant={tipoModal==='Modificar'?"success":"info"} type='submit'>{tipoModal}</Button>
                                    
                  </div>
              </Form>
            )}
          </Formik>

        </Modal.Body>
      </Modal> 
   </>
  )
}

export default OrdesEnviament
