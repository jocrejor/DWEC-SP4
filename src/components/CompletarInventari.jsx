import React from 'react'
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud'
import { Row, Col, Modal, Table, Button, Tab } from 'react-bootstrap/'
import Header from './Header'
import Inventaris from './Inventaris';


const CompletarInventariSchema = Yup.object().shape({
  real_quantity: Yup.number().positive('El valor ha de ser positiu').required('Valor requerit'),
  justificacio: Yup.string()
});



function CompletarInventari() {

  const { id } = useParams();

  const [inventory, setInventory] = useState([]);
  const [storages, setStorages] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [inventoryLines, setInventoryLines] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedInventoryLines, setSelectedInventoryLines] = useState([]);


  useEffect(async () => {
    const stock = await getData(url, "Inventory");
    const store = await getData(url, "Storage");
    const lines = await getData(url, "InventoryLine");
    const prod = await getData(url, "Product");

    setInventory(stock);
    setStorages(store);
    setInventoryLines(lines);
    setProducts(prod);

    const inventoryData = stock.find(inventory => inventory.id === id);
    setSelectedInventory(inventoryData);
  }, []);


  useEffect(() => {
    if (selectedInventory) {
      const filteredInventoryLines = inventoryLines.filter(line => line.inventory_id === selectedInventory.id);
      setSelectedInventoryLines(filteredInventoryLines);
    } else {
      setSelectedInventoryLines([]);
    }
  }, [selectedInventory])

  return (
    <>
      <Header title="Completar Inventari" />
      <Row>
        <Col>
          <div className='px-3 py-3'>
            <Table striped bordered hover>
              <thead className='active'>
                <tr>
                  <th className='text-light-blue'>ID Inventari</th>
                  <th className='text-light-blue'>Data</th>
                  <th className='text-light-blue'>Estat</th>
                  <th className='text-light-blue'>Magatzem</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{selectedInventory?.id}</td>
                  <td>{selectedInventory?.date}</td>
                  <td>{selectedInventory?.inventory_status}</td>
                  <td>{(storages.find(storage => storage.id === selectedInventory.storage_id))?.name}</td>
                </tr>
              </tbody>
            </Table>

            <Formik
              initialValues={{real_quantity: 0, justificacio: ''}}
              validationSchema={CompletarInventariSchema}
              onSubmit={values =>{
                console.log(values)
              }}
            >
              {({values, errors, touched}) => (
              <Form>
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
                              <td>
                                <Field
                                  type='number'
                                  name={`inventoryLines.${value.id}.real_quantity`}
                                  step="1"
                                  placeholder='0'
                                  autoComplete='off'
                                  className='form-control'
                                />
                                {errors.real_quantity && touched.real_quantity ? <div>{errors.real_quantity}</div> : null }
                              </td>
                              <td>
                                <Field
                                  as='select'
                                  name={`inventoryLines.${value.id}.justificacio`}
                                  className='form-control'
                                >
                                  <option>Selecciona una opció</option>
                                  <option value="Defectuós">Defectuós</option>
                                  <option value="Trencat">Trencat</option>
                                  <option value="Robatori">Robatori</option>
                                  <option value="Desaparegut">Desaparegut</option>
                                  <option value="Error administratiu">Error administratiu</option>
                                  <option value="Recompte cíclic">Recompte cíclic</option>
                                </Field>
                                {errors.justificacio && touched.justificacio ? <div>{errors.justificacio}</div> : null}
                              </td>
                            </tr>
                          )
                        })
                    }
                  </tbody>
                </Table>
                <Button variant='secondary' to="/inventaris">Tornar</Button>
                <Button>Completar</Button>
              </Form>
              )}
            </Formik>
          </div>
        </Col>
      </Row>

    </>
  )
}

export default CompletarInventari