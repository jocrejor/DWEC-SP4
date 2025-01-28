import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { url, postData, getData, deleteData, updateId } from '../../apiAccess/crud';
import { Button, Modal } from 'react-bootstrap';
import Header from '../Header';
import { useNavigate, useParams } from 'react-router-dom';

const ShelfSchema = Yup.object().shape({
    name: Yup.string().min(4, 'Valor mínim de 4 caracters.').max(50, 'El valor màxim és de 50 caracters').required('Valor requerit'),
    storage_id: Yup.string().min(3, 'Valor mínim de 3 caracters.').max(30, 'El valor màxim és de 30 caracters').required('Valor requerit'),
    steet_id: Yup.string().min(3, 'Valor mínim de 3 caracters.').max(30, 'El valor màxim és de 30 caracters').required('Valor requerit'),
});

function Shelf() {
    const [shelfs, setShelf] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [tipoModal, setTipoModal] = useState("Crear");
    const [valorsInicials, setValorsInicials] = useState({ name: '', storage_id: '', steet_id: '' });
    const navigate = useNavigate(); 

    let {magatzem,carrer}= useParams();
    console.log(magatzem,carrer);

    
    useEffect( () => {
        const fetchData = async () => {
            const data = await getData(url, "Shelf")
            setShelf(data)
        }
        fetchData()
    }, [])

    const eliminarShelf = (id) => {
        deleteData(url, "Street", id)
        const newshelfs = shelfs.filter(item => item.id != id)
        setShelf(newshelfs)
    }

    const modificarShelf = (valors) => {
        setTipoModal("Modificar")
        setValorsInicials(valors);
    }


    const canviEstatModal = () => {
        setShowModal(!showModal)
    }

    const handleCarrerClick = (id) => {
        navigate(`../espai/${magatzem}/${carrer}/${id}`); 
      };


    return (
        <>
             <h2>magatzem {magatzem}</h2>
             <h2>carrer {carrer}</h2>
            <Button variant='success' onClick={() => { canviEstatModal(); setTipoModal("Crear"); }}>Alta Estanteria</Button>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nom</th>
                        <th>ID Magatzem</th>
                        <th>ID Carrer</th>
                        <th>Espai</th>
                        <th>Modificar</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {(shelfs.length === 0) ?
                        <tr><td>No hi han estanteries</td></tr>
                        : shelfs.map((valors) => {
                            return (
                                <tr key={valors.id}>
                                    <td>{valors.id}</td>
                                    <td>{valors.name}</td>
                                    <td>{valors.storage_id}</td>
                                    <td>{valors.steet_id}</td>
                                    <td><Button onClick={() => handleCarrerClick(valors.id)}>Espai</Button></td> 
                                    <td><Button variant="warning" onClick={() => modificarShelf(valors)}>Modificar</Button></td>
                                    <td><Button variant="primary" onClick={() => eliminarShelf(valors.id)}>Eliminar</Button></td>
                                </tr>)
                        })}
                </tbody>
            </table>

            <Modal show={showModal} onHide={canviEstatModal}>
                <Modal.Header closeButton >
                    <Modal.Title>{tipoModal} Estanteria</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Formik
                        initialValues={tipoModal === 'Modificar' ? valorsInicials : { name: '', storage_id: '', steet_id: '' }}
                        validationSchema={ShelfSchema}
                        onSubmit={values => {
                            console.log(values)
                            tipoModal === "Crear" ? postData(url, "Shelf", values) : updateId(url, "Shelf", values.id, values)
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
                                    <label htmlFor='steet_id'>ID Carrer</label>
                                    <Field type="text" name="steet_id" placeholder="Id del carrer" autoComplete="off"
                                        value={values.steet_id}
                                    />
                                    {errors.steet_id && touched.steet_id ? <div>{errors.steet_id}</div> : null}
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

export default Shelf;