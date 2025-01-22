import { useState, useEffect } from 'react'
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud'
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
  province_id: yup.number().required('Valor Requerit.'),
  city_id: yup.number().required('Valor Requerit.'),
  cp: yup.string().matches(/^\d{5}$/, 'Codi postal no vàlid').required('Valor Requerit.'),
})

function Client() {
  const [clients, setClients] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [tipoModal, setTipoModal] = useState('Crear')
  const [valorsInicials, setValorsInicials] = useState({
    name: '', email: '', phone: '', address: '', nif: '', state_id: '', province_id: '', city_id: '', cp: '',
  })

  const [clientToView, setClientToView] = useState(null);

  const [states, setStates] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const clientsData = await getData(url, 'Client');
      setClients(clientsData);

      const statesData = await getData(url, 'State');
      setStates(statesData);

      if (statesData.length > 0) {
        const provincesData = await getData(url, 'Province?state_id=' + statesData[0].id);
        setProvinces(provincesData);
      }

      if (statesData.length > 0 && provinces.length > 0) {
        const citiesData = await getData(url, 'City?province_id=' + provinces[0].id);
        setCities(citiesData);
      }
    };
    
    fetchData();
  }, []);

  const eliminarClient = (id) => {
    deleteData(url, 'Client', id);
    const newClients = clients.filter(client => client.id !== id);
    setClients(newClients);
  }

  const modificarClient = (valors) => {
    setTipoModal('Modificar');
    setValorsInicials(valors);
    setShowModal(true);
  }

  const canviEstatModal = () => {
    setShowModal(!showModal);
  }

  const visualizarClient = (client) => {
    setClientToView(client);
    setTipoModal('Visualitzar');
    setShowModal(true);
  }

  const handleStateChange = async (e) => {
    const selectedStateId = e.target.value;
    setSelectedState(selectedStateId);

    const provincesData = await getData(url, 'Province?state_id=' + selectedStateId);
    setProvinces(provincesData);

    setSelectedProvince('');
    setCities([]);
  };

  const handleProvinceChange = async (e) => {
    const selectedProvinceId = e.target.value;
    setSelectedProvince(selectedProvinceId);

    const citiesData = await getData(url, 'City?province_id=' + selectedProvinceId);
    setCities(citiesData);
  };

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
                province_id: '',
                city_id: '',
                cp: '',
              }}
              validationSchema={ClientSchema}
              onSubmit={async (values) => {
                if (tipoModal === 'Crear') {
                  // Hacer la llamada a la API para crear el cliente
                  const newClient = await postData(url, 'Client', values);

                  // Si la creación es exitosa, añadir el nuevo cliente a la lista
                  setClients([...clients, newClient]);
                } else if (tipoModal === 'Modificar') {
                  // Llamada a la API para modificar el cliente
                  await updateId(url, 'Client', values.id, values);
                }

                // Cerrar el modal después de guardar
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
                    <Field as="select" name="state_id" onChange={handleStateChange} value={selectedState}>
                      <option value="">Seleccionar Estat</option>
                      {states.map(state => (
                        <option key={state.id} value={state.id}>{state.name}</option>
                      ))}
                    </Field>
                    {errors.state_id && touched.state_id ? <div>{errors.state_id}</div> : null}
                  </div>

                  <div>
                    <label htmlFor='province_id'>Província</label>
                    <Field as="select" name="province_id" onChange={handleProvinceChange} value={selectedProvince}>
                      <option value="">Seleccionar Província</option>
                      {provinces.map(province => (
                        <option key={province.id} value={province.id}>{province.name}</option>
                      ))}
                    </Field>
                    {errors.province_id && touched.province_id ? <div>{errors.province_id}</div> : null}
                  </div>

                  <div>
                    <label htmlFor='city_id'>Ciutat</label>
                    <Field as="select" name="city_id" value={values.city_id}>
                      <option value="">Seleccionar Ciutat</option>
                      {cities.map(city => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                      ))}
                    </Field>
                    {errors.city_id && touched.city_id ? <div>{errors.city_id}</div> : null}
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

export default Client;
