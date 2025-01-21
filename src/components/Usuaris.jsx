import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button, Modal, Table, Form as BootstrapForm } from 'react-bootstrap';
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud';
import Header from './Header';
import Filtres from './Filtres'; // Import Filtres component

const UserSchema = Yup.object().shape({
  name: Yup.string().min(4, 'Valor mínim de 4 caracters.').max(50, 'El valor màxim és de 50 caracters').required('Valor requerit'),
  email: Yup.string().min(8, 'Valor mínim de 8 caracters.').max(40, 'El valor màxim és de 40 caracters').required('Valor requerit'),
  password: Yup.string().min(8, 'Valor mínim de 8 caracters.').max(20, 'El valor màxim és de 20 caracters').required('Valor requerit'),
  role: Yup.string().required('Valor requerit'),
  image: Yup.string().required('Valor requerit'),
});

function Usuaris() {
  const [user, setUser] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tipoModal, setTipoModal] = useState("Crear");
  const [valorsInicials, setValorsInicials] = useState({ name: '', email: '', password: '', role: '', image: '' });
  const [filters, setFilters] = useState({ name: '', email: '', role: '' });

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getData(url, "User");
        setUser(data);
      } catch (error) {
        console.error("Error carregant els usuaris:", error);
      }
    }
    fetchUser();
  }, []);

  const eliminarUsuari = async (id) => {
    try {
      await deleteData(url, "User", id);
      setUser(user.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error eliminant l'usuari:", error);
    }
  };

  const modificarUsuari = (valors) => {
    setTipoModal("Modificar");
    setValorsInicials(valors);
    setShowModal(true);
  };

  const visualitzarUsuari = async (id) => {
    try {
      const selectedUser = await getData(url, `User/${id}`);
      setValorsInicials(selectedUser);
      setTipoModal("Visualitzar");
      setShowModal(true);
    } catch (error) {
      console.error("Error obtenint les dades de l'usuari:", error);
    }
  };

  const obrirModal = () => {
    setTipoModal("Crear");
    setValorsInicials({ name: '', email: '', password: '', role: '', image: '' });
    setShowModal(true);
  };

  const tancarModal = () => setShowModal(false);

  const onSubmit = async (values) => {
    try {
      if (tipoModal === "Crear") {
        await postData(url, "User", values);
      } else {
        await updateId(url, "User", values.id, values);
      }
      const updatedUsers = await getData(url, "User");
      setUser(updatedUsers);
      tancarModal();
    } catch (error) {
      console.error("Error desant les dades de l'usuari:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = (users) => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      user.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      user.role.toLowerCase().includes(filters.role.toLowerCase())
    );
  };

  const filteredUsers = applyFilters(user);

  return (
    <div>
      <Header title="Llista d'usuaris" />
         
      <Button variant="success" onClick={obrirModal} className="mb-3">
        Alta Usuari
      </Button>
      
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Imatge</th>
            <th>Modificar</th>
            <th>Eliminar</th>
            <th>Visualitzar</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="8">No hi ha perfil d'usuaris</td>
            </tr>
          ) : (
            filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td><img src={user.image} alt="Usuari" style={{ width: '50px', height: '50px', borderRadius: '50%' }} /></td>
                <td><Button variant="warning" onClick={() => modificarUsuari(user)}>Modificar</Button></td>
                <td><Button variant="danger" onClick={() => eliminarUsuari(user.id)}>Eliminar</Button></td>
                <td><Button variant="info" onClick={() => visualitzarUsuari(user.id)}>Visualitzar</Button></td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={tancarModal}>
        <Modal.Header closeButton>
          <Modal.Title>{tipoModal} Usuari</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {tipoModal === "Visualitzar" ? (
            <div>
              <p><strong>Nom:</strong> {valorsInicials.name}</p>
              <p><strong>Email:</strong> {valorsInicials.email}</p>
              <p><strong>Rol:</strong> {valorsInicials.role}</p>
              <p><strong>Imatge:</strong> <img src={valorsInicials.image} alt="Usuari" style={{ width: '100px', height: '100px', borderRadius: '50%' }} /></p>
              <Button variant="secondary" onClick={tancarModal}>Tancar</Button>
            </div>
          ) : (
            <Formik initialValues={valorsInicials} validationSchema={UserSchema} onSubmit={onSubmit}>
              {({ errors, touched }) => (
                <Form>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nom</label>
                    <Field name="name" type="text" className="form-control" placeholder="Nom usuari" />
                    {errors.name && touched.name && <div className="text-danger">{errors.name}</div>}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Correu Electrònic</label>
                    <Field name="email" type="text" className="form-control" placeholder="Correu electrònic de l'usuari" />
                    {errors.email && touched.email && <div className="text-danger">{errors.email}</div>}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contrasenya</label>
                    <Field name="password" type="password" className="form-control" placeholder="Contrasenya de l'usuari" />
                    {errors.password && touched.password && <div className="text-danger">{errors.password}</div>}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">Rol</label>
                    <Field name="role" type="text" className="form-control" placeholder="Rol de l'usuari" />
                    {errors.role && touched.role && <div className="text-danger">{errors.role}</div>}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="image" className="form-label">Imatge</label>
                    <Field name="image" type="text" className="form-control" placeholder="URL de la imatge de l'usuari" />
                    {errors.image && touched.image && <div className="text-danger">{errors.image}</div>}
                  </div>
                  <div className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={tancarModal}>Tancar</Button>
                    <Button variant="primary" type="submit">{tipoModal}</Button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Usuaris;
