import { useState, useEffect } from 'react'
import { url, postData, getData, deleteData, updateId } from './crud'
import { Formik, Form, Field } from 'formik'
import * as yup from 'yup'

import { Button, Modal } from 'react-bootstrap';

const ClientSchema = yup.object().shape({
  name: yup.string().min(4, 'Valor mínim de 4 caracters').max(50, 'Valor màxim de 50 caracters').required('Valor Requerit.'),
  email: yup.string().email('Email no vàlid').required('Valor Requerit.'),
  phone: yup.string().min(10, 'El número de telèfon ha de tindre almenys 10 digits').required('Valor Requerit.'),
  address: yup.string().min(10, 'L’adreça ha de tindre almenys 10 caracters').required('Valor Requerit.'),
  nif: yup.string().required('Valor Requerit.'),
  state_id: yup.number().required('Valor Requerit.'),
  province: yup.string().required('Valor Requerit.'),
  city: yup.string().required('Valor Requerit.'),
  cp: yup.string().matches(/^\d{5}$/, 'Codi postal no vàlid').required('Valor Requerit.'),
})

function Client() {
  const [clients, setClients] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [tipoModal, setTipoModal] = useState('Crear')
  const [valorsInicials, setValorsInicials] = useState({
    name: '', email: '', phone: '', address: '', nif: '', state_id: '', province: '', city: '', cp: '',
  })

  const [clientToView, setClientToView] = useState(null);  
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await getData(url, 'Client') 
      setClients(data)
    }
    fetchData()
  }, [])

  const eliminarClient = (id) => {
    deleteData(url, 'Client', id) 
    const newClients = clients.filter(client => client.id !== id) 
    setClients(newClients)
  }

  const modificarClient = (valors) => {
    setTipoModal('Modificar')
    setValorsInicials(valors)
    setShowModal(true)  
  }

  const canviEstatModal = () => {
    setShowModal(!showModal)
  }

  const visualizarClient = (client) => {
    setClientToView(client);
    setTipoModal('Visualitzar')  
    setShowModal(true); 
  }

  return (
    <>
      <div>
        <h2>Llistat Clients</h2>
        <Button variant="success" onClick={() => { canviEstatModal(); setTipoModal("Crear") }}>Alta Client</Button>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Telèfon</th>
              <th>Adreça</th>
              <th>NIF</th>
              <th>Eliminar</th>
              <th>Modificar</th>
              <th>Visualitzar</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((valors) => (
              <tr key={valors.id}>
                <td>{valors.id}</td>
                <td>{valors.name}</td>
                <td>{valors.email}</td>
                <td>{valors.phone}</td>
                <td>{valors.address}</td>
                <td>{valors.nif}</td>
                <td><Button className='btn btn-danger' onClick={() => eliminarClient(valors.id)}>Eliminar</Button></td>
                <td><Button variant='warning' onClick={() => modificarClient(valors)}>Modificar</Button></td>
                <td><Button variant='info' onClick={() => visualizarClient(valors)}>Visualitzar</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={canviEstatModal}>
        <Modal.Header closeButton>
          <Modal.Title>{tipoModal === 'Modificar' ? 'Modificar Client' : tipoModal === 'Crear' ? 'Alta Client' : 'Visualitzar Client'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {tipoModal === 'Visualitzar' ? (
            clientToView ? (
              <>
                <p><strong>Nom:</strong> {clientToView.name}</p>
                <p><strong>Email:</strong> {clientToView.email}</p>
                <p><strong>Telèfon:</strong> {clientToView.phone}</p>
                <p><strong>Adreça:</strong> {clientToView.address}</p>
                <p><strong>NIF:</strong> {clientToView.nif}</p>
                <p><strong>Estat:</strong> {clientToView.state_id}</p>
                <p><strong>Província:</strong> {clientToView.province}</p>
                <p><strong>Ciutat:</strong> {clientToView.city}</p>
                <p><strong>Codi Postal:</strong> {clientToView.cp}</p>
              </>
            ) : (
              <p>No s'ha seleccionat cap client per visualitzar.</p>
            )
          ) : (
            <Formik
              initialValues={tipoModal === 'Modificar' ? valorsInicials : {
                name: '',
                email: '',
                phone: '',
                address: '',
                nif: '',
                state_id: '',
                province: '',
                city: '',
                cp: '',
              }}
              validationSchema={ClientSchema}
              onSubmit={values => {
                if (tipoModal === 'Crear') {
                  postData(url, 'Client', values)  
                } else if (tipoModal === 'Modificar') {
                  updateId(url, 'Client', values.id, values) 
                }
                setShowModal(false);
              }}
            >
              {({
                values,
                errors,
                touched,
              }) => (
                <Form>
                  <div>
                    <label htmlFor='name'>Nom del client</label>
                    <Field
                      type="text"
                      name="name"
                      placeholder="Nom del client"
                      autoComplete="off"
                      value={values.name}
                    />
                    {errors.name && touched.name ? <div>{errors.name}</div> : null}
                  </div>

                  <div>
                    <label htmlFor='email'>Email del client</label>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Email del client"
                      autoComplete="off"
                      value={values.email}
                    />
                    {errors.email && touched.email ? <div>{errors.email}</div> : null}
                  </div>

                  <div>
                    <label htmlFor='phone'>Telèfon del client</label>
                    <Field
                      type="text"
                      name="phone"
                      placeholder="Telèfon del client"
                      autoComplete="off"
                      value={values.phone}
                    />
                    {errors.phone && touched.phone ? <div>{errors.phone}</div> : null}
                  </div>

                  <div>
                    <label htmlFor='address'>Adreça</label>
                    <Field
                      type="text"
                      name="address"
                      placeholder="Adreça"
                      autoComplete="off"
                      value={values.address}
                    />
                    {errors.address && touched.address ? <div>{errors.address}</div> : null}
                  </div>

                  <div>
                    <label htmlFor='nif'>NIF</label>
                    <Field
                      type="text"
                      name="nif"
                      placeholder="NIF"
                      autoComplete="off"
                      value={values.nif}
                    />
                    {errors.nif && touched.nif ? <div>{errors.nif}</div> : null}
                  </div>

                  <div>
                    <label htmlFor='state_id'>Estat</label>
                    <Field
                      type="number"
                      name="state_id"
                      placeholder="ID de l'estat"
                      autoComplete="off"
                      value={values.state_id}
                    />
                    {errors.state_id && touched.state_id ? <div>{errors.state_id}</div> : null}
                  </div>

                  <div>
                    <label htmlFor='province'>Província</label>
                    <Field
                      type="text"
                      name="province"
                      placeholder="Província"
                      autoComplete="off"
                      value={values.province}
                    />
                    {errors.province && touched.province ? <div>{errors.province}</div> : null}
                  </div>

                  <div>
                    <label htmlFor='city'>Ciutat</label>
                    <Field
                      type="text"
                      name="city"
                      placeholder="Ciutat"
                      autoComplete="off"
                      value={values.city}
                    />
                    {errors.city && touched.city ? <div>{errors.city}</div> : null}
                  </div>

                  <div>
                    <label htmlFor='cp'>Codi Postal</label>
                    <Field
                      type="text"
                      name="cp"
                      placeholder="Codi Postal"
                      autoComplete="off"
                      value={values.cp}
                    />
                    {errors.cp && touched.cp ? <div>{errors.cp}</div> : null}
                  </div>

                  <div>
                    <Button onClick={() => setShowModal(false)} variant="secondary">Tancar</Button>
                    <Button variant={tipoModal === "Crear" ? "success" : "warning"} type='submit'>{tipoModal}</Button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={canviEstatModal}>
            Tancar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Client