import React from 'react'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud'
import { Row, Col, Modal, Table, Button, Tab } from 'react-bootstrap/'
import Header from './Header'
import Inventaris from './Inventaris';




function CompletarInventari() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [inventory, setInventory] = useState([]);
  const [storages, setStorages] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [inventoryLines, setInventoryLines] = useState([]);
  const [products, setProducts] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [selectedInventoryLines, setSelectedInventoryLines] = useState([]);
  const [updatedInventoryLines, setUpdatedInventoryLines] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      const stock = await getData(url, "Inventory");
      const store = await getData(url, "Storage");
      const lines = await getData(url, "InventoryLine");
      const prod = await getData(url, "Product");
      const places = await getData(url, "Space");

      setInventory(stock);
      setStorages(store);
      setInventoryLines(lines);
      setProducts(prod);
      setSpaces(places);

      const inventoryData = stock.find(inventory => inventory.id === id);
      setSelectedInventory(inventoryData);
    }

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
      setSelectedInventoryLines(filteredInventoryLines);
    } else {
      setSelectedInventoryLines([]);
    }
  }, [selectedInventory])


  useEffect(() => {
      console.log(updatedInventoryLines)
      console.log(selectedInventoryLines)
   
    }, [updatedInventoryLines, selectedInventoryLines])


  const handleInputChange = (e)=>{
    const {name, value} = e.target;
    const lineId = name;
    const field = 'justification';
    console.log(value)
    console.log(name)
    setUpdatedInventoryLines((prev) => {
      const index = prev.findIndex((line) => line.id === lineId);

      if(index != -1){
        const updatedLines = [...prev];
        updatedLines[index] = {...updatedLines[index], [field]: value};
        return updatedLines;
      }
      return [
        ...prev, {id: lineId, [field]: value}
      ]
    })
  }


  const handleSubmit = async () => {
    const updatedLines = selectedInventoryLines.map(async (line) => {
      const updatedLine = updatedInventoryLines.find((updated) => updated.id === line.id);

      if(updatedLine){
        line ={...line, justification:updatedLine?.justification}
        console.log(line)
        //await updateId(url, "InventoryLine", line.id, line);
        return line;
      }

      return line;
    })
    setSelectedInventoryLines(updatedLines);

    selectedInventoryLines.map(async (line) => {
      const space = spaces.find((space) => space.id === line.space_id);
      const updatedQuantity = space.quantity - line.real_quantity;
      console.log(space.id + ' : product-id: '+ line.product_id + ' - '+ space.quantity + ' - ' + line.real_quantity + ' = ' + updatedQuantity)

      if(space){
        const updatedSpace = {...space, quantity: updatedQuantity || space.quantity}
        console.log(updatedSpace);
        await updateId(url, 'Space', space.id, updatedSpace)
      };
    })

    const updatedInvetory = {...selectedInventory, inventory_status: 'Completat'}
    console.log(updatedInvetory)
    await updateId(url, 'Inventory', selectedInventory.id, updatedInvetory);

    alert('Inventari completat amb èxit');
    navigate('/inventaris');

  }

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
                          <td>{value.real_quantity}</td>
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
                              <option value="Recompte cíclic" selected>Recompte cíclic</option>
                            </select>

                          </td>
                        </tr>
                      )
                    })
                }
              </tbody>
            </Table>
            <Button variant='secondary' onClick={() => navigate('/inventaris')}>Tornar</Button>
            <Button type="submit" onClick={handleSubmit}>Completar</Button>
          </div>
        </Col>
      </Row>

    </>
  )
}

export default CompletarInventari