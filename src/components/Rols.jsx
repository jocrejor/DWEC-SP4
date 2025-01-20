import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button, Modal } from 'react-bootstrap';
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud';

const UserProfileSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, 'Valor mínim de 4 caracters.')
    .max(50, 'El valor màxim és de 50 caracters')
    .required('Valor requerit'),
});

function Rols() {
  const [userProfiles, setUserProfiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tipoModal, setTipoModal] = useState('Crear');
  const [valorsInicials, setValorsInicials] = useState({ name: '' });

  useEffect(() => {
    const fetchUserProfiles = async () => {
      try {
        const data = await getData(url, 'UserProfile');
        setUserProfiles(data);
      } catch (error) {
        console.error('Error fetching user profiles:', error);
      }
    };
    fetchUserProfiles();
  }, []);

  const eliminarUserProfile = async (id) => {
    try {
      await deleteData(url, 'UserProfile', id);
      setUserProfiles((prevProfiles) => prevProfiles.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting user profile:', error);
    }
  };

  const modificarUserProfile = (valors) => {
    setTipoModal('Modificar');
    setValorsInicials(valors);
    setShowModal(true);
  };

  const obrirModal = () => {
    setTipoModal('Crear');
    setValorsInicials({ name: '' });
    setShowModal(true);
  };

  const tancarModal = () => setShowModal(false);

  return (
    <div>
      <h2 style={{textAlign:"center"}}>Perfil d'Usuaris</h2>
      <Button variant="success" onClick={obrirModal} style={{ marginLeft: "17rem" }}>
        Alta Perfil d'Usuaris
      </Button>
      <table style={{ marginLeft: "17rem" }}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nom</th>
            <th>Modificar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {userProfiles.length === 0 ? (
            <tr>
              <td colSpan="4">No hi han perfils d'usuaris</td>
            </tr>
          ) : (
            userProfiles.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => modificarUserProfile(user)}
                  >
                    Modificar
                  </Button>
                </td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => eliminarUserProfile(user.id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Modal show={showModal} onHide={tancarModal}>
        <Modal.Header closeButton>
          <Modal.Title>{tipoModal} Perfil d'Usuaris</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={tipoModal === 'Modificar' ? valorsInicials : { name: '' }}
            validationSchema={UserProfileSchema}
            onSubmit={async (values) => {
              try {
                if (tipoModal === 'Crear') {
                  await postData(url, 'UserProfile', values);
                } else {
                  await updateId(url, 'UserProfile', values.id, values);
                }
                tancarModal();
                const updatedProfiles = await getData(url, 'UserProfile');
                setUserProfiles(updatedProfiles);
              } catch (error) {
                console.error('Error saving user profile:', error);
              }
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <div>
                  <label htmlFor="name">Nom</label>
                  <Field name="name" type="text" placeholder="Nom del perfil d'usuari" />
                  {errors.name && touched.name && <div>{errors.name}</div>}
                </div>
                <div>
                  <Button variant="secondary" onClick={tancarModal}>
                    Tancar
                  </Button>
                  <Button variant="primary" type="submit">
                    {tipoModal}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Rols;
