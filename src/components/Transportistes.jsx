import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud';
import { Button, Modal } from 'react-bootstrap';

const carrierschema = Yup.object().shape({
  name: Yup.string().min(4, 'Valor mínim de 4 caracters.').max(50, 'El valor màxim és de 50 caracters').required('Valor requerit'),
  address: Yup.string().min(10, 'Valor mínim de 10 caracters.').max(100, 'El valor màxim és de 100 caracters').required('Valor requerit'),
  nif: Yup.string().matches(/^\w{9}$/, 'El NIF ha de tenir 9 caracters').required('Valor requerit'),
  phone: Yup.string().matches(/^\+\d{1,3}\s\d{9}$/, 'El telèfon ha de ser correcte (+34 911234567)').required('Valor requerit'),
  email: Yup.string().email('Email no vàlid').required('Valor requerit'),
  state_id: Yup.number().positive('El valor ha de ser positiu').required('Valor requerit'),
  province: Yup.string().min(3, 'Valor mínim de 3 caracters').max(50, 'El valor màxim és de 50 caracters').required('Valor requerit'),
  city: Yup.string().min(3, 'Valor mínim de 3 caracters').max(50, 'El valor màxim és de 50 caracters').required('Valor requerit'),
  cp: Yup.string().matches(/^\d{5}$/, 'El codi postal ha de tenir 5 dígits').required('Valor requerit'),
});

function Transportistes() {
  const [carriers, setCarriers] = useState([]);
  const [pais, setPais] = useState([]);
  const [provincia, setProvince] = useState([]);
  const [ciutat, setCity] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tipoModal, setTipoModal] = useState('Crear');
  const [valorsInicials, setValorsInicials] = useState({
    name: '',
    address: '',
    nif: '',
    phone: '',
    email: '',
    state_id: 0,
    province: '',
    city: '',
    cp: '',
  });

  useEffect(() => {
    async function fetchData() {
      const data = await getData(url, 'Carriers');
      const pais = await getData(url, 'State');
      const province = await getData(url, 'Province');
      const ciutat = await getData(url, 'City');
      setPais (pais);
      setCarriers(data);
    }
    fetchData();
  }, []);

  const deleteCarriers = (id) => {
    deleteData(url, 'Carriers', id);
    const newCarriers = carriers.filter((item) => item.id !== id);
    setCarriers(newCarriers);
  };

  const modCarriers = (valors) => {
    setTipoModal('Modificar');
    setValorsInicials(valors);
  };

  const canviEstatModal = () => {
    setShowModal(!showModal);
  };


const gravar = async (values)=>{
  if(tipoModal==="Crear"){
    await postData(url,'Carriers', values)
  }else{
    await updateId(url,'Product',values.id,values)
    }
  const data = await getData(url, "Product")
  await setProducts(data)
  canviEstatModal()
}
  return (
    <>
      <div>
        <h2>Llistat Transportistes</h2>
      </div>
      <Button
        variant="success"
        className='btn btn-primary'
        onClick={() => {
          canviEstatModal();
          setTipoModal('Crear');
        }}
      >
        Alta Transportistes
      </Button>
      <table>
        <tr>
          <th>Id</th>
          <th>Nom</th>
          <th>Adreça</th>
          <th>NIF</th>
          <th>Telèfon</th>
          <th>Email</th>
          <th>Estat</th>
          <th>Província</th>
          <th>Ciutat</th>
          <th>CP</th>
          <th>Modificar</th>
          <th>Eliminar</th>
        </tr>
        {carriers.length === 0 ? (
          <div>No hi han transportistes</div>
        ) : (
          carriers.map((valors) => (
            <tr key={valors.id}>
              <td>{valors.id}</td>
              <td>{valors.name}</td>
              <td>{valors.address}</td>
              <td>{valors.nif}</td>
              <td>{valors.phone}</td>
              <td>{valors.email}</td>
              <td>{valors.state_id}</td>
              <td>{valors.province}</td>
              <td>{valors.city}</td>
              <td>{valors.cp}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => {
                    modCarriers(valors);
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
                    deleteCarriers(valors.id);
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
          <Modal.Title>{tipoModal} transportista</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Formik
            initialValues={
              tipoModal === 'Modificar'
                ? valorsInicials
                : {
                    name: '',
                    address: '',
                    nif: '',
                    phone: '',
                    email: '',
                    state_id: 0,
                    province: '',
                    city: '',
                    cp: '',
                  }
            }
            validationSchema={carrierschema}
            onSubmit={(values) => {
              tipoModal === 'Crear'
                ? postData(url, 'Carriers', values)
                : updateId(url, 'Carriers', values.id, values);
              canviEstatModal();
            }}
          >
            {({ values, errors, touched }) => (
              <Form>
                <div>
                  <label htmlFor="name">Nom</label>
                  <Field type="text" name="name" placeholder="Nom del transportista" />
                  {errors.name && touched.name ? <div>{errors.name}</div> : null}
                </div>

                <div>
                  <label htmlFor="address">Adreça</label>
                  <Field type="text" name="address" placeholder="Adreça del transportista" />
                  {errors.address && touched.address ? <div>{errors.address}</div> : null}
                </div>

                <div>
                  <label htmlFor="nif">NIF</label>
                  <Field type="text" name="nif" placeholder="NIF del transportista" />
                  {errors.nif && touched.nif ? <div>{errors.nif}</div> : null}
                </div>

                <div>
                  <label htmlFor="phone">Telèfon</label>
                  <Field type="text" name="phone" placeholder="Telèfon del transportista" />
                  {errors.phone && touched.phone ? <div>{errors.phone}</div> : null}
                </div>

                <div>
                  <label htmlFor="email">Email</label>
                  <Field type="email" name="email" placeholder="Email del transportista" />
                  {errors.email && touched.email ? <div>{errors.email}</div> : null}
                </div>

                {/*En la tabla se ve el nom, en el alta y modifficar el id del país */}
                <div>
                  <label htmlFor="state_id">Estat ID</label>
                  <Field type="number" name="state_id" placeholder="ID de l'estat" />
                  {errors.state_id && touched.state_id ? <div>{errors.state_id}</div> : null}
                </div>

                <div>
                  <label htmlFor="province">Província</label>
                  <Field type="text" name="province" placeholder="Província" />
                  {errors.province && touched.province ? <div>{errors.province}</div> : null}
                </div>

                <div>
                  <label htmlFor="city">Ciutat</label>
                  <Field type="text" name="city" placeholder="Ciutat" />
                  {errors.city && touched.city ? <div>{errors.city}</div> : null}
                </div>

                <div>
                  <label htmlFor="cp">Codi Postal</label>
                  <Field type="text" name="cp" placeholder="Codi Postal" />
                  {errors.cp && touched.cp ? <div>{errors.cp}</div> : null}
                </div>

                <div>
                  <Button variant="secondary" onClick={canviEstatModal}>
                    Tancar
                  </Button>
                  <Button variant={tipoModal === 'Modificar' ? 'success' : 'info'} type="submit">
                    {tipoModal}
                    onSubmit={ values => { gravar(values)}} 
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

export default Transportistes;
