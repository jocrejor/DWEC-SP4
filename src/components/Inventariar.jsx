import React from 'react'
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { url, updateId, getData } from '../apiAccess/crud'
import { Row, Col, Modal, Table, Button, Tab } from 'react-bootstrap/'
import Header from './Header'

const InventariarSchema = Yup.object().shape({
  real_quantity: Yup.number('Introduce sols números').positive('El valor ha de ser positiu').required('Valor requerit')
});


function Inventariar() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const initialValues = ()=> {
    selectedInventoryLines.map((line) => {
      real_quantity : 0;
    })
  }

  return (
    <>
      <Header title="Inventariar Inventari" />
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
              initialValues= {initialValues()}
              validationSchema={InventariarSchema}
              onSubmit={values => {
                console.log(values.name)
                
              }}>
              {({ values, errors, touched }) => (
                <Form>
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
                                <td>
                                  <Field
                                    type='number'
                                    name={`inventoryLines.${value.id}.real_quantity`}
                                    step="1"
                                    placeholder='0'
                                    autoComplete='off'
                                    className='form-control'
                                  />
                                  {errors.real_quantity && touched.real_quantity ? <div>{errors.real_quantity}</div> : null}
                                </td>
                              </tr>)
                          })
                      }
                    </tbody>

                  </Table>
                  <Button variant='secondary' onClick={() => navigate('/inventaris')}>Tornar</Button>
                  <Button>Inventariar</Button>
                </Form>
              )}
            </Formik>

          </div>
        </Col>
      </Row >
    </>
  )
}

export default Inventariar
/*className='text-decoration-none text-orange cursor-pointer'*/