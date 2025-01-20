import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud';
import { Button, Modal } from 'react-bootstrap';

import Header from '../components/Header';
import Filtres from '../components/Filtres';

const LotSchema = Yup.object().shape({
  name: Yup.string().min(4, 'Valor mínim de 4 caràcters.').max(50, 'El valor màxim és de 50 caràcters').required('Valor requerit'),
  product_id: Yup.number().positive('El valor ha de ser positiu').required('Valor requerit'),
  supplier_id: Yup.number().positive('El valor ha de ser positiu').required('Valor requerit'),
  quantity: Yup.number().positive('El valor ha de ser positiu').required('Valor requerit'),
  production_date: Yup.string().required('Valor requerit'),
  expiration_date: Yup.string().required('Valor requerit'),
});

function Lots() {
  const [lot, setLot] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tipoModal, setTipoModal] = useState('Crear');
  const [valorsInicials, setValorsInicials] = useState({
    name: '',
    product_id: '',
    supplier_id: '',
    quantity: '',
    production_date: '',
    expiration_date: '',
  });
  const [visualizarLot, setVisualizarLot] = useState(null); // Estado para visualizar lote

  useEffect(() => {
    async function fetchData() {
      const data = await getData(url, 'Lot');
      setLot(data);
    }
    fetchData();
  }, []);

  const eliminarLot = (id) => {
    deleteData(url, 'Lot', id);
    const newLot = lot.filter((item) => item.id !== id);
    setLot(newLot);
  };

  const modificarLot = (valors) => {
    setTipoModal('Modificar');
    setValorsInicials(valors);
  };

  const canviEstatModal = () => {
    setShowModal(!showModal);
  };

  const handleVisualitzar = (valors) => {
    setVisualizarLot(valors);
  };

  return (
    <>
      <Header title="Llistat Lots" />

      <Filtres />

      <div className="d-flex justify-content-end mt-3 me-3">
        <Button
          variant="success"
          className="btn btn-primary"
          onClick={() => {
            canviEstatModal();
            setTipoModal('Crear');
          }}
        >
          Alta Lots
        </Button>
      </div>
      <div className="table-responsive mx-2">
        <table className="table table-bordered table-hover table-striped text-center mt-4">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>ID Product</th>
              <th>ID Supplier</th>
              <th>Quantitat</th>
              <th>Data producció</th>
              <th>Data caducitat</th>
              <th>Visualitzar</th>
              <th>Modificar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {lot.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center">
                  No hi han lots
                </td>
              </tr>
            ) : (
              lot.map((valors) => (
                <tr key={valors.id}>
                  <td>{valors.id}</td>
                  <td>{valors.name}</td>
                  <td>{valors.product_id}</td>
                  <td>{valors.supplier_id}</td>
                  <td>{valors.quantity}</td>
                  <td>{valors.production_date}</td>
                  <td>{valors.expiration_date}</td>
                  <td>
                    <Button
                      variant="info"
                      className="btn-sm"
                      onClick={() => handleVisualitzar(valors)}
                    >
                      <i className="bi bi-eye"></i>
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="warning"
                      className="btn-sm"
                      onClick={() => {
                        modificarLot(valors);
                        canviEstatModal();
                      }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => {
                        eliminarLot(valors.id);
                      }}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para Crear/Modificar */}
      <Modal show={showModal} onHide={canviEstatModal}>
        <Modal.Header closeButton>
          <Modal.Title>{tipoModal} Lot</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Formik
            initialValues={
              tipoModal === 'Modificar'
                ? valorsInicials
                : {
                  name: '',
                  product_id: '',
                  supplier_id: '',
                  quantity: '',
                  production_date: '',
                  expiration_date: '',
                }
            }
            validationSchema={LotSchema}
            onSubmit={(values) => {
              if (tipoModal === 'Crear') {
                postData(url, 'Lot', values).then((nuevoLote) => {
                  setLot(prevLot => [...prevLot, nuevoLote]);
                });
              } else {
                updateId(url, 'Lot', values.id, values).then(() => {
                  setLot(prevLot => prevLot.map(lot => (lot.id === values.id ? values : lot)));
                });
              }
              canviEstatModal();
            }}
          >
            {({ values, errors, touched }) => (
              <Form>
                <div className="form-group">
                  <label htmlFor="name">Nom del lot</label>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Nom del lot"
                    className="form-control"
                  />
                  {errors.name && touched.name ? (
                    <div className="text-danger mt-1">{errors.name}</div>
                  ) : null}
                </div>

                <div className="form-group">
                  <label htmlFor="product_id">ID del Producte</label>
                  <Field
                    type="number"
                    name="product_id"
                    placeholder="ID del producte"
                    className="form-control"
                  />
                  {errors.product_id && touched.product_id ? (
                    <div className="text-danger mt-1">{errors.product_id}</div>
                  ) : null}
                </div>

                <div className="form-group">
                  <label htmlFor="supplier_id">ID del Proveïdor</label>
                  <Field
                    type="number"
                    name="supplier_id"
                    placeholder="ID del proveïdor"
                    className="form-control"
                  />
                  {errors.supplier_id && touched.supplier_id ? (
                    <div className="text-danger mt-1">{errors.supplier_id}</div>
                  ) : null}
                </div>

                <div className="form-group">
                  <label htmlFor="quantity">Quantitat</label>
                  <Field
                    type="number"
                    name="quantity"
                    placeholder="Quantitat del lot"
                    className="form-control"
                  />
                  {errors.quantity && touched.quantity ? (
                    <div className="text-danger mt-1">{errors.quantity}</div>
                  ) : null}
                </div>

                <div className="form-group">
                  <label htmlFor="production_date">Data de producció</label>
                  <Field
                    type="date"
                    name="production_date"
                    className="form-control"
                  />
                  {errors.production_date && touched.production_date ? (
                    <div className="text-danger mt-1">{errors.production_date}</div>
                  ) : null}
                </div>

                <div className="form-group">
                  <label htmlFor="expiration_date">Data d&apos;expiració</label>
                  <Field
                    type="date"
                    name="expiration_date"
                    className="form-control"
                  />
                  {errors.expiration_date && touched.expiration_date ? (
                    <div className="text-danger mt-1">{errors.expiration_date}</div>
                  ) : null}
                </div>

                <div className="form-group d-flex justify-content-between mt-3">
                  <Button
                    variant="secondary"
                    onClick={canviEstatModal}
                    className="btn btn-secondary"
                  >
                    Tancar
                  </Button>
                  <Button
                    variant={tipoModal === 'Modificar' ? 'success' : 'info'}
                    type="submit"
                    className="btn"
                  >
                    {tipoModal}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* Modal para Visualizar */}
      {visualizarLot && (
        <Modal show={!!visualizarLot} onHide={() => setVisualizarLot(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Detalls del Lot</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>ID:</strong> {visualizarLot.id}</p>
            <p><strong>Nom:</strong> {visualizarLot.name}</p>
            <p><strong>ID Producte:</strong> {visualizarLot.product_id}</p>
            <p><strong>ID Proveïdor:</strong> {visualizarLot.supplier_id}</p>
            <p><strong>Quantitat:</strong> {visualizarLot.quantity}</p>
            <p><strong>Data de Producció:</strong> {visualizarLot.production_date}</p>
            <p><strong>Data de Caducitat:</strong> {visualizarLot.expiration_date}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setVisualitzarLot(null)}>
              Tancar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default Lots;
