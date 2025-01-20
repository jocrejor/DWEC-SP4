import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { url, postData, getData, deleteData, updateId } from "./crud";
import { Button, Table, Modal } from "react-bootstrap";

function OrderPickingReception() {
    const [orderPickingReception, setOrderPickingReception] = useState([]);
    const [orderreception, setOrderReception] = useState([]);
    const [orderLineReception, setOrderLineReception] = useState([]);
    const [filteredLines, setFilteredLines] = useState([]);
    const [products, setProducts] = useState([]);
    const [temporalPickings, setTemporalPickings] = useState([]);
    const [spaces, setSpaces] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [tipoModal, setTipoModal] = useState("Alta");

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
            orderPendent.map((order) => {
                //recorrer line reception de cada orden reception
                const lines = orderLine.filter((line) => line.order_reception_id === order.id);
                //obtindre product.name, product.quantitat, product.space
                lines.map((line) => {
                    const space = spaces.find((space) => space.product_id === line.product_id);
                });
            });
        };
        fetchData();
    }, []);


    const canviEstatModal = () => {
        setShowModal(!showModal);
    }

    const filtrarLineReception = (id) => {
        const lineReception = orderLineReception.filter((line) => line.order_reception_id === id);
        setFilteredLines(lineReception);
    } 

    return (
        <>
            <div>
                <h2>Llistat Order Picking Reception</h2>
            </div>
            <Button variant="success" onClick={() => {
                canviEstatModal();
                setTipoModal("Alta")
            }}>Alta Producte</Button>

            <Table striped bordered hover>
                <thead>
                    <th>ID</th>
                    <th>Data Creació</th>
                    <th>Visualitzar</th>
                </thead>

                <tbody>
                    {orderreception.map(order => {
                        return (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.estimated_reception_date}</td>
                                <td>
                                    <button className='btn btn-danger' onClick={() => {
                                        setTipoModal("Visualitzar");
                                        canviEstatModal();
                                        filtrarLineReception(order.id);
                                    }}>Visualitzar</button>
                                </td>
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
                    {tipoModal === "Alta" ? (
                        <>
                        <Table striped bordered hover>
                        <thead>
                            <th></th>
                            <th>Producte</th>
                            <th>Quantitat</th>
                            <th>Ubicació</th>
                        </thead>

                        <tbody>
                            
                            {products.map(product => {
                                return (
                                    
                                    <tr key={product.id}>
                                        <td><input type="checkbox" /></td>
                                        <td>{product.name}</td>
                                        <td>Quantitat</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                    <Formik>
                        <Form>
                            <Button variant='secondary' onClick={canviEstatModal}>Tancar</Button>

                            <Button variant='danger'>Crear</Button>
                        </Form>
                    </Formik>
                    </>
                    ) : (
                        <>
                        {filteredLines.length > 0 ? (
                            <Table striped bordered hover>
                                <thead>
                                    <th>Producte</th>
                                    <th>Quantitat</th>
                                </thead>

                                <tbody>
                                    {filteredLines.map(line => {
                                        const product = products.find(product => product.id === line.product_id);
                                        return (
                                            <tr key={line.id}>
                                                <td>{product.name}</td>
                                                <td>{line.quantity_received}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        ) : (
                            <h3>No hi ha productes</h3>
                        )}
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
}


export default OrderPickingReception;



