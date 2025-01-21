import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button, Modal } from 'react-bootstrap';
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud';
import Header from './Header';

const UserProfileSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, 'Valor mínimo de 4 caracteres.')
    .max(50, 'El valor máximo es de 50 caracteres')
    .required('Valor requerido'),
});

function Rols() {
  const [userProfiles, setUserProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]); 
  const [showModal, setShowModal] = useState(false);
  const [tipoModal, setTipoModal] = useState('Crear');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [modalType, setModalType] = useState('Crear');
  const [valorsInicials, setValorsInicials] = useState({ name: '' });

  useEffect(() => {
    const fetchUserProfiles = async () => {
      try {
        const data = await getData(url, 'UserProfile');
        setUserProfiles(data);
        setFilteredProfiles(data); 
      } catch (error) {
        console.error('Error al obtener los perfiles de usuario:', error);
      }
    };
    fetchUserProfiles();
  }, []);

  const eliminarUserProfile = async (id) => {
    try {
      await deleteData(url, 'UserProfile', id);
      setUserProfiles((prevProfiles) => prevProfiles.filter((item) => item.id !== id));
      setFilteredProfiles((prevProfiles) => prevProfiles.filter((item) => item.id !== id)); 
    } catch (error) {
      console.error('Error al eliminar el perfil de usuario:', error);
    }
  };

  const modificarUserProfile = (valors) => {
    setTipoModal('Modificar');
    setValorsInicials(valors);
    setShowModal(true);
  };

  const visualitzarUserProfile = async (id) => {
    try {
      const profile = await getData(url, `UserProfile/${id}`);
      setSelectedProfile(profile);
      setModalType('Visualizar');
      setShowModal(true);
    } catch (error) {
      console.error('Error al obtener los detalles del perfil de usuario:', error);
    }
  };

  const obrirModal = () => {
    setTipoModal('Crear');
    setValorsInicials({ name: '' });
    setShowModal(true);
  };

  const tancarModal = () => setShowModal(false);

  return (
    <div>
      <Header title="Lista de roles" />
      <Button variant="success" onClick={obrirModal} className="mb-3">
        Alta Perfil d'usuaris
      </Button>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nom</th>
            <th>Modificar</th>
            <th>Eliminar</th>
            <th>Visualizar</th>
          </tr>
        </thead>
        <tbody>
          {filteredProfiles.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">No hi ha perfils d'usuaris</td>
            </tr>
          ) : (
            filteredProfiles.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => modificarUserProfile(user)}
                    className="btn-sm"
                  >
                    Modificar
                  </Button>
                </td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => eliminarUserProfile(user.id)}
                    className="btn-sm"
                  >
                    Eliminar
                  </Button>
                </td>
                <td>
                  <Button
                    variant="info"
                    onClick={() => visualitzarUserProfile(user.id)}
                    className="btn-sm"
                  >
                    Visualizar
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Modal show={showModal} onHide={tancarModal}>
        <Modal.Header closeButton>
          <Modal.Title>{tipoModal} Perfil de Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === 'Visualizar' ? (
            selectedProfile ? (
              <div>
                <p><strong>Id:</strong> {selectedProfile.id}</p>
                <p><strong>Nom:</strong> {selectedProfile.name}</p>
                <Button variant="secondary" onClick={tancarModal}>
                  Cerrar
                </Button>
              </div>
            ) : (
              <p>Cargando datos del perfil...</p>
            )
          ) : (
            <Formik
              initialValues={modalType === 'Modificar' ? valorsInicials : { name: '' }}
              validationSchema={UserProfileSchema}
              onSubmit={async (values) => {
                try {
                  if (modalType === 'Crear') {
                    await postData(url, 'UserProfile', values);
                  } else {
                    await updateId(url, 'UserProfile', values.id, values);
                  }
                  tancarModal();
                  const updatedProfiles = await getData(url, 'UserProfile');
                  setUserProfiles(updatedProfiles);
                  setFilteredProfiles(updatedProfiles); // Actualiza filteredProfiles también
                } catch (error) {
                  console.error('Error al guardar el perfil de usuario:', error);
                }
              }}
            >
              {({ errors, touched }) => (
                <Form>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nombre</label>
                    <Field name="name" type="text" className="form-control" placeholder="Nombre del perfil de usuario" />
                    {errors.name && touched.name && <div className="text-danger">{errors.name}</div>}
                  </div>
                  <div className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={tancarModal}>
                      Cerrar
                    </Button>
                    <Button variant="primary" type="submit">
                      {modalType}
                    </Button>
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

export default Rols;
