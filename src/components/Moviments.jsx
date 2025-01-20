import { useState, useEffect } from 'react'
import Header from './header'
import { url,  getData} from '../apiAccess/crud'
import { Button,Modal,ModalBody,ModalFooter } from 'react-bootstrap';

function Moviments() {
  const [moviments, setMoviments] = useState([]);
  const [selectMoviments, setSelectedMoviment] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (product) => {
    console.log(product);
    setSelectedMoviment(product);
    setShow(true);
};

useEffect(() => {
  getData(url, "Moviment").then(data => {
    const canviorigin = data.map(item => ({
      ...item,
    }));
    setMoviments(canviorigin);
  });
}, []);

  return (
    <>
      <div>
        <table style={{ marginLeft: 350 }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>ID del Producte</th>
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
                <td>{valors.orgin}</td>
                <td>
          <Button variant="primary"  style={{ cursor: 'pointer' }}
                    onClick={() => handleShow(valors)} >Visualizar </Button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Detalls del Moviment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectMoviments ? (
            <div>
              <p><strong>ID </strong> {selectMoviments.id}</p>
              <p><strong>ID Producto:</strong> {selectMoviments.product_id}</p>
              <p><strong>Magatzem:</strong> {selectMoviments.storage_id}</p>
              <p><strong>Carrer:</strong> {selectMoviments.street_id}</p>
              <p><strong>Estanteria:</strong> {selectMoviments.shelf_id}</p>
              <p><strong>Espai:</strong> {selectMoviments.space_id}</p>
              <p><strong>Quantitat:</strong> {selectMoviments.quantity}</p>
              <p><strong>Data:</strong> {selectMoviments.date}</p>
              <p><strong>Operari:</strong> {selectMoviments.operator_id}</p>
              <p><strong>Origen:</strong> {selectMoviments.orgin}</p>
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