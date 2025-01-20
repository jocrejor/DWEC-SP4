import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud';
import { Button, Modal, Table, Spinner } from 'react-bootstrap';

const OrderReceptionSchema = Yup.object().shape({
  supplier_id: Yup.number().required('Proveïdor requerit'),
  estimated_reception_date: Yup.date().required('Data estimada requerida'),
  OrderLineReception: Yup.string().min(1, "Valor mínim d'1 caràcter.").max(25, 'El valor màxim és de 25 caràcters.').required('Estat requerit'),
});

function OrderReception() {
  const [orderReceptions, setOrderReceptions] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [products, setProducts] = useState([]); // Llista de productes disponibles
  const [selectedProducts, setSelectedProducts] = useState([]); // Llista de productes afegits amb quantitat
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [tipoModal, setTipoModal] = useState('Crear');
  const [valorsInicials, setValorsInicials] = useState({
    supplier_id: '',
    estimated_reception_date: '',
    OrderLineReception: '',
  });
  const [error, setError] = useState(null);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [orders, suppliersData, statusesData, productsData] = await Promise.all([
        getData(url, 'OrderReception'),
        getData(url, 'Supplier'),
        getData(url, 'OrderReception_Status'),
        getData(url, 'Product'),
      ]);
      setOrderReceptions(orders);
      setSuppliers(suppliersData);
      setStatuses(statusesData);
      setProducts(productsData);
      setError(null);
    } catch (err) {
      setError('Error carregant les dades.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const eliminarOrdre = async (id) => {
    if (window.confirm('Estàs segur que vols eliminar aquesta ordre?')) {
      try {
        await deleteData(url, 'OrderReception', id);
        setOrderReceptions((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        setError("Error eliminant l'ordre.");
      }
    }
  };

  const modificarOrdre = (valors) => {
    setTipoModal('Modificar');
    setValorsInicials(valors);
    setSelectedProducts(valors.products || []); // Assignar productes existents si n'hi ha
    setShowModal(true);
  };

  const canviEstatModal = () => {
    setShowModal(!showModal);
    setSelectedProducts([]); // Reiniciar la llista de productes seleccionats
    setProductId('');
    setQuantity('');
  };

  const afegirProducte = () => {
    if (!productId || !quantity || isNaN(quantity) || quantity <= 0) {
      alert('Selecciona un producte vàlid i una quantitat positiva!');
      return;
    }

    // Trobar el producte per ID
    const product = products.find((p) => p.id === parseInt(productId));
    if (!product) {
      alert('Producte no trobat!');
      return;
    }

    // Afegir el producte a la llista de productes seleccionats
    setSelectedProducts((prev) => [
      ...prev,
      { product_id: product.id, name: product.name, quantity: parseInt(quantity) },
    ]);

    // Reiniciar els camps de producte i quantitat
    setProductId('');
    setQuantity('');
  };

  const eliminarProducte = (index) => {
    setSelectedProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values) => {
    try {
      const dataToSend = { ...values, products: selectedProducts };
      if (tipoModal === 'Crear') {
        await postData(url, 'OrderReception', dataToSend);
      } else {
        await updateId(url, 'OrderReception', values.id, dataToSend);
      }
      await fetchInitialData();
      canviEstatModal();
      setError(null);
    } catch (err) {
      setError("Error en l'operació.");
    }
  };

  return (
    <>
      <div>
        <h2>Llistat Ordres de Recepció</h2>
      </div>
      <Button
        variant="success"
        onClick={() => {
          setTipoModal('Crear');
          setValorsInicials({
            supplier_id: '',
            estimated_reception_date: '',
            OrderLineReception: '',
          });
          canviEstatModal();
        }}
      >
        Nova Ordre de Recepció
      </Button>
      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <div>{error}</div>
      ) : orderReceptions.length === 0 ? (
        <div>No hi ha ordres</div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Proveïdor</th>
              <th>Data Estimada</th>
              <th>Estat</th>
              <th>Modificar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {orderReceptions.map((valors) => (
              <tr key={valors.id}>
                <td>{valors.id}</td>
                <td>{suppliers.find((sup) => sup.id === valors.supplier_id)?.name}</td>
                <td>{valors.estimated_reception_date}</td>
                <td>{statuses.find((status) => status.id === valors.OrderLineReception)?.name}</td>
                <td>
                  <Button variant="warning" onClick={() => modificarOrdre(valors)}>
                    Modificar
                  </Button>
                </td>
                <td>
                  <Button variant="primary" onClick={() => eliminarOrdre(valors.id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Modal show={showModal} onHide={canviEstatModal}>
        <Modal.Header closeButton>
          <Modal.Title>{tipoModal} Ordre de Recepció</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={valorsInicials}
            validationSchema={OrderReceptionSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <div>
                  <label htmlFor="supplier_id">Proveïdor</label>
                  <Field as="select" id="supplier_id" name="supplier_id">
                    <option value="">Selecciona un proveïdor</option>
                    {suppliers.map((sup) => (
                      <option key={sup.id} value={sup.id}>
                        {sup.name}
                      </option>
                    ))}
                  </Field>
                  {errors.supplier_id && touched.supplier_id && (
                    <div>{errors.supplier_id}</div>
                  )}
                </div>
                <div>
                  <label htmlFor="estimated_reception_date">Data Estimada</label>
                  <Field
                    id="estimated_reception_date"
                    type="date"
                    name="estimated_reception_date"
                  />
                  {errors.estimated_reception_date &&
                    touched.estimated_reception_date && (
                      <div>{errors.estimated_reception_date}</div>
                    )}
                </div>
                <div>
                  <label htmlFor="OrderLineReception">Estat</label>
                  <Field as="select" id="OrderLineReception" name="OrderLineReception">
                    <option value="">Selecciona un estat</option>
                    {statuses.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>
                    ))}
                  </Field>
                  {errors.OrderLineReception && touched.OrderLineReception && (
                    <div>{errors.OrderLineReception}</div>
                  )}
                </div>
                <div>
                  <label htmlFor="product">Producte</label>
                  <Field
                    as="select"
                    id="Product"
                    name="Product"
                    onChange={(e) => setProductId(e.target.value)}
                  >
                    <option value="">Selecciona un Producte</option>
                    {products.map((Product) => (
                      <option key={Product.id} value={Product.id}>
                        {Product.name}
                      </option>
                    ))}
                  </Field>
                </div>
                <div>
                  <label htmlFor="quantity">Quantitat</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                  />
                </div>
                <button type="button" onClick={afegirProducte}>
                  Afegir Producte
                </button>
                <div>
                  <h4>Productes Afegits</h4>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Producte</th>
                        <th>Quantitat</th>
                        <th>Eliminar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProducts.map((prod, index) => (
                        <tr key={index}>
                          <td>{prod.name}</td>
                          <td>{prod.quantity}</td>
                          <td>
                            <button onClick={() => eliminarProducte(index)}>Eliminar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <Button variant="primary" type="submit">
                  {tipoModal === 'Crear' ? 'Crear' : 'Modificar'}
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default OrderReception;
