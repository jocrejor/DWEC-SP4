import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { url, postData, getData, deleteData, updateId } from "./crud";
import { Button, Table, Modal } from "react-bootstrap";

function OrderPickingReception() {
    const [orderPickingReception, setOrderPickingReception] = useState([]);
    const [orderreception, setOrderReception] = useState([]);
    const [orderLineReception, setOrderLineReception] = useState([]);
    const [products, setProducts] = useState([]);
    const [temporalPickings, setTemporalPickings] = useState([]);
    const [spaces, setSpaces] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [tipoModal, setTipoModal] = useState("Alta");

    const [orderSelected, setOrderSelected] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const orderPicking = await getData(url, "OrderPickingReception");
            setOrderPickingReception(orderPicking);

            const orderReception = await getData(url, "OrderReception");
            setOrderReception(orderReception);

            const orderLine = await getData(url, "OrderLineReception");
            setOrderLineReception(orderLine);

            const product = await getData(url, "Product");
            setProducts(product);

            const spaces = await getData(url, "Space");
            setSpaces(spaces);

            //recorrer orden reception pendent (desempaquetada)
            const orderPendent = orderReception.filter((order) => order.orderreception_status_id === "ceba");

            const tempPickings = [];
            orderPendent.map((order) => {
                //recorrer line reception de cada orden reception
                const lines = orderLine.filter((line) => line.order_reception_id === order.id);
                //obtindre product.name, product.quantitat, product.space
                lines.forEach((line) => {
                    const space = spaces.find((space) => space.product_id === line.product_id);
                    if (space) {
                        console.log(order.id, line.id, line.product_id, line.quantity_received, space.storage_id, space.street_id, space.selft_id, space.id);
                        const objTemporal = {
                            order_reception_id: order.id,
                            order_line_reception_id: line.id,
                            product_id: line.product_id,
                            quantity_received: line.quantity_received,
                            storage_id: space.storage_id,
                            street_id: space.street_id,
                            selft_id: space.selft_id,
                            space_id: space.id
                        }
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
    }

    const crearOrderPickingReception = () => {
        //obtindre els productes seleccionats
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        if (checkboxes.length === 0) {
            alert("No has seleccionat cap producte");
            return;
        } else {
            canviEstatModal();
            setTipoModal("Alta");

            const seleccio = [];
            checkboxes.forEach((checkbox) => {
                seleccio.push(checkbox.value);
            });

            console.log(seleccio);
            setOrderSelected(seleccio);
        }

    }

    return (
        <>
            <div>
                <h2>Llistat Order Reception</h2>
            </div>
            <Button variant="success" onClick={() => {
                crearOrderPickingReception();
            }}>Crear Order Picking</Button>

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
                    {temporalPickings.map(temporalPicking => {
                        const product = products.find(p => p.id === temporalPicking.product_id);
                        return (
                            <tr key={temporalPicking.order_reception_id}>
                                <td>{temporalPicking.order_reception_id}</td>
                                <td>{product.name}</td>
                                <td>{temporalPicking.quantity_received}</td>
                                <td>{temporalPicking.storage_id} / {temporalPicking.street_id} / {temporalPicking.selft_id} / {temporalPicking.space_id}</td>
                                <td><input type="checkbox" value={temporalPicking.order_line_reception_id} /></td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={canviEstatModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{tipoModal}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Producte</th>
                                <th>Quantitat</th>
                                <th>Magatzem / Carrer / Estantería / Espai</th>
                            </tr>
                        </thead>


                        <tbody>
                            {orderSelected.map(order => {
                                const lines = orderLineReception.find(line => line.id === order);
                                const product = products.find(p => p.id === lines.product_id);
                                const space = spaces.find((space) => space.product_id === lines.product_id);
                                return (
                                    <tr key={order}>
                                        <td>{product.name}</td>
                                        <td>{lines.quantity_received}</td>
                                        <td>{space.storage_id} / {space.street_id} / {space.selft_id} / {space.id}</td>
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

export default OrderPickingReception;



