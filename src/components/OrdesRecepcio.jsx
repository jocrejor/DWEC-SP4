import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud';
import { Button, Modal, Table, Spinner } from 'react-bootstrap';

const OrderReceptionSchema = Yup.object().shape({
  supplier_id: Yup.number().required('Proveïdor requerit'),
  estimated_reception_date: Yup.date().required('Data estimada requerida'),
  orderreception_status_id: Yup.number().required('Estat requerit'),
});

function OrderReception() {
  const [orderReceptions, setOrderReceptions] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [tipoModal, setTipoModal] = useState('Crear');
  const [valorsInicials, setValorsInicials] = useState({
    supplier_id: '',
    estimated_reception_date: '',
    orderreception_status_id: '',
  });
  const [error, setError] = useState(null);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [orders, suppliersData, statusesData] = await Promise.all([
        getData(url, 'OrderReception'),
        getData(url, 'Supplier'),
        getData(url, 'OrderReception_Status'),
      ]);
      setOrderReceptions(orders);
      setSuppliers(suppliersData);
      setStatuses(statusesData);
      setError(null);
    } catch (err) {
      setError('Error carregant les dades.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const eliminarOrdre = async (id) => {
    if (window.confirm('Estàs segur que vols eliminar aquesta ordre?')) {
      try {
        await deleteData(url, 'OrderReception', id);
        setOrderReceptions((prev) =>
          prev.filter((item) => item.id !== id)
        );
      } catch (err) {
        setError('Error eliminant l\'ordre.');
      }
    }
  };

  const modificarOrdre = (valors) => {
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
        await postData(url, 'OrderReception', values);
      } else {
        await updateId(url, 'OrderReception', values.id, values);
      }
      await fetchInitialData();
      canviEstatModal();
      setError(null);
    } catch (err) {
      setError('Error en l\'operació.');
    }
  };

  return (
    <>
      <div>
        <h2>Llistat Ordres de Recepció</h2>
      </div>
      <Button
        variant="success"
        onClick={() => {
          setTipoModal('Crear');
          setValorsInicials({
            supplier_id: '',
            estimated_reception_date: '',
            orderreception_status_id: '',
          });
          canviEstatModal();
        }}
      >
        Nova Ordre de Recepció
      </Button>
      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <div>{error}</div>
      ) : orderReceptions.length === 0 ? (
        <div>No hi ha ordres</div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Proveïdor</th>
              <th>Data Estimada</th>
              <th>Estat</th>
              <th>Modificar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {orderReceptions.map((valors) => (
              <tr key={valors.id}>
                <td>{valors.id}</td>
                <td>
                  {suppliers.find((sup) => sup.id === valors.supplier_id)?.name}
                </td>
                <td>{valors.estimated_reception_date}</td>
                <td>
                  {statuses.find(
                    (status) => status.id === valors.orderreception_status_id
                  )?.name}
                </td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => modificarOrdre(valors)}
                  >
                    Modificar
                  </Button>
                </td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => eliminarOrdre(valors.id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Modal show={showModal} onHide={canviEstatModal}>
        <Modal.Header closeButton>
          <Modal.Title>{tipoModal} Ordre de Recepció</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={valorsInicials}
            validationSchema={OrderReceptionSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <div>
                  <label htmlFor="supplier_id">Proveïdor</label>
                  <Field as="select" id="supplier_id" name="supplier_id">
                    <option value="">Selecciona un proveïdor</option>
                    {suppliers.map((sup) => (
                      <option key={sup.id} value={sup.id}>
                        {sup.name}
                      </option>
                    ))}
                  </Field>
                  {errors.supplier_id && touched.supplier_id && (
                    <div>{errors.supplier_id}</div>
                  )}
                </div>
                <div>
                  <label htmlFor="estimated_reception_date">Data Estimada</label>
                  <Field
                    id="estimated_reception_date"
                    type="date"
                    name="estimated_reception_date"
                  />
                  {errors.estimated_reception_date &&
                    touched.estimated_reception_date && (
                      <div>{errors.estimated_reception_date}</div>
                    )}
                </div>
                <div>
                  <label htmlFor="orderreception_status_id">Estat</label>
                  <Field as="select" id="orderreception_status_id" name="orderreception_status_id">
                    <option value="">Selecciona un estat</option>
                    {statuses.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>
                    ))}
                  </Field>
                  {errors.orderreception_status_id &&
                    touched.orderreception_status_id && (
                      <div>{errors.orderreception_status_id}</div>
                    )}
                </div>
                <div>
                  <Button variant="secondary" onClick={canviEstatModal}>
                    Tanca
                  </Button>
                  <Button
                    variant={tipoModal === 'Modificar' ? 'success' : 'info'}
                    type="submit"
                  >
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

export default OrderReception;
