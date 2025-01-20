import { useState, useEffect } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Button, Modal } from 'react-bootstrap'
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud'

const UserSchema = Yup.object().shape({
  name: Yup.string().min(4, 'Valor mínim de 4 caracters.').max(50, 'El valor màxim és de 50 caracters').required('Valor requerit'),
  email: Yup.string().min(8, 'Valor mínim de 8 caracters.').max(40, 'El valor màxim és de 40 caracters').required('Valor requerit'),
  password: Yup.string().min(8, 'Valor mínim de 8 caracters.').max(20, 'El valor màxim és de 20 caracters').required('Valor requerit'),
  role: Yup.string().required('Valor requerit'),
  image: Yup.string().required('Valor requerit')
});

function Usuaris() {
  const [user, setUser] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tipoModal, setTipoModal] = useState("Crear");
  const [valorsInicials, setValorsInicials] = useState({ name: '', email: '', password: '', role: '', image: '' });

  useEffect(() => {
    async function fetchUser() {
      const data = await getData(url, "User");
      setUser(data);
    }
    fetchUser();
  }, []);

  const eliminarUsuari = (id) => {
    deleteData(url, "User", id);
    setUser(user.filter((user) => user.id !== id));
  };

  const modificarUsuari = (valors) => {
    setTipoModal("Modificar");
    setValorsInicials(valors);
    setShowModal(true);
  };

  const obrirModal = () => {
    setTipoModal("Crear");
    setValorsInicials({ name: '', email: '', password: '', role: '', image: '' });
    setShowModal(true);
  };

  const tancarModal = () => setShowModal(false);

  return (
    <div>
      <h2 style={{textAlign:"center"}}>Usuaris</h2>
      <Button variant="success" onClick={obrirModal} style={{ marginLeft: "17rem" }}>Alta Usuari</Button>
      <table  style={{ marginLeft: "17rem" }}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Password</th>
            <th>Rol</th>
            <th>Image</th>
            <th>Modificar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {user.length === 0 ? (
            <tr>
              <td colSpan="8">No hi ha perfil d'usuaris</td>
            </tr>
          ) : (
            user.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.password}</td>
                <td>{user.role}</td>
                <td>{user.image}</td>
                <td>
                  <Button variant="warning" onClick={() => modificarUsuari(user)}>Modificar</Button>
                </td>
                <td>
                  <Button variant="danger" onClick={() => eliminarUsuari(user.id)}>Eliminar</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Modal show={showModal} onHide={tancarModal}>
        <Modal.Header closeButton>
          <Modal.Title>{tipoModal} Usuari</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={tipoModal === 'Modificar' ? valorsInicials : { name: '', email: '', password: '', role: '', image: '' }}
            validationSchema={UserSchema}
            onSubmit={(values) => {
              tipoModal === "Crear" ? postData(url, "User", values) : updateId(url, "User", values.id, values);
              tancarModal();
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <div>
                  <label htmlFor="name">Nom</label>
                  <Field name="name" type="text" placeholder="Nom usuari" />
                  {errors.name && touched.name && <div>{errors.name}</div>}
                </div>
                <div>
                  <label htmlFor="email">Correu Electronic</label>
                  <Field name="email" type="text" placeholder="Correu Electronic de usuari" />
                  {errors.email && touched.email && <div>{errors.email}</div>}
                </div>
                <div>
                  <label htmlFor="password">Contrasenya</label>
                  <Field name="password" type="password" placeholder="Contrasenya de usuari" />
                  {errors.password && touched.password && <div>{errors.password}</div>}
                </div>
                <div>
                  <label htmlFor="role">Rol</label>
                  <Field name="role" type="text" placeholder="Rol de usuari" />
                  {errors.role && touched.role && <div>{errors.role}</div>}
                </div>
                <div>
                  <label htmlFor="image">Imatge</label>
                  <Field name="image" type="text" placeholder="URL de la imatge d'usuari" />
                  {errors.image && touched.image && <div>{errors.image}</div>}
                </div>
                <div>
                  <Button variant="secondary" onClick={tancarModal}>Tancar</Button>
                  <Button variant="primary" type="submit">{tipoModal}</Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Usuaris;