import { useState, useEffect } from 'react'
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { url,  getData} from './crud'
import { Button,Modal,ModalBody,ModalFooter } from 'react-bootstrap';

function Moviments() {
  const [moviments, setMoviments] = useState([]);
  const [selectedMoviments, setSelectedProduct] = useState(null); 
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (product) => {
    console.log(product); 
    setSelectedProduct(product);
    setShow(true);
};

useEffect(() => {
  getData(url, "Moviment").then(data => {
    const normalizedData = data.map(item => ({
      ...item,
      origin: item.orgin, 
    }));
    setMoviments(normalizedData);
  });
}, []);


  return (
    <>
      <div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Producte</th>
              <th>Magatzem</th>
              <th>Carrer</th>
              <th>Estanteria</th>
              <th>Espai</th>
              <th>Quantitat</th>
              <th>Data</th>
              <th>Operari</th>
              <th>Origen</th>
              <th>Accions</th>
            </tr>
          </thead>
          <tbody>
            {moviments.map((valors) => (
              <tr key={valors.id}>
                <td>{valors.id}</td>
                <td>{valors.product_id}</td>
                <td>{valors.storage_id}</td>
                <td>{valors.street_id}</td>
                <td>{valors.shelf_id}</td>
                <td>{valors.space_id}</td>
                <td>{valors.quantity}</td>
                <td>{valors.date}</td>
                <td>{valors.operator_id}</td>
                <td>{valors.origin}</td>
              
                <td>
                  
          <Button variant="primary"  style={{ cursor: 'pointer' }}
                    onClick={() => handleShow(valors)}  >Visualizar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMoviments ? (
            <div>
              <p><strong>ID </strong> {selectedMoviments.id}</p>
              <p><strong>ID Producto:</strong> {selectedMoviments.product_id}</p>
              <p><strong>Magatzem:</strong> {selectedMoviments.storage_id}</p>
              <p><strong>Carrer:</strong> {selectedMoviments.street_id}</p>
              <p><strong>Estanteria:</strong> {selectedMoviments.shelf_id}</p>
              <p><strong>Espai:</strong> {selectedMoviments.space_id}</p>
              <p><strong>Quantitat:</strong> {selectedMoviments.quantity}</p>
              <p><strong>Data:</strong> {selectedMoviments.date}</p>
              <p><strong>Operari:</strong> {selectedMoviments.operator_id}</p>
              <p><strong>Origen:</strong> {selectedMoviments.orgin}</p>
            </div>
          ) : (
            <p>No hay detalles disponibles.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Moviments


