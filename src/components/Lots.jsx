import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud';
import { Button, Modal } from 'react-bootstrap';

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

  return (
    <>
      <div>
        <h2>Llistat Lots</h2>
      </div>
      <Button
        variant="success"
        className='btn btn-primary'
        onClick={() => {
          canviEstatModal();
          setTipoModal('Crear');
        }}
      >
        Alta Lots
      </Button>
      <table className="table table-striped">
        <tr>
          <th>ID</th>
          <th>Nom</th>
          <th>ID Product</th>
          <th>ID Supplier</th>
          <th>Quantitat</th>
          <th>Data producció</th>
          <th>Data caducitat</th>
          <th>Modificar</th>
          <th>Eliminar</th>
        </tr>
        {lot.length === 0 ? (
          <div>No hi han lots</div>
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
                  variant="warning"
                  onClick={() => {
                    modificarLot(valors);
                    canviEstatModal();
                  }}
                >
                  Modificar
                </Button>
              </td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => {
                    eliminarLot(valors.id);
                  }}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))
        )}
      </table>

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
              tipoModal === 'Crear'
                ? postData(url, 'Lot', values)
                : updateId(url, 'Lot', values.id, values);
              canviEstatModal();
            }}
          >
            {({ values, errors, touched }) => (
              <Form>
              <div>
                <label htmlFor="name">Nom del lot</label>
                <Field type="text" name="name" placeholder="Nom del lot" />
                {errors.name && touched.name ? <div>{errors.name}</div> : null}
              </div>
            
              <div>
                <label htmlFor="product_id">ID del Producte</label>
                <Field type="number" name="product_id" placeholder="ID del producte" />
                {errors.product_id && touched.product_id ? <div>{errors.product_id}</div> : null}
              </div>
            
              <div>
                <label htmlFor="supplier_id">ID del Proveïdor</label>
                <Field type="number" name="supplier_id" placeholder="ID del proveïdor" />
                {errors.supplier_id && touched.supplier_id ? <div>{errors.supplier_id}</div> : null}
              </div>
            
              <div>
                <label htmlFor="quantity">Quantitat</label>
                <Field type="number" name="quantity" placeholder="Quantitat del lot" />
                {errors.quantity && touched.quantity ? <div>{errors.quantity}</div> : null}
              </div>
            
              <div>
                <label htmlFor="production_date">Data de producció</label>
                <Field type="date" name="production_date" />
                {errors.production_date && touched.production_date ? <div>{errors.production_date}</div> : null}
              </div>
            
              <div>
                <label htmlFor="expiration_date">Data d'expiració</label>
                <Field type="date" name="expiration_date" />
                {errors.expiration_date && touched.expiration_date ? <div>{errors.expiration_date}</div> : null}
              </div>
            
              <div>
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

export default Lots
