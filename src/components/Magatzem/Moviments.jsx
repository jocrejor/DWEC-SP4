import { useState, useEffect } from 'react'
import Header from "../Header"
import Filtres from "../Filtres"
import { url,  getData} from '../../apiAccess/crud'
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
   <Header  title="Moviments" />

<Filtres></Filtres>
<div className="table-responsive " style={{ marginTop: 70 }}>
  <table className="table table-bordered">
    <thead className="thead-light">
      <tr>
        <th className="d-none d-md-table-cell">ID</th>
        <th className="d-none d-md-table-cell">Producte</th>
        <th className="d-none d-md-table-cell">Magatzem</th>
        <th className="d-none d-md-table-cell">Carrer</th>
        <th className="d-none d-md-table-cell">Estanteria</th>
        <th className="d-none d-md-table-cell">Espai</th>
        <th className="d-none d-md-table-cell">Quantitat</th>
        <th className="d-none d-md-table-cell">Data</th>
        <th className="d-none d-md-table-cell">Operari</th>
        <th className="d-none d-md-table-cell">Origen</th>
        <th className="d-none d-md-table-cell">Accion</th>
      </tr>
    </thead>
    <tbody>
      {moviments.map((valors) => (
        <tr 
          key={valors.id} 
          className="d-block d-md-table-row mb-3" 
          style={{ border: "1px solid #dee2e6" }}
        >
          <td className="d-block d-md-table-cell">
            <strong className="d-sm-inline d-md-none">ID:</strong> {valors.id}
          </td>
          <td className="d-block d-md-table-cell">
            <strong className="d-sm-inline d-md-none">Producte:</strong> {valors.product_id}
          </td>
          <td className="d-block d-md-table-cell">
            <strong className="d-sm-inline d-md-none">Magatzem:</strong> {valors.storage_id}
          </td>
          <td className="d-block d-md-table-cell">
            <strong className="d-sm-inline d-md-none">Carrer:</strong> {valors.street_id}
          </td>
          <td className="d-block d-md-table-cell">
            <strong className="d-sm-inline d-md-none">Estanteria:</strong> {valors.shelf_id}
          </td>
          <td className="d-block d-md-table-cell">
            <strong className="d-sm-inline d-md-none">Espai:</strong> {valors.space_id}
          </td>
          <td className="d-block d-md-table-cell">
            <strong className="d-sm-inline d-md-none">Quantitat:</strong> {valors.quantity}
          </td>
          <td className="d-block d-md-table-cell">
            <strong className="d-sm-inline d-md-none">Data:</strong> {valors.date}
          </td>
          <td className="d-block d-md-table-cell">
            <strong className="d-sm-inline d-md-none">Operari:</strong> {valors.operator_id}
          </td>
          <td className="d-block d-md-table-cell ">
            <strong className="d-sm-inline d-md-none ">Origen:</strong> {valors.orgin}
          </td>
          <td className="d-block d-md-table-cell">
            <strong className="d-sm-inline d-md-none">Accion:</strong>
            <Button
              variant="primary"
              style={{ cursor: 'pointer' }}
              onClick={() => handleShow(valors)}
            >
              Visualizar
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


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