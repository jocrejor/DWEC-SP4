import React from 'react'
import { useState, useEffect } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud'
import { Row, Col, Modal, Table, Button } from 'react-bootstrap/'

const InventorySchema = Yup.object().shape({
  inventor: Yup.string().required,
  street_id: Yup.string().required
});

function Inventaris() {
  const [inventory, setInventory] = useState([]);
  const [storages, setStorages] = useState([]);

  useEffect(async () => {
    const stock = await getData(url, "Inventory");
    const store = await getData(url, "Storage");

    setInventory(stock);
    setStorages(store);
  }, []);


    //********* MODAL *********
  
    const handleClose     = () => {
      setCurrentProduct(null);
      setShowModal(false)
    };
    const handleShow      = () => setShowModal(true); 

  return (
    <>
      <Row>
        <Col>
          <div className='px-3 pt-3'>
            <Button className='mb-3'>Crear</Button>
            {/**<Modal show={showModal} onHide={handleClose} animation={true}>
              <Modal.Header closeButton>
                <Modal.Title>{}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Formik
                  initialValues={{inventory_id:'', street_id:''}}
                  validationSchema={InventorySchema}
                  onSubmit={values => {
                    console.log(values);
                  }}
                >
                  {({values, errors, touched})}
                  <Form>
                    <div>
                      <label htmlFor="">Magatzem:</label>
                    </div>
                  </Form>
                </Formik>
              </Modal.Body>
            </Modal>*/}

            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" name="" id="" />
                  </th>
                  <th>ID</th>
                  <th>Data</th>
                  <th>Estat</th>
                  <th>Magatzem</th>
                  <th>Inventariar</th>
                  <th>Accions</th>
                </tr>
              </thead>
              <tbody>
                {
                  (inventory.length === 0) ?
                    <div>No hay nada</div>
                    : inventory.map((values) => {
                      return (
                        <tr key={values.id}>
                          <td>
                            <input type="checkbox" name="" id="" />
                          </td>
                          <td>{values.id}</td>
                          <td>{values.date}</td>
                          <td>{values.inventory_status}</td>
                          <td>{(storages.find(storage => storage.id === values.storage_id)).name}</td>
                          <td>
                            {
                              (values.inventory_status === 'Pendent') ?
                                <a href="">Inventariar</a> :
                                (values.inventory_status === 'Fent-se') ?
                                  <a href="">Completar</a> :
                                  ""
                            }
                          </td>
                          <td>
                            <Button>Editar</Button>
                            <Button>Eliminar</Button>
                          </td>
                        </tr>
                      )
                    })
                }

              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default Inventaris
