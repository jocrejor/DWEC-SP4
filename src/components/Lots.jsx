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
  orderReception: Yup.string().min(3, 'Valor mínim de 3 caràcters').max(50, 'El valor màxim és de 50 caràcters').required('Valor requerit'),
  orderLineReception: Yup.string().min(3, 'Valor mínim de 3 caràcters').max(50, 'El valor màxim és de 50 caràcters').required('Valor requerit'),
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
    orderReception: '',
    orderLineReception: '',
  });
  const [visualizarLot, setVisualizarLot] = useState(null);

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
              <th>Order Reception</th>
              <th>Order Line Reception</th>
              <th>Visualitzar</th>
              <th>Modificar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {lot.length === 0 ? (
              <tr>
                <td colSpan="12" className="text-center">
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
                  <td>{valors.orderReception}</td>
                  <td>{valors.orderLineReception}</td>
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
            initialValues={tipoModal === 'Modificar' ? valorsInicials : valorsInicials}
            validationSchema={LotSchema}
            onSubmit={(values) => {
              if (tipoModal === 'Crear') {
                postData(url, 'Lot', values).then((nuevoLote) => {
                  setLot((prevLot) => [...prevLot, nuevoLote]);
                });
              } else {
                updateId(url, 'Lot', values.id, values).then(() => {
                  setLot((prevLot) =>
                    prevLot.map((lot) => (lot.id === values.id ? values : lot))
                  );
                });
              }
              canviEstatModal();
            }}
          >
            {({ errors, touched }) => (
              <Form>
                {/* Existing fields */}
                {/* New fields */}
                <div className="form-group">
                  <label htmlFor="orderReception">Order Reception</label>
                  <Field
                    type="text"
                    name="orderReception"
                    placeholder="Order Reception"
                    className="form-control"
                  />
                  {errors.orderReception && touched.orderReception && (
                    <div className="text-danger">{errors.orderReception}</div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="orderLineReception">Order Line Reception</label>
                  <Field
                    type="text"
                    name="orderLineReception"
                    placeholder="Order Line Reception"
                    className="form-control"
                  />
                  {errors.orderLineReception && touched.orderLineReception && (
                    <div className="text-danger">{errors.orderLineReception}</div>
                  )}
                </div>
                <div className="form-group d-flex justify-content-between mt-3">
                  <Button variant="secondary" onClick={canviEstatModal}>
                    Tancar
                  </Button>
                  <Button variant={tipoModal === 'Modificar' ? 'success' : 'info'} type="submit">
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

export default Lots;
