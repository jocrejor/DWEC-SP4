import React from 'react'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { url, updateId, getData } from '../apiAccess/crud'
import { Row, Col, Modal, Table, Button, Tab } from 'react-bootstrap/'
import Header from './Header'



function Inventariar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inventory, setInventory] = useState([]);
  const [storages, setStorages] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [inventoryLines, setInventoryLines] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedInventoryLines, setSelectedInventoryLines] = useState([]);
  const [updatedInventoryLines, setUpdatedInventoryLines] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
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
    };

    fetchData();
  }, []);


  useEffect(() => {
    if (selectedInventory) {
      const filteredInventoryLines = inventoryLines.filter(line =>
        line.inventory_id === selectedInventory.id &&
        line.quantity_estimated != line.real_quantity &&
        products.some((product) => product.id === line.product_id));

      const orderedInventoryLines = filteredInventoryLines.sort((a, b) => {
        if (a.street_id < b.street_id) return -1;
        if (a.street_id > b.street_id) return 1;

        if (a.selft < b.selft_id) return -1;
        if (a.selft_id > b.selft_id) return 1;

        if (a.space_id < b.space_id) return -1;
        if (a.space_id > b.space_id) return 1;

        return 0;

      })

      setSelectedInventoryLines(orderedInventoryLines);

    } else {
      setSelectedInventoryLines([]);
    }
  }, [selectedInventory])

  useEffect(() => {
    console.log(updatedInventoryLines)
    console.log(selectedInventoryLines)

  }, [updatedInventoryLines, selectedInventoryLines])

  const handleInputChange = (e) => {
    console.log(e)
    console.log(e.target.name)
    const { name, value, type } = e.target;
    const lineId = name;
    const newValue = value;
    const field = type === 'number' ? 'real_quantity' : 'justification';

    console.log(field + ' - ' + value + ' - ' + type)
    console.log(field)

    /*setUpdatedInventoryLines((prev) => ({
      ...prev, [name]: { ...prev[name], [field]: value }
    }))*/

    setUpdatedInventoryLines((prev) => {
      const index = prev.findIndex((line) => line.id === lineId);
      if (index != -1) {
        const updatedLines = [...prev];
        updatedLines[index] = { ...updatedLines[index], [field]: type === 'number' ? parseInt(newValue) : newValue };
        return updatedLines;
      }

      return [
        ...prev, { id: lineId, [field]: newValue }
      ]
    })

  }

  const handleSubmit = () => {
    if (updatedInventoryLines != selectedInventory) {
      alert("Introdueix totes les quantitats reals");
    } else {
      const updatedLines = selectedInventoryLines.map(async (line) => {
        const updatedLine = updatedInventoryLines.find((updated) => updated.id === line.id);

        if (updatedLine) {
          line = { ...line, real_quantity: updatedLine?.real_quantity, justification: updatedLine?.justification };
          await updateId(url, "InventoryLine", line.id, line);
          return line;
        }
        return line;
      })

      setSelectedInventoryLines(updatedLines);
    }
    //console.log(updatedLines);
    //console.log(selectedInventoryLines)

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
                            <input
                              type='number'
                              name={value.id}
                              step="1"
                              placeholder='0'
                              className='form-control'
                              value={value.real_quantity}
                              onChange={handleInputChange}
                            />
                          </td>
                          <td>
                            <select
                              name={value.id}
                              className='form-select'
                              onChange={handleInputChange}
                              value={value.justification}
                            >
                              <option>Selecciona una opció</option>
                              <option value="Defectuós">Defectuós</option>
                              <option value="Trencat">Trencat</option>
                              <option value="Robatori">Robatori</option>
                              <option value="Desaparegut">Desaparegut</option>
                              <option value="Error administratiu">Error administratiu</option>
                              <option value="Recompte cíclic">Recompte cíclic</option>
                            </select>
                          </td>
                        </tr>)
                    })
                }
              </tbody>

            </Table>
            <Button variant='secondary' onClick={() => navigate('/inventaris')}>Tornar</Button>
            <Button onClick={handleSubmit}>Inventariar</Button>

          </div>
        </Col>
      </Row >
    </>
  )
}

export default Inventariar
/*className='text-decoration-none text-orange cursor-pointer'*/