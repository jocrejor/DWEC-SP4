import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud';
import { Button, Modal } from 'react-bootstrap';
import Header from './Header';
import { useNavigate, Outlet } from 'react-router-dom';

const StorageSchema = Yup.object().shape({
  name: Yup.string().min(4, 'Valor mínim de 4 caracters.').max(50, 'El valor màxim és de 50 caracters').required('Valor requerit'),
  type: Yup.string().min(3, 'Valor mínim de 3 caracters.').max(30, 'El valor màxim és de 30 caracters').required('Valor requerit'),
  address: Yup.string().min(10, 'Valor mínim de 10 caracters.').max(100, 'El valor màxim és de 100 caracters').required('Valor requerit'),
});

function Storage() {
  const [storages, setStorage] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tipoModal, setTipoModal] = useState("Crear");
  const [valorsInicials, setValorsInicials] = useState({ name: '', type: '', address: '' });
  const navigate = useNavigate(); 

  useEffect(async () => {
    const data = await getData(url, "Storage");
    setStorage(data);
  }, []);

  const eliminarStorage = (id) => {
    deleteData(url, "Storage", id);
    const newstorages = storages.filter(item => item.id !== id);
    setStorage(newstorages);
  };

  const modificarStorage = (valors) => {
    setTipoModal("Modificar");
    setValorsInicials(valors);
  };

  const canviEstatModal = () => {
    setShowModal(!showModal);
  };

  const handleCarrerClick = (id) => {
    navigate(`carrer/${id}`); 
  };

  return (
    <>
      
      <Header title="Gestió Magatzem"/>
      <Button variant='success' onClick={() => { canviEstatModal(); setTipoModal("Crear"); }}>Alta Magatzem</Button>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nom</th>
            <th>Tipus</th>
            <th>Adreça</th>
            <th>Carrer</th>
            <th>Modificar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {(storages.length === 0) ?
            <tr><td>No hi han magatzems</td></tr>
            : storages.map((valors) => {
              return (
                <tr key={valors.id}>
                  <td>{valors.id}</td>
                  <td>{valors.name}</td>
                  <td>{valors.type}</td>
                  <td>{valors.address}</td>
                  <td><Button onClick={() => handleCarrerClick(valors.id)}>Carrer</Button></td> 
                  <td><Button variant="warning" onClick={() => modificarStorage(valors)}>Modificar</Button></td>
                  <td><Button variant="primary" onClick={() => eliminarStorage(valors.id)}>Eliminar</Button></td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <Outlet /> 
      <Modal show={showModal} onHide={canviEstatModal}>
        <Modal.Header closeButton>
          <Modal.Title>{tipoModal} Magatzem</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Formik
            initialValues={tipoModal === 'Modificar' ? valorsInicials : { name: '', type: '', address: '' }}
            validationSchema={StorageSchema}
            onSubmit={values => {
              console.log(values);
              tipoModal === "Crear" ? postData(url, "Storage", values) : updateId(url, "Storage", values.id, values);
              canviEstatModal();
            }}
          >
            {({ values, errors, touched }) => (
              <Form>
                <div>
                  <label htmlFor='name'>Nom</label>
                  <Field type="text" name="name" placeholder="Nom del magatzem" autoComplete="off" value={values.name} />
                  {errors.name && touched.name ? <div>{errors.name}</div> : null}
                </div>

                <div>
                  <label htmlFor='type'>Tipus</label>
                  <Field type="text" name="type" placeholder="Tipus de magatzem" autoComplete="off" value={values.type} />
                  {errors.type && touched.type ? <div>{errors.type}</div> : null}
                </div>

                <div>
                  <label htmlFor='address'>Adreça</label>
                  <Field type="text" name="address" placeholder="Adreça del magatzem" autoComplete="off" value={values.address} />
                  {errors.address && touched.address ? <div>{errors.address}</div> : null}
                </div>

                <div>
                  <Button variant="secondary" onClick={canviEstatModal}>Close</Button>
                  <Button variant={tipoModal === "Modificar" ? "success" : "info"} type="submit">{tipoModal}</Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Storage;
