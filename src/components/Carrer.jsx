import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud';
import { Button, Modal } from 'react-bootstrap';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

const StreetSchema = Yup.object().shape({
    name: Yup.string().min(4, 'Valor mínim de 4 caracters.').max(50, 'El valor màxim és de 50 caracters').required('Valor requerit'),
    storage_id: Yup.string().min(3, 'Valor mínim de 3 caracters.').max(30, 'El valor màxim és de 30 caracters').required('Valor requerit'),

});

function Street() {
    const [streets, setStreet] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [tipoModal, setTipoModal] = useState("Crear");
    const [valorsInicials, setValorsInicials] = useState({ name: '', storage_id: ''});
    const navigate = useNavigate(); 

    useEffect(async () => {
        const data = await getData(url, "Street")
        setStreet(data)
    }, [])

    const eliminarStreet = (id) => {
        deleteData(url, "Street", id)
        const newstreets = streets.filter(item => item.id != id)
        setStreet(newstreets)
    }

    const modificarStreet = (valors) => {
        setTipoModal("Modificar")
        setValorsInicials(valors);
    }


    const canviEstatModal = () => {
        setShowModal(!showModal)
    }

    const handleCarrerClick = (id) => {
        navigate(`/estanteria/${id}`); 
      };

    return (
        <>
            <Header title="Gestió Magatzem"/>
            <Button variant='success' onClick={() => { canviEstatModal(); setTipoModal("Crear"); }}>Alta Carrer</Button>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nom</th>
                        <th>ID Magatzem</th>
                        <th>Estanteria</th>
                        <th>Modificar</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {(streets.length === 0) ?
                        <tr><td>No hi han carrers</td></tr>
                        : streets.map((valors) => {
                            return (
                                <tr key={valors.id}>
                                    <td>{valors.id}</td>
                                    <td>{valors.name}</td>
                                    <td>{valors.storage_id}</td>
                                    <td><Button onClick={() => handleCarrerClick(valors.id)}>Estanteria</Button></td> 
                                    <td><Button variant="warning" onClick={() => modificarStreet(valors)}>Modificar</Button></td>
                                    <td><Button variant="primary" onClick={() => eliminarStreet(valors.id)}>Eliminar</Button></td>
                                </tr>)
                        })}
                </tbody>
            </table>

            <Modal show={showModal} onHide={canviEstatModal}>
                <Modal.Header closeButton >
                    <Modal.Title>{tipoModal} Carrer</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Formik
                        initialValues={tipoModal === 'Modificar' ? valorsInicials : { name: '', storage_id: '' }}
                        validationSchema={StreetSchema}
                        onSubmit={values => {
                            console.log(values)
                            tipoModal === "Crear" ? postData(url, "Street", values) : updateId(url, "Street", values.id, values)
                            canviEstatModal()

                        }}
                    >
                        {({ values, errors, touched }) => (
                            <Form>
                                <div>
                                    <label htmlFor='name'>Nom</label>
                                    <Field type="text" name="name" placeholder="Nom del magatzem" autoComplete="off"
                                        value={values.name}
                                    />
                                    {errors.name && touched.name ? <div>{errors.name}</div> : null}
                                </div>

                                <div>
                                    <label htmlFor='storage_id'>ID Magatzem</label>
                                    <Field type="text" name="storage_id" placeholder="Id del magatzem" autoComplete="off"
                                        value={values.storage_id}
                                    />
                                    {errors.storage_id && touched.storage_id ? <div>{errors.storage_id}</div> : null}
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

export default Street;