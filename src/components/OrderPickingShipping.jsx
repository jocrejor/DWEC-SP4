import { useState, useEffect } from "react";
import { Button, Table, Modal } from "react-bootstrap";
import { url, getData } from "../apiAccess/crud";
import { Formik, Form, Field } from "formik";
import Header from "./Header";
import Filtres from "./Filtres";

function OrderPickingShipping() {
  const [orderPickingShipping, setOrderPickingShipping] = useState([]);
  const [orderShipping, setOrderShipping] = useState([]);
  const [orderLineShipping, setOrderLineShipping] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [temporalPickings, setTemporalPickings] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tipoModal, setTipoModal] = useState("Alta");
  const [orderSelected, setOrderSelected] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // const orderPicking = await getData(url, "OrderPickingshipping");
      // setOrderPickingShipping(orderPicking);

      const orderShipping = await getData(url, "OrderShipping");
      setOrderShipping(orderShipping);

      const orderLine = await getData(url, "OrderLineShipping");
      setOrderLineShipping(orderLine);

      const product = await getData(url, "Product");
      setProducts(product);

      const users = await getData(url, "User");
      setUsers(users);

      setCurrentUser(localStorage.getItem("currentUser"));

      const spaces = await getData(url, "Space");
      setSpaces(spaces);

      //recorrer orden Shipping pendent (desempaquetada)
      const orderPendent = orderShipping.filter(
        (order) => order.ordershipping_status_id === 1
      );

      const tempPickings = [];
      orderPendent.map((order) => {
        //recorrer line Shipping de cada orden shipping
        const lines = orderLine.filter(
          (line) => line.shipping_order_id === order.id
        );
        //obtindre product.name, product.quantitat, product.space
        lines.forEach((line) => {
          const space = spaces.find(
            (space) => space.product_id === line.product_id
          );
          if (space) {
            console.log(
              order.id,
              line.id,
              line.product_id,
              line.quantity_received,
              space.storage_id,
              space.street_id,
              space.selft_id,
              space.id
            );
            const objTemporal = {
              order_shipping_id: order.id,
              order_line_shipping_id: line.id,
              product_id: line.product_id,
              quantity: line.quantity,
              storage_id: space.storage_id,
              street_id: space.street_id,
              selft_id: space.selft_id,
              space_id: space.id,
            };
            tempPickings.push(objTemporal);
            setTemporalPickings(tempPickings);
          }
        });
      });
    };
    fetchData();
  }, []);

  const canviEstatModal = () => {
    setShowModal(!showModal);
  };

  const crearOrderPicking = () => {
    const checkboxes = document.querySelectorAll(
      "input[type=checkbox]:checked"
    );
    if (checkboxes.length === 0) {
      alert("Selecciona alguna orden de envio");
    } else {
      const seleccio = [];
      checkboxes.forEach((checkbox) => {
        seleccio.push(checkbox.value);
      });
      setOrderSelected(seleccio);
      canviEstatModal();
      setTipoModal("Alta");
    }
  };

  return (
    <>
      <div>
        <Header title="Order Picking Shipping" />
        <Filtres />
      </div>
      <div>
        <Button
          variant="success"
          onClick={() => {
            crearOrderPicking();
          }}
        >
          Crear Order Picking
        </Button>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID Order</th>
              <th>Producte</th>
              <th>Quantitat</th>
              <th>Magatzem / Carrer / Estantería / Espai</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {temporalPickings.map((temporalPicking) => {
              const product = products.find(
                (p) => p.id === temporalPicking.product_id
              );
              return (
                <tr key={temporalPicking.order_line_shipping_id}>
                  <td>{temporalPicking.order_shipping_id}</td>
                  <td>{product.name}</td>
                  <td>{temporalPicking.quantity}</td>
                  <td>
                    {temporalPicking.storage_id} / {temporalPicking.street_id} /{" "}
                    {temporalPicking.selft_id} / {temporalPicking.space_id}
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      value={temporalPicking.order_line_shipping_id}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={canviEstatModal}>
        <Modal.Header closeButton>
          <Modal.Title>{tipoModal}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Formik
            initialValues={{
              operari: currentUser ? currentUser.id : "", // Establece el valor inicial
            }}
          >
            {({ values }) => (
              <Form>
                <label htmlFor="operari">Operari:</label>
                <Field
                  as="select"
                  name="operari"
                  value={values.operari} // Asegura que el valor corresponda al estado
                >
                  <option value="" disabled>
                    Selecciona un operari
                  </option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </Field>
              </Form>
            )}
          </Formik> */}

          <label htmlFor="operari">Operari:</label>
          <select name="operari" id="operari">
            <option value={currentUser ? currentUser : ""} selected disabled>Operari actual</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Producte</th>
                <th>Quantitat</th>
                <th>Magatzem / Carrer / Estantería / Espai</th>
              </tr>
            </thead>

            <tbody>
              {orderSelected.map((order) => {
                const line = orderLineShipping.find(
                  (line) => line.id === order
                );
                const product = products.find(
                  (product) => product.id === line.product_id
                );
                const space = spaces.find(
                  (space) => space.product_id === line.product_id
                );
                return (
                  <tr key={order}>
                    <td>{product.name}</td>
                    <td>{line.quantity}</td>
                    <td>
                      {space.storage_id} / {space.street_id} / {space.selft_id}{" "}
                      / {space.id}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default OrderPickingShipping;
