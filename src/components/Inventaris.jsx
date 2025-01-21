import React from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud'
import { Row, Col, Modal, Table, Button, Tab } from 'react-bootstrap/'
import Header from './Header'
import Filtres from './Filtres'

const InventorySchema = Yup.object().shape({
  storage_id: Yup.string().required('Required'),
  street_id: Yup.string()
});

function Inventaris() {
  const [inventory, setInventory] = useState([]);
  const [storages, setStorages] = useState([]);
  const [streets, setStreets] = useState([]);
  const [selectedStoragerId, setSelectedStorageId] = useState('');
  const [availableStreets, setAvailableStreets] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [modalType, setModalType] = useState('Iventariar');
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [inventoryLines, setInventoryLines] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedInventoryLines, setSelectedInventoryLines] = useState([]);

  const {id} = useParams();

  useEffect(async () => {
    const stock = await getData(url, "Inventory");
    const store = await getData(url, "Storage");
    const street = await getData(url, "Street");
    const space = await getData(url, "Space");
    const lines = await getData(url, "InventoryLine");
    const prod = await getData(url, "Product");

    setInventory(stock);
    setStorages(store);
    setStreets(street);
    setSpaces(space);
    setInventoryLines(lines);
    setProducts(prod);
  }, []);

  useEffect(() => {
    if (selectedStoragerId) {
      const filteredStreets = streets.filter(street => street.storage_id === selectedStoragerId);
      setAvailableStreets(filteredStreets);
    } else {
      setAvailableStreets([]);
    }
  }, [selectedStoragerId, streets]);


  useEffect(() => {
    if (selectedInventory) {
      console.log("HOLA")
      const filteredInventoryLines = inventoryLines.filter(line => line.inventory_id === selectedInventory.id);
      setSelectedInventoryLines(filteredInventoryLines);
    } else {
      setSelectedInventoryLines([]);
    }
  }, [selectedInventory])
  /**************** CREAR INVENTARIO ****************/
  const createInventory = async (values) => {
    console.log(values);
    let filteredSpaces;
    if (!values.street_id) {
      filteredSpaces = spaces.filter(space => space.storage_id === values.storage_id);
    } else {
      filteredSpaces = spaces.filter(space => space.storage_id === values.street_id)
    };

    let dataInventory = new Date().toLocaleString('es-ES');

    let newInventory = {
      date: dataInventory,
      created_by: 1,
      inventory_status: "Pendent",
      storage_id: values.storage_id
    }

    let inventoryUploaded = await postData(url, "Inventory", newInventory);

    filteredSpaces.map(space => {
      let newInventoryLine = {
        inventory_id: inventoryUploaded.id,
        product_id: space.product_id,
        quantity_estimated: space.quantity,
        storage_id: space.storage_id,
        street_id: space.street_id,
        selft_id: space.selft_id,
        space_id: space.id
      }
      console.log(newInventoryLine)
      postData(url, "InventoryLine", newInventoryLine)
    });
  }

  /************* ELIMINAR INVENTARIO ***************/
  const deleteInventory = (id) => {
    if (confirm("¿Estàs segur de que vols esborrar aquest inventari?")) {
      deleteData(url, 'Inventory', id)
      const newInventory = inventory.filter(item => item.id != id);
      setInventory(newInventory);
    }
  }

  const displayInventoryModal = (values) => {
    setSelectedInventory(values);
    console.log(values.id)
    // const filteredInventoryLines = inventoryLines.filter(line => line.inventory_id === values.id);
    // setInventoryLines(filteredInventoryLines);

    changeModalStatus();
  }

  //********* MODAL *********
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false)
  };

  const handleShow = () => setShow(true);

  const changeModalStatus = () => {
    setShowInventoryModal(!showInventoryModal);
  }

  return (
    <>
      <Header title='Inventaris'></Header>
      <Filtres />
      <Row>
        <Col>                                          <input type="number" name="" id="" />


          <div className='px-3 pt-3'>
            <Button variant='secondary' className='mb-3' onClick={handleShow}>Crear</Button>

            <Modal show={show} onHide={handleClose} animation={true} >
              <Modal.Header closeButton>
                <Modal.Title className='text-light-blue'>Alta de Inventari</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Formik
                  initialValues={{ storage_id: '', street_id: '' }}
                  validationSchema={InventorySchema}
                  onSubmit={values => {
                    createInventory(values);
                    handleClose();
                  }}
                >
                  {({ errors, touched, setFieldValue }) => (
                    <Form>
                      <div>
                        <label htmlFor="storage_" className='py-3 text-light-blue'>Magatzem:</label>
                        <Field
                          as='select'
                          name='storage_id'
                          className='form-control'
                          onChange={(e) => {
                            setSelectedStorageId(e.target.value);
                            setFieldValue('storage_id', e.target.value);
                          }}
                        >
                          <option value=''>Selecciona un magatzem</option>
                          {
                            storages.map((storage) => {
                              return (
                                <option key={storage.id} value={storage.id}>{storage.name}</option>
                              );
                            })
                          }
                        </Field>
                        {errors.storage_id && touched.storage_id ? <div>{errors.storage_id}</div> : null}
                      </div>
                      <div>
                        <label htmlFor="street_" className='py-3 text-light-blue'>Carrer:</label>
                        <Field
                          as='select'
                          name='street_id'
                          className='form-control'

                        >
                          <option value=''>Selecciona un carrer</option>
                          {
                            availableStreets.map((street) => {
                              return (
                                <option key={street.id} value={street.id} >{street.name}</option>
                              );
                            })
                          }
                        </Field>
                        {errors.street_id && touched.street_id ? <div>{errors.street_id}</div> : null}
                      </div>

                      <div className='py-3 text-end'>
                        <Button variant='secondary' onClick={changeModalStatus}>Cerrar</Button>
                        <Button type='submit' className='ms-2 orange-button'>Generar Inventari</Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </Modal.Body>
            </Modal>

            <Table striped bordered hover>
              <thead>
                <tr >
                  <th>
                    <input type="checkbox" name="" id="" className='form-check-input' />
                  </th>
                  <th className='text-light-blue'>ID</th>
                  <th className='text-light-blue'>Data</th>
                  <th className='text-light-blue'>Estat</th>
                  <th className='text-light-blue'>Magatzem</th>
                  <th className='text-light-blue'>Inventariar</th>
                  <th className='text-light-blue'>Accions</th>
                </tr>
              </thead>
              <tbody className='text-light-blue'>
                {
                  (inventory.length === 0) ?
                    <tr><td colSpan={6}>No hay nada</td></tr>
                    : inventory.map((values) => {
                      return (
                        <tr key={values.id}>
                          <td>
                            <input type="checkbox" className='form-check-input' name="" id="" />
                          </td>
                          <td>{values.id}</td>
                          <td>{values.date}</td>
                          <td>{values.inventory_status}</td>
                          <td>{(storages.find(storage => storage.id === values.storage_id)).name}</td>
                          <td>
                            {
                              (values.inventory_status === 'Pendent') ?
                                <a className='text-decoration-none text-orange cursor-pointer' onClick={() => {<Navigate to='/inventariar/'/>} }>Inventariar</a> :
                                (values.inventory_status === 'Fent-se') ?
                                  <a className='text-decoration-none text-orange cursor-pointer' onClick={() => { displayInventoryModal(values); setModalType('Completar') }}>Completar</a> :
                                  ""
                            }
                          </td>
                          <td>
                            <Button variant='link' onClick={() => { changeModalStatus(); setModalType('Detall') }}><i className="bi bi-eye text-light-blue"></i></Button>
                            <Button variant='link' onClick={() => deleteInventory(values.id)}><i className="bi bi-trash text-light-blue"></i></Button>
                          </td>
                        </tr>
                      )
                    })
                }

              </tbody>
            </Table>

            <Modal show={showInventoryModal} onHide={changeModalStatus} animation={true} size='xl'>
              <Modal.Header closeButton>
                <Modal.Title className='text-light-blue'>{modalType} Inventari</Modal.Title>
              </Modal.Header>
              <Modal.Body>


                {selectedInventory && (
                  <>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th className='text-light-blue'>ID Inventari</th>
                          <th className='text-light-blue'>Data</th>
                          <th className='text-light-blue'>Estat</th>
                          <th className='text-light-blue'>Magatzem</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{selectedInventory.id}</td>
                          <td>{selectedInventory.date}</td>
                          <td>{selectedInventory.inventory_status}</td>
                          <td>{(storages.find(storage => storage.id === selectedInventory.storage_id)).name}</td>
                        </tr>
                      </tbody>
                    </Table>

                    {
                      ((modalType === 'Completar') ?
                        <Table>
                          <thead>
                            <tr>
                              <th scope="col" className='text-light-blue'>Producte</th>
                              <th scope="col" className='text-light-blue'>Quantitat Estimada</th>
                              <th scope="col" className='text-light-blue'>Quantitat Real</th>
                              <th scope="col" className='text-light-blue'>Justificació</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              (selectedInventoryLines.length === 0) ?
                                <tr><td colSpan={4} className='text-center'>No hay nada</td></tr> :
                                selectedInventoryLines.map((value) => {
              
                                  return (
                                    <tr key={value.id}>
                                      <td>{(products.find(product => product.id === value.product_id))?.name}</td>
                                      <td>{value.quantity_estimated}</td>
                                      <td>cantidad real</td>
                                      <td>justificacion</td>
                                      <td></td>
                                    </tr>
                                  )
                                })

                            }

                          </tbody>
                        </Table>
                        :
                        <Table>
                          <thead>
                            <tr>
                              <th scope="col" className='text-light-blue'>Carrer</th>
                              <th scope="col" className='text-light-blue'>Estanteria</th>
                              <th scope="col" className='text-light-blue'>Espacio</th>
                              <th scope="col" className='text-light-blue'>Producte</th>
                              <th scope="col" className='text-light-blue'>Quantitat Real</th>
                            </tr>
                          </thead>
                          <tbody>


                            {
                              (selectedInventoryLines.length === 0) ?
                                <tr><td colSpan={5} className='text-center'>No hay nada</td></tr> :
                                selectedInventoryLines.map((value) => {
                                  return (
                                    <tr key={value.id}>
                                      <td>{value.street_id}</td>
                                      <td>{value.selft_id}</td>
                                      <td>{value.space_id}</td>
                                      <td>{(products.find(product => product.id === value.product_id))?.name}</td>
                                      <td></td>
                                    </tr>)
                                })
                            }
                          </tbody>

                        </Table>
                      )}

                  </>
                )}

                <div className='py-3 text-end'>
                  <Button variant='secondary' onClick={() => changeModalStatus()}>Cerrar</Button>
                  {
                    ((modalType === 'Inventariar' || modalType === 'Completar') ? <Button type='submit' className='ms-2 orange-button'>{modalType}</Button> : "")

                  }
                </div>

              </Modal.Body>
            </Modal>
          </div>
        </Col>
      </Row >
    </>
  )
}

export default Inventaris
