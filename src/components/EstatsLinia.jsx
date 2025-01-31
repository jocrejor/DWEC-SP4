import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud';
import { Button, Modal, Table, Spinner } from 'react-bootstrap';
import Header from './Header'

const OrderLineReception_StatusSchema = Yup.object().shape({
  name: Yup.string()
    .min(1, "Valor mínim d'1 caràcter.")
    .max(25, 'El valor màxim és de 25 caràcters.')
    .required('Valor requerit'),
});

function OrderLineReception_Status() {
  const [ordersLineReception, setOrdersLineReception] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [tipoModal, setTipoModal] = useState('Crear');
  const [valorsInicials, setValorsInicials] = useState({ name: '' });
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getData(url, 'OrderLineReception_Status');
      setOrdersLineReception(data);
      setError(null);
    } catch (err) {
      setError('Error carregant les dades.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const eliminarEstatLinia = async (id) => {
    if (window.confirm('Estàs segur que vols eliminar aquest estat?')) {
      try {
        await deleteData(url, 'OrderLineReception_Status', id);
        setOrdersLineReception((prev) =>
          prev.filter((item) => item.id !== id)
        );
      } catch (err) {
        setError('Error eliminant l\'estat.');
      }
    }
  };

  const modificarEstatLinia = (valors) => {
    setTipoModal('Modificar');
    setValorsInicials(valors);
    setShowModal(true);
  };

  const canviEstatModal = () => {
    setShowModal(!showModal);
  };

  const handleSubmit = async (values) => {
    try {
      if (tipoModal === 'Crear') {
        await postData(url, 'OrderLineReception_Status', values);
      } else {
        await updateId(url, 'OrderLineReception_Status', values.id, values);
      }
      await fetchOrders();
      canviEstatModal();
      setError(null);
    } catch (err) {
      setError('Error en l\'operació.');
    }
  };

  return (
    <>
      <Header title="Llistat Estats de Línia" />
      <div className="row mb-3">
        <div className="d-none d-xl-block col-xl-4 order-xl-1"></div>
        <div className="col-12 order-0 col-md-6 order-md-1 col-xl-4 order-xl-2">
          <div className="d-flex h-100 justify-content-xl-end">
            <Button
              className="btn btn-dark border-white text-white mt-2 my-md-2 flex-grow-1 flex-xl-grow-0"
              onClick={() => {
                setTipoModal('Crear');
                setValorsInicials({ name: '' });
                setShowModal(true);
              }}
            >
              <i className="bi bi-plus-circle text-white pe-1"></i>Crear
            </Button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          {loading ? (
            <Spinner animation="border" />
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : ordersLineReception.length === 0 ? (
            <div className="alert alert-warning">No hi ha estats</div>
          ) : (
            <Table striped bordered hover className="table text-center">
              <thead className="table-active border-bottom border-dark-subtle">
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Accions</th>
                </tr>
              </thead>
              <tbody>
                {ordersLineReception.map((valors) => (
                  <tr key={valors.id}>
                    <td>{valors.id}</td>
                    <td>{valors.name}</td>
                    <td className="fs-5" data-no-colon="true">
                      <i className="bi bi-pencil-square text-warning mx-2" role="button" onClick={() => modificarEstatLinia(valors)}></i>
                      <i className="bi bi-trash text-danger mx-2" role="button" onClick={() => eliminarEstatLinia(valors.id)}></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </div>
      <Modal show={showModal} onHide={canviEstatModal}>
        <Modal.Header closeButton>
          <Modal.Title>{tipoModal} Estat de Línia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={valorsInicials}
            validationSchema={OrderLineReception_StatusSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Nom</label>
                  <Field
                    id="name"
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Nom del estat"
                    autoComplete="off"
                  />
                  {errors.name && touched.name && <div className="text-danger">{errors.name}</div>}
                </div>
                <div className="d-flex justify-content-end">
                  <Button variant="secondary" onClick={canviEstatModal} className="me-2">
                    Tanca
                  </Button>
                  <Button
                    variant={tipoModal === 'Modificar' ? 'success' : 'info'}
                    type="submit">
                    {tipoModal}
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

export default OrderLineReception_Status;
