import { useState, useEffect } from 'react';
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import Header from './Header';
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
});

function Client() {
  const [clients, setClients] = useState([]);
  const [states, setStates] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [tipoModal, setTipoModal] = useState('Modificar');
  const [valorsInicials, setValorsInicials] = useState({
    name: '', email: '', phone: '', address: '', nif: '', state_id: '', province_id: '', city_id: '', cp: '',
  });
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const clientsData = await getData(url, 'Client');
      setClients(clientsData);

      const statesData = await getData(url, 'State');
      setStates(statesData);

      const provincesData = await getData(url, 'Province');
      setProvinces(provincesData);

      const citiesData = await getData(url, 'City');
      setCities(citiesData);
    };
    fetchData();
  }, []);

  const eliminarClient = (id) => {
    deleteData(url, 'Client', id);
    const newClients = clients.filter(client => client.id !== id);
    setClients(newClients);
  };

  const modificarClient = (valors) => {
    setTipoModal('Modificar');
    setValorsInicials(valors);
    setShowModal(true);
  };

  const canviEstatModal = () => {
    setShowModal(!showModal);
  };

  const handleViewClient = (client) => {
    setSelectedClient(client);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedClient(null);
  };

  const handleStateChange = (stateId, setFieldValue) => {
    const stateIdInt = parseInt(stateId);
    const filteredProvinces = provinces.filter(province => parseInt(province.state_id) === stateIdInt);

    setFieldValue('state_id', stateId);
    setFieldValue('province_id', '');
    setFieldValue('city_id', '');
    setProvinces(filteredProvinces);
    setCities([]);
  };

  const handleProvinceChange = (provinceId, setFieldValue) => {
    const provinceIdInt = parseInt(provinceId);
    const filteredCities = cities.filter(city => parseInt(city.province_id) === provinceIdInt);

    setFieldValue('province_id', provinceId);
    setFieldValue('city_id', '');
    setCities(filteredCities);
  };

  const handleSubmit = async (values) => {
    if (tipoModal === 'Crear') {
      await postData(url, 'Client', values);
    } else {
      await updateId(url, 'Client', values.id, values);
    }
    setShowModal(false);
  };

  return (
    <>
      <div>
        <Header title="Clients"/>
        <Button variant="success" onClick={() => { setTipoModal('Crear'); setShowModal(true); }}>
          Alta Client
        </Button>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Telèfon</th>
              <th>Adreça</th>
              <th>NIF</th>
              <th>Visualitzar</th>
              <th>Modificar</th>
              <th>Eliminar</th>
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
                <td>
                  <Button variant="outline-primary" onClick={() => handleViewClient(valors)}>
                    <i className="bi bi-eye"></i>
                  </Button>
                </td>
                <td>
                  <Button variant="outline-warning" onClick={() => modificarClient(valors)}>
                    <i className="bi bi-pencil-square"></i>
                  </Button>
                </td>
                <td>
                  <Button variant="outline-danger" onClick={() => eliminarClient(valors.id)}>
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showViewModal} onHide={closeViewModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detalls del Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedClient && (
            <div>
              <p><strong>Nom:</strong> {selectedClient.name}</p>
              <p><strong>Email:</strong> {selectedClient.email}</p>
              <p><strong>Telèfon:</strong> {selectedClient.phone}</p>
              <p><strong>Adreça:</strong> {selectedClient.address}</p>
              <p><strong>NIF:</strong> {selectedClient.nif}</p>
              <p><strong>Estat:</strong> {states.find(state => state.id === selectedClient.state_id)?.name || 'No disponible'}</p>
              <p><strong>Província:</strong> {provinces.find(province => province.id === selectedClient.province_id)?.name || 'No disponible'}</p>
              <p><strong>Ciutat:</strong> {cities.find(city => city.id === selectedClient.city_id)?.name || 'No disponible'}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeViewModal}>
            Tancar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModal} onHide={canviEstatModal}>
        <Modal.Header closeButton>
          <Modal.Title>{tipoModal === 'Crear' ? 'Alta Client' : 'Modificar Client'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={valorsInicials}
            validationSchema={ClientSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              setFieldValue,
            }) => (
              <Form>
                <div>
                  <label htmlFor="name">Nom</label>
                  <Field name="name" />
                  {errors.name && touched.name && <div>{errors.name}</div>}
                </div>
                <div>
                  <label htmlFor="email">Email</label>
                  <Field name="email" type="email" />
                  {errors.email && touched.email && <div>{errors.email}</div>}
                </div>
                <div>
                  <label htmlFor="phone">Telèfon</label>
                  <Field name="phone" />
                  {errors.phone && touched.phone && <div>{errors.phone}</div>}
                </div>
                <div>
                  <label htmlFor="address">Adreça</label>
                  <Field name="address" />
                  {errors.address && touched.address && <div>{errors.address}</div>}
                </div>
                <div>
                  <label htmlFor="nif">NIF</label>
                  <Field name="nif" />
                  {errors.nif && touched.nif && <div>{errors.nif}</div>}
                </div>
                <div>
                  <label htmlFor="state_id">Estat</label>
                  <Field as="select" name="state_id" onChange={e => handleStateChange(e.target.value, setFieldValue)}>
                    <option value="">Selecciona un estat</option>
                    {states.map(state => (
                      <option key={state.id} value={state.id}>{state.name}</option>
                    ))}
                  </Field>
                  {errors.state_id && touched.state_id && <div>{errors.state_id}</div>}
                </div>
                <div>
                  <label htmlFor="province_id">Província</label>
                  <Field as="select" name="province_id" onChange={e => handleProvinceChange(e.target.value, setFieldValue)}>
                    <option value="">Selecciona una província</option>
                    {provinces.map(province => (
                      <option key={province.id} value={province.id}>{province.name}</option>
                    ))}
                  </Field>
                  {errors.province_id && touched.province_id && <div>{errors.province_id}</div>}
                </div>
                <div>
                  <label htmlFor="city_id">Ciutat</label>
                  <Field as="select" name="city_id">
                    <option value="">Selecciona una ciutat</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                  </Field>
                  {errors.city_id && touched.city_id && <div>{errors.city_id}</div>}
                </div>
                <div>
                  <label htmlFor="cp">Codi Postal</label>
                  <Field name="cp" />
                  {errors.cp && touched.cp && <div>{errors.cp}</div>}
                </div>
                <Button type="submit">{tipoModal === 'Crear' ? 'Crear' : 'Modificar'}</Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Client;
