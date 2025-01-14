import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { Button, Table, Modal } from "react-bootstrap";
import { url, getData, postData, deleteData } from "../apiAccess/crud";

function OrderPickingShipping() {
  const [ships, setShips] = useState([]);
  const [show, setShow] = useState(false);
  const [lines, setLines] = useState([]);
  const [tipoModal, setTipoModal] = useState();
  const [shipToShow, setShipToShow] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderPicking = await getData(url, "OrderPickingshipping");
        setShips(orderPicking);
        const lineas = await getData(url, "OrderLineShipping");
        setLines(lineas);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleModal = () => {
    setShow(!show);
  };

  const eliminarPicking = (id) => {
    deleteData(url, "OrderPickingshipping", id);
    const newShips = ships.filter((ship) => ship.id !== id);
    setShips(newShips);
  };

  const createOrderPicking = (values) => {
    values.create_date = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    );
    postData(url, "OrderPickingshipping", values);
  };

  const showShip = (shipToShow) => {
    if (shipToShow) {
      const selectedShip = ships.find((ship) => ship.id == shipToShow);
      return selectedShip.pickingList.map((pick) => (
        <tr key={pick}>
          <td>{pick}</td>
        </tr>
      ));
    }
  };

  return (
    <>
      <h1>Order Picking Ships</h1>
      <Button
        variant="success"
        onClick={() => {
          setTipoModal("Alta");
          handleModal();
        }}
      >
        Alta Orden
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Data Creació</th>
            <th>Ver</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {ships.map((ship) => {
            return (
              <tr key={ship.id}>
                <td>{ship.id}</td>
                <td>{ship.create_date}</td>
                <td>
                  <Button
                    onClick={() => {
                      setTipoModal("Ver");
                      setShipToShow(ship.id);
                      handleModal();
                    }}
                  >
                    Ver
                  </Button>
                </td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => {
                      eliminarPicking(ship.id);
                    }}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleModal}>
        <Modal.Header closeButton>
          <Modal.Title>{tipoModal} Order Picking Ship</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              pickingList: [],
            }}
            onSubmit={(values) => {
              console.log(lines);
              console.log(values);
              createOrderPicking(values);
              handleModal();
            }}
          >
            <Form>
              <Table>
                <thead>
                  <tr>
                    <th>Sel.</th>
                    <th>Prducte</th>
                    <th>Quantitat</th>
                    <th>Id Ordre</th>
                  </tr>
                </thead>
                <tbody>
                  {tipoModal === "Alta"
                    ? lines.map((line) => (
                        <tr key={line.id}>
                          <td>
                            <Field
                              type="checkbox"
                              name="pickingList"
                              value={line.id}
                            />
                          </td>
                          <td>{line.product_id}</td>
                          <td>{line.quantity}</td>
                          <td>{line.shipping_order_id}</td>
                        </tr>
                      ))
                    : showShip(shipToShow)}
                </tbody>
              </Table>
              <div>
                <Button variant="secondary" onClick={handleModal}>
                  Close
                </Button>
                {tipoModal === "Alta" && (
                  <Button variant="success" type="submit">
                    Alta
                  </Button>
                )}
              </div>
            </Form>
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default OrderPickingShipping;
