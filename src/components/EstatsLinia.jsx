import { useState, useEffect } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud'
import { Button, Modal } from 'react-bootstrap';

const OrderLineReception_StatusSchema = Yup.object().shape({
  name: Yup.string().min(1, "Valor mínim d'1 caràcter.").max(25, 'El valor màxim és de 25 caracters').required('Valor requerit')
})

function OrderLineReception_Status() {

  const [OrdersLineReception_Status, setOrderLineReception_Status] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [tipoModal, setTipoModal] = useState("Crear")
  const [valorsInicials, setValorsInicials] = useState({ name: '' })



  useEffect(async () => {
    const data = await getData(url, "OrderLineReception_Status")
    setOrderLineReception_Status(data)
  }, [])

  const eliminarEstatLinia = (id) => {
    deleteData(url, "OrderLineReception_Status", id)
    const newOrdersLineReception_Status = OrdersLineReception_Status.filter(item => item.id != id)
    setOrderLineReception_Status(newOrdersLineReception_Status)
  }

  const modificarEstatLinia = (valors) => {
    setTipoModal("Modificar")
    setValorsInicials(valors);
  }


  const canviEstatModal = () => {
    setShowModal(!showModal)
  }


  return (
    <>

      <div><h2>Llistat estats de línia d'ordres de recepció</h2></div>
      <Button variant='success' onClick={() => { canviEstatModal(); setTipoModal("Crear") }}>Nou Estat de línia</Button>
      <table>
        <tr>
          <th>Id</th>
          <th>Nom</th>
          <th>Modificar</th>
          <th>Eliminar</th>
        </tr>
        {(OrderLineReception_Status.length == 0) ?
          <div>No hi ha estats</div>
          : OrderLineReception_Status.map((valors) => {
            return (
              <tr key={valors.id}>
                <td>{valors.id}</td>
                <td>{valors.name}</td>
                <td><Button variant="warning" onClick={() => { modificarEstatLinia(valors); canviEstatModal(); }}>Modificar</Button></td>
                <td><Button variant="primary" onClick={() => { eliminarEstatLinia(valors.id) }}>Eliminar</Button></td>

              </tr>)
          })}
      </table>

      <Modal show={showModal} onHide={canviEstatModal}>
        <Modal.Header closeButton >
          <Modal.Title>{tipoModal} Estat de Línia</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <Formik
            initialValues={(tipoModal === 'Modificar' ? valorsInicials : { name: '' })}
            validationSchema={OrderLineReception_StatusSchema}
            onSubmit={values => {
              console.log(values)
              tipoModal === "Crear" ? postData(url, "OrderLineReception_Status", values) : updateId(url, "OrderLineReception_Status", values.id, values)
              canviEstatModal()

            }}
          >
            {({
              values,
              errors,
              touched
              /* and other goodies */
            }) => (
              <Form>
                <div>
                  <label htmlFor='name'>Nom </label>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Nom del producte"
                    autoComplete="off"

                    value={values.name}
                  />
                  {errors.name && touched.name ? <div>{errors.name}</div> : null}
                </div>

                <div>
                  <Button variant="secondary" onClick={canviEstatModal}>Close</Button>

                  <Button variant={tipoModal === "Modificar" ? "success" : "info"} type="submit">{tipoModal}</Button>

                </div>
              </Form>
            )}

          </Formik>

        </Modal.Body>
      </Modal>





    </>
  )
}

export default Productes

