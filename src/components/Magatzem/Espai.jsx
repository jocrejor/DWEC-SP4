import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { url, postData, getData, deleteData, updateId } from '../../apiAccess/crud';
import { Button, Modal } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const SpaceSchema = Yup.object().shape({
    name: Yup.string().min(4, 'Valor mínim de 4 caracters.').max(50, 'El valor màxim és de 50 caracters').required('Valor requerit'),
    product_id: Yup.string().min(3, 'Valor mínim de 3 caracters.').max(30, 'El valor màxim és de 30 caracters').required('Valor requerit'),
    quantity: Yup.number().positive('El valor ha de ser positiu').required('Valor requerit'),
    maxVol: Yup.number().positive('El valor ha de ser positiu').required('Valor requerit'),
    maxWeight: Yup.number().positive('El valor ha de ser positiu').required('Valor requerit'),
    storage_id: Yup.string().min(3, 'Valor mínim de 3 caracters.').max(30, 'El valor màxim és de 30 caracters').required('Valor requerit'),
    steet_id: Yup.string().min(3, 'Valor mínim de 3 caracters.').max(30, 'El valor màxim és de 30 caracters').required('Valor requerit'),
    selft_id: Yup.string().min(3, 'Valor mínim de 3 caracters.').max(30, 'El valor màxim és de 30 caracters').required('Valor requerit'),
});

function Space() {
    const [spaces, setSpace] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [tipoModal, setTipoModal] = useState("Crear");
    const [valorsInicials, setValorsInicials] = useState({ name: '', product_id: '', quantity: '', maxVol:'', maxWeight: '', storage_id: '', street_id: '', selft_id: '' });

     const {magatzem,carrer,estanteria}= useParams();


    useEffect( () => {
        const fetchData = async () => {
        const data = await getData(url, "Space")
        setSpace(data)
        }
        fetchData()
    }, [])

    const eliminarSpace = (id) => {
        deleteData(url, "Space", id)
        const newshelfs = spaces.filter(item => item.id != id)
        setSpace(newshelfs)
    }

    const modificarSpace = (valors) => {
        setTipoModal("Modificar")
        setValorsInicials(valors);
    }


    const canviEstatModal = () => {
        setShowModal(!showModal)
    }

    return (
        <>
              <h2>magatzem {magatzem}</h2>
              <h2>carrer {carrer}</h2>
              <h2>estanteria {estanteria} </h2>
            <Button variant='success' onClick={() => { canviEstatModal(); setTipoModal("Crear"); }}>Alta Espai</Button>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nom</th>
                        <th>Id Producte</th>
                        <th>Quantitat</th>
                        <th>Volumen</th>
                        <th>Pes</th>
                        <th>ID Magatzem</th>
                        <th>ID Carrer</th>
                        <th>ID Estanteria</th>
                        <th>Modificar</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {(spaces.length === 0) ?
                        <tr><td>No hi han espais</td></tr>
                        : spaces.map((valors) => {
                            return (
                                <tr key={valors.id}>
                                    <td>{valors.id}</td>
                                    <td>{valors.name}</td>
                                    <td>{valors.product_id}</td>
                                    <td>{valors.quantity}</td>
                                    <td>{valors.maxVol}</td>
                                    <td>{valors.maxWeight}</td>
                                    <td>{valors.storage_id}</td>
                                    <td>{valors.street_id}</td>
                                    <td>{valors.selft_id}</td>
                                    <td><Button variant="warning" onClick={() => modificarSpace(valors)}>Modificar</Button></td>
                                    <td><Button variant="primary" onClick={() => eliminarSpace(valors.id)}>Eliminar</Button></td>
                                </tr>)
                        })}
                </tbody>
            </table>

            <Modal show={showModal} onHide={canviEstatModal}>
                <Modal.Header closeButton >
                    <Modal.Title>{tipoModal} Espai</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Formik
                        initialValues={tipoModal === 'Modificar' ? valorsInicials : { name: '', product_id: '', quantity: '', maxVol: '', maxWeight: '', storage_id: '', street_id: '', selft_id: '' }}
                        validationSchema={SpaceSchema}
                        onSubmit={values => {
                            console.log(values)
                            tipoModal === "Crear" ? postData(url, "Space", values) : updateId(url, "Space", values.id, values)
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
                                    <label htmlFor='product_id'>ID Prodcute</label>
                                    <Field type="text" name="product_id" placeholder="Id del producte" autoComplete="off"
                                        value={values.product_id}
                                    />
                                    {errors.product_id && touched.product_id ? <div>{errors.product_id}</div> : null}
                                </div>

                                <div>
                                    <label htmlFor='quantity'>Quantitat</label>
                                    <Field type="number" name="quantity" step="40" placeholder="Quantitat" autoComplete="off"
                                        value={values.quantity}
                                    />
                                    {errors.quantity && touched.quantity ? <div>{errors.quantity}</div> : null}
                                </div>

                                <div>
                                    <label htmlFor='maxVol'>Volum</label>
                                    <Field type="number" name="maxVol" step="40" placeholder="Volumen" autoComplete="off"
                                        value={values.maxVol}
                                    />
                                    {errors.maxVol && touched.maxVol ? <div>{errors.maxVol}</div> : null}
                                </div>

                                <div>
                                    <label htmlFor='maxWeight'>Pes</label>
                                    <Field type="number" name="maxWeight" step="40" placeholder="Pes" autoComplete="off"
                                        value={values.maxWeight}
                                    />
                                    {errors.maxWeight && touched.maxWeight ? <div>{errors.maxWeight}</div> : null}
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
                                    <Field type="text" name="street_id" placeholder="Id del carrer" autoComplete="off"
                                        value={values.street_id}
                                    />
                                    {errors.stestreet_idet_id && touched.street_id ? <div>{errors.street_id}</div> : null}
                                </div>

                                <div>
                                    <label htmlFor='selft_id'>ID Esatnteria</label>
                                    <Field type="text" name="selft_id" placeholder="Id de la estanteria" autoComplete="off"
                                        value={values.selft_id}
                                    />
                                    {errors.selft_id && touched.selft_id ? <div>{errors.selft_id}</div> : null}
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

export default Space;