import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud';
import { Button, Modal } from 'react-bootstrap';

import Header from '../components/Header';
import Filtres from '../components/Filtres';

const carrierschema = Yup.object().shape({
  name: Yup.string().min(3, 'Valor mínim de 4 caracters.').max(50, 'El valor màxim és de 50 caracters').required('Valor requerit'),
  address: Yup.string().min(10, 'Valor mínim de 10 caracters.').max(100, 'El valor màxim és de 100 caracters').required('Valor requerit'),
  nif: Yup.string().matches(/^\w{9}$/, 'El NIF ha de tenir 9 caracters').required('Valor requerit'),
  phone: Yup.string().matches(/^\+\d{1,3}\s\d{9}$/, 'El telèfon ha de ser correcte (+34 911234567)').required('Valor requerit'),
  email: Yup.string().email('Email no vàlid').required('Valor requerit'),
  state_id: Yup.number().positive('El valor ha de ser positiu').required('Valor requerit'),
  province: Yup.string().required('Valor requerit'),
  city: Yup.string().min(3, 'Valor mínim de 3 caracters').max(50, 'El valor màxim és de 50 caracters').required('Valor requerit'),
  cp: Yup.string().matches(/^\d{5}$/, 'El codi postal ha de tenir 5 dígits').required('Valor requerit'),
});

function Transportistes() {
  const [carriers, setCarriers] = useState([]);
  const [pais, setPais] = useState([]);
  const [provincia, setProvince] = useState([]);
  const [ciutat, setCity] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [tipoModal, setTipoModal] = useState('Crear');
  const [valorsInicials, setValorsInicials] = useState({
    name: '',
    address: '',
    nif: '',
    phone: '',
    email: '',
    state_id: 0,
    province: '',
    city: '',
    cp: '',
  });

  useEffect(() => {
    async function fetchData() {
      const data = await getData(url, 'Carriers');
      const pais = await getData(url, 'State');
      const provincia = await getData(url, 'Province');
      const ciutat = await getData(url, 'City');
      setPais(pais);
      setProvince(provincia);
      setCity(ciutat);
      setCarriers(data);
    }
    fetchData();
  }, []);

  const deleteCarriers = (id) => {
    deleteData(url, 'Carriers', id);
    const newCarriers = carriers.filter((item) => item.id !== id);
    setCarriers(newCarriers);
  };

  const modCarriers = (valors) => {
    setTipoModal('Modificar');
    setValorsInicials(valors);
  };

  const viewCarrier = (valors) => {
    setValorsInicials(valors);
    setShowViewModal(true);
  };

  const canviEstatModal = () => {
    setShowModal(!showModal);
  };

  const gravar = async (values) => {
    if (tipoModal === 'Crear') {
      await postData(url, 'Carriers', values);
    } else {
      await updateId(url, 'Carriers', values.id, values);
    }
    const info = await getData(url, 'Carriers');
    await setCarriers(info);
    canviEstatModal();
  };

  return (
    <>
      <Header title="Llistat transportistes" />
      <Filtres />
      <Button
        variant="success"
        className="btn text-white"
        onClick={() => {
          canviEstatModal();
          setTipoModal('Crear');
        }}
      >
        Alta Transportistes
      </Button>
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Adreça</th>
            <th>NIF</th>
            <th>Telèfon</th>
            <th>Email</th>
            <th>Visualitzar</th>
            <th>Modificar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {carriers.length === 0 ? (
            <tr>
              <td colSpan="13">No hi han transportistes</td>
            </tr>
          ) : (
            carriers.map((valors) => (
              <tr key={valors.id}>
                <td>{valors.id}</td>
                <td>{valors.name}</td>
                <td>{valors.address}</td>
                <td>{valors.nif}</td>
                <td>{valors.phone}</td>
                <td>{valors.email}</td>
                <td>
                  <Button
                    variant="outline-secondary"
                    onClick={() => {
                      viewCarrier(valors);
                    }}
                  >
                    <i className="bi bi-eye p-2"></i>
                  </Button>
                </td>
                <td>
                  <Button
                    variant="outline-success"
                    onClick={() => {
                      modCarriers(valors);
                      canviEstatModal();
                    }}
                  >
                    <i className="bi bi-pencil-square p-2"></i>
                  </Button>
                </td>
                <td>
                  <Button
                    variant="outline-danger"
                    onClick={() => {
                      deleteCarriers(valors.id);
                    }}
                  >
                    <i className='bi bi-trash p-2'></i>
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal Visualitzar */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Visualitzar Transportista</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p><b>Nom:</b> {valorsInicials.name}</p>
            <p><b>Adreça:</b> {valorsInicials.address}</p>
            <p><b>NIF:</b> {valorsInicials.nif}</p>
            <p><b>Telèfon:</b> {valorsInicials.phone}</p>
            <p><b>Email:</b> {valorsInicials.email}</p>
            <p><b>Estat:</b> {valorsInicials.state_id}</p>
            <p><b>Província:</b> {valorsInicials.province}</p>
            <p><b>Ciutat:</b> {valorsInicials.city}</p>
            <p><b>Codi Postal:</b> {valorsInicials.cp}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Tancar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Crear/Modificar */}
      <Modal show={showModal} onHide={canviEstatModal}>
        <Modal.Header closeButton>
          <Modal.Title>{tipoModal} transportista</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={
              tipoModal === 'Modificar'
                ? valorsInicials
                : {
                  name: '',
                  address: '',
                  nif: '',
                  phone: '',
                  email: '',
                  state_id: 0,
                  province: '',
                  city: '',
                  cp: '',
                }
            }
            validationSchema={carrierschema}
            onSubmit={(values) => {
              gravar(values);
            }}
          >
            {({ values, errors, touched }) => (
              <Form>
                <div className="form-group">
                  <label htmlFor="name">Nom</label>
                  <Field
                    id="name"
                    name="name"
                    className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''
                      }`}
                  />
                  {touched.name && errors.name ? (
                    <div className="invalid-feedback">{errors.name}</div>
                  ) : null}
                </div>
                <div className="form-group">
                  <label htmlFor="address">Adreça</label>
                  <Field
                    id="address"
                    name="address"
                    className={`form-control ${touched.address && errors.address ? 'is-invalid' : ''
                      }`}
                  />
                  {touched.address && errors.address ? (
                    <div className="invalid-feedback">{errors.address}</div>
                  ) : null}
                </div>
                <div className="form-group">
                  <label htmlFor="nif">NIF</label>
                  <Field
                    id="nif"
                    name="nif"
                    className={`form-control ${touched.nif && errors.nif ? 'is-invalid' : ''
                      }`}
                  />
                  {touched.nif && errors.nif ? (
                    <div className="invalid-feedback">{errors.nif}</div>
                  ) : null}
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Telèfon</label>
                  <Field
                    id="phone"
                    name="phone"
                    className={`form-control ${touched.phone && errors.phone ? 'is-invalid' : ''
                      }`}
                  />
                  {touched.phone && errors.phone ? (
                    <div className="invalid-feedback">{errors.phone}</div>
                  ) : null}
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''
                      }`}
                  />
                  {touched.email && errors.email ? (
                    <div className="invalid-feedback">{errors.email}</div>
                  ) : null}
                </div>

                {/* A partir d'aci */}
                <div className="form-group">
                  <label htmlFor="state_id">Estat</label>
                  <Field
                    as="select"
                    name="state_id"
                    className={`form-control ${touched.state_id && errors.state_id ? 'is-invalid' : ''
                      }`}
                  >
                    <option value="">Selecciona un estat</option>
                    {pais.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </Field>
                  {touched.state_id && errors.state_id ? (
                    <div className="invalid-feedback">{errors.state_id}</div>
                  ) : null}
                </div>
                <div className="form-group">
                  <label htmlFor="province">Província</label>
                  {values.state_id === '194' ? ( // Si es España, mostramos un select
                    <>
                      <Field
                        as="select"
                        id="province"
                        name="province"
                        className={`form-control ${
                          touched.province && errors.province ? 'is-invalid' : ''
                        }`}
                        value={values.province.name} // Aseguramos que el valor esté sincronizado con el estado del formulario
                      >
                        <option value="">Selecciona una província</option>
                        {provincia.length > 0 ? (
                          provincia.map((prov) => (
                            <option key={prov.id} value={prov.id}> {/* Usa 'id' como valor */}
                              {prov.name}
                            </option>
                          ))
                        ) : (
                          <option value="">No hay provincias disponibles</option>
                        )}
                      </Field>
                      {touched.province && errors.province && (
                        <div className="invalid-feedback">{errors.province}</div>
                      )}
                    </>
                  ) : (
                    // Si no es España, mostramos un campo de texto
                    <>
                      <Field
                        type="text"
                        id="province"
                        name="province"
                        placeholder="Escribe la provincia"
                        className={`form-control ${
                          touched.province && errors.province ? 'is-invalid' : ''
                        }`}
                      />
                      {touched.province && errors.province && (
                        <div className="invalid-feedback">{errors.province}</div>
                      )}
                    </>
                  )}
                </div>


                {/* Fins ací*/}
                <div className="form-group">
                  <label htmlFor="city">Ciutat</label>
                  <Field
                    id="city"
                    name="city"
                    className={`form-control ${touched.city && errors.city ? 'is-invalid' : ''
                      }`}
                  />
                  {touched.city && errors.city ? (
                    <div className="invalid-feedback">{errors.city}</div>
                  ) : null}
                </div>
                <div className="form-group">
                  <label htmlFor="cp">Codi Postal</label>
                  <Field
                    id="cp"
                    name="cp"
                    className={`form-control ${touched.cp && errors.cp ? 'is-invalid' : ''
                      }`}
                  />
                  {touched.cp && errors.cp ? (
                    <div className="invalid-feedback">{errors.cp}</div>
                  ) : null}
                </div>
                <div className="form-group text-right">
                  <Button type="submit" variant="success">
                    {tipoModal === 'Crear' ? 'Crear' : 'Modificar'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>

      </Modal>
    </>
  );
}

export default Transportistes;
