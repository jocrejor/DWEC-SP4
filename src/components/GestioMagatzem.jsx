import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud';
import { Button, Modal } from 'react-bootstrap';

const GestioMagatzemSchema = Yup.object().shape({
  name: Yup.string().min(4, 'Valor mínim de 4 caracters.').max(50, 'El valor màxim és de 50 caracters').required('Valor requerit'),
  type: Yup.string().min(3, 'Valor mínim de 3 caracters.').max(30, 'El valor màxim és de 30 caracters').required('Valor requerit'),
  address: Yup.string().min(10, 'Valor mínim de 10 caracters.').max(100, 'El valor màxim és de 100 caracters').required('Valor requerit'),
});

function GestioMagatzem() {
  const [magatzems, setMagatzems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tipoModal, setTipoModal] = useState("Crear");
  const [valorsInicials, setValorsInicials] = useState({ name: '', type: '', address: '' });

  useEffect(() => {
    (async () => {
      const data = await getData(url, "GestioMagatzem");
      setMagatzems(data);
    })();
  }, []);

  const eliminarMagatzem = (id) => {
    deleteData(url, "GestioMagatzem", id);
    const newMagatzems = magatzems.filter(item => item.id !== id);
    setMagatzems(newMagatzems);
  };

  const modificarMagatzem = (valors) => {
    setTipoModal("Modificar");
    setValorsInicials(valors);
    canviEstatModal();
  };

  const canviEstatModal = () => {
    setShowModal(!showModal);
  };

  const grabar = async (values) => {
    if (tipoModal === "Crear") {
      await postData(url, 'GestioMagatzem', values);
    } else {
      await updateId(url, 'GestioMagatzem', values.id, values);
    }
    const data = await getData(url, "GestioMagatzem");
    setMagatzems(data);
    canviEstatModal();
  };

  return (
    <>
      <div><h2>Llistat de Magatzems</h2></div>
      <Button variant='success' onClick={() => { canviEstatModal(); setTipoModal("Crear"); }}>Alta Magatzem</Button>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Nom</th>
            <th scope="col">Tipus</th>
            <th scope="col">Adreça</th>
            <th scope="col">Modificar</th>
            <th scope="col">Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {(magatzems.length === 0) ?
            <tr><td colSpan="6">No hi han magatzems</td></tr>
            : magatzems.map((valors) => (
              <tr key={valors.id}>
                <td>{valors.id}</td>
                <td>{valors.name}</td>
                <td>{valors.type}</td>
                <td>{valors.address}</td>
                <td><Button variant="warning" onClick={() => modificarMagatzem(valors)}>Modificar</Button></td>
                <td><Button variant="primary" onClick={() => eliminarMagatzem(valors.id)}>Eliminar</Button></td>
              </tr>
            ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={canviEstatModal}>
        <Modal.Header closeButton >
          <Modal.Title>{tipoModal} Magatzem</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Formik
            initialValues={tipoModal === 'Modificar' ? valorsInicials : { name: '', type: '', address: '' }}
            validationSchema={GestioMagatzemSchema}
            onSubmit={values => grabar(values)}
          >
            {({ errors, touched }) => (
              <Form>
                <div>
                  <label htmlFor='name'>Nom</label>
                  <Field type="text" name="name" placeholder="Nom del magatzem" autoComplete="off" />
                  {errors.name && touched.name ? <div>{errors.name}</div> : null}
                </div>

                <div>
                  <label htmlFor='type'>Tipus</label>
                  <Field type="text" name="type" placeholder="Tipus de magatzem" autoComplete="off" />
                  {errors.type && touched.type ? <div>{errors.type}</div> : null}
                </div>

                <div>
                  <label htmlFor='address'>Adreça</label>
                  <Field type="text" name="address" placeholder="Adreça del magatzem" autoComplete="off" />
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

export default GestioMagatzem;
