import { useState, useEffect } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud'
import { Button, Modal } from 'react-bootstrap';

const GestioMagatzemSchema = Yup.object().shape({
  nom: Yup.string().min(4, 'Valor mínim de 4 caracters.').max(50, 'El valor màxim és de 50 caracters').required('Valor requerit'),
  tipus: Yup.string().min(3, 'Valor mínim de 3 caracters.').max(30, 'El valor màxim és de 30 caracters').required('Valor requerit'),
  adreça: Yup.string().min(10, 'Valor mínim de 10 caracters.').max(100, 'El valor màxim és de 100 caracters').required('Valor requerit'),
})

function GestioMagatzem() {

  const [magatzems, setMagatzems] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [tipoModal, setTipoModal]  = useState("Crear")
  const [valorsInicials, setValorsInicials] = useState({ nom: '', tipus: '', adreça: '' })
  
  useEffect(async () => {
    const data = await getData(url, "GestioMagatzem")
    setMagatzems(data)
  }, [])

  const eliminarMagatzem = (id) => {
    deleteData(url, "GestioMagatzem", id)
    const newMagatzems = magatzems.filter(item => item.id != id)
    setMagatzems(newMagatzems)
  }

  const modificarMagatzem = (valors) => {
    setTipoModal("Modificar")
    setValorsInicials(valors)
  }

  const canviEstatModal = () => {
    setShowModal(!showModal)
  }

  const grabar = async (values) => {
    if (tipoModal === "Crear") {
      await postData(url, 'GestioMagatzem', values)
    } else {
      await updateId(url, 'GestioMagatzem', values.id, values)
    }
    const data = await getData(url, "GestioMagatzem")
    setMagatzems(data)
    canviEstatModal()
  }

  return (
    <>
      <div><h2>Llistat de Magatzems</h2></div>
      <Button variant='success' onClick={() => { canviEstatModal(); setTipoModal("Crear") }}>Alta Magatzem</Button>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Nom</th>
            <th scope="col">Tipus</th>
            <th scope="col">Adreça</th>
            <th scope="col">Modificar</th>
            <th scope="col">Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {(magatzems.length === 0) ?
            <tr><th>No hi han magatzems</th></tr>
            : magatzems.map((valors) => {
              return (
                <tr key={valors.id}>
                  <td>{valors.id}</td>
                  <td>{valors.nom}</td>
                  <td>{valors.tipus}</td>
                  <td>{valors.adreça}</td>
                  <td><Button variant="warning" onClick={() => { modificarMagatzem(valors); canviEstatModal(); }}>Modificar</Button></td>
                  <td><Button variant="primary" onClick={() => { eliminarMagatzem(valors.id) }}>Eliminar</Button></td>
                </tr>)
            })}
        </tbody>
      </table>

      <Modal show={showModal} onHide={canviEstatModal}>
        <Modal.Header closeButton >
          <Modal.Title>{tipoModal} Magatzem</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Formik
            initialValues={tipoModal === 'Modificar' ? valorsInicials : { nom: '', tipus: '', adreça: '' }}
            validationSchema={GestioMagatzemSchema}
            onSubmit={values => { grabar(values) }}
          >
            {({
              values,
              errors,
              touched
            }) => (
              <Form>
                <div>
                  <label htmlFor='nom'>Nom </label>
                  <Field
                    type="text"
                    name="nom"
                    placeholder="Nom del magatzem"
                    autoComplete="off"
                    value={values.nom}
                  />
                  {errors.nom && touched.nom ? <div>{errors.nom}</div> : null}
                </div>

                <div>
                  <label htmlFor='tipus'>Tipus </label>
                  <Field
                    type="text"
                    name="tipus"
                    placeholder="Tipus de magatzem"
                    autoComplete="off"
                    value={values.tipus}
                  />
                  {errors.tipus && touched.tipus ? <div>{errors.tipus}</div> : null}
                </div>

                <div>
                  <label htmlFor='adreça'>Adreça </label>
                  <Field
                    type="text"
                    name="adreça"
                    placeholder="Adreça del magatzem"
                    autoComplete="off"
                    value={values.adreça}
                  />
                  {errors.adreça && touched.adreça ? <div>{errors.adreça}</div> : null}
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

export default GestioMagatzem
