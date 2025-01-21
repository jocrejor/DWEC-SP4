import { useState, useEffect } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud'
import { Button, Modal } from 'react-bootstrap';
import Header from './Header'

const IncidenciaSchema = Yup.object().shape({
    quantity_received: Yup.number().required('Tens que introduïr una cantitat vàlida').positive().integer(),
    description: Yup.string().min(4, 'Valor mínim de 4 caracters.').max(200, 'El valor màxim és de 60 caracters'),
})

function Incidencies() {

    const [incidents, setIncident]                  = useState([])
    const [products, setProducts]                   = useState([])
    const [orderlineStatus, setOrderlineStatus]     = useState([])
    const [showModal, setShowModal]                 = useState(false)
    const [tipoModal, setTipoModal]                 = useState("Crear")
    const [valorsInicials, setValorsInicials]       = useState({ date_creation: '', description: '', name: ''})

    useEffect(() => {      
        (async () => {
            const dataIncident = await getData(url, "Incident")
            setIncident(dataIncident);          
        })();
        (async () => {
            const dataProduct = await getData(url, "Product")
            setProducts(dataProduct)
        })();
        (async () => {
            const dataOrderlineStatus = await getData(url, "OrderLineReception_Status")
            setOrderlineStatus(dataOrderlineStatus)
        })();
    },  []);

const eliminarIncident = (id) => {
    deleteData(url, "Incident", id) 
    const newIncident = incidents.filter(item => item.id != id)
    setIncident(newIncident)
}

const modificarIncident = (valors) => {
    setTipoModal("Modificar")
    setValorsInicials(valors);
}

const canviEstatModal = () => {
    setShowModal(!showModal)
}

const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : "Producte desconegut";
}

const getStatusName = (statusId) => {
    const status = orderlineStatus.find(s => s.id === statusId);
    return status ? status.name : "Estat desconegut";
}

  return (
    <>
    <Header title="Incidències"/>
    <Button variant='success' onClick={()=>{canviEstatModal(); setTipoModal("Crear")}}>Llistat ordres de recepció</Button>
        <table>
            <tr>
            <th>Data de creació</th>
            <th>Descripció</th>
            <th>Producte</th>
            <th>Unitats demanades</th>
            <th>Unitats rebudes</th>
            <th>Estat</th>
            <th>Modificar</th>
            <th>Eliminar</th>
            </tr>
            {(incidents.length == 0)?
            <div>No hi han articles</div>
            :incidents.map((valors) => {
            return (
            <tr key={valors.id}>
                <td>{valors.created_at}</td>
                <td>{valors.description}</td>
                <td>{getProductName(valors.product)}</td>
                <td>{valors.quantity_ordered}</td>
                <td>{valors.quantity_received}</td>          
                <td>{getStatusName(valors.status)}</td>
                <td><Button variant="warning"  onClick={()=> {modificarIncident(valors);canviEstatModal(); }}>Modificar</Button></td>
                <td><Button variant="primary"  onClick={()=> {eliminarIncident(valors.id)}}>Eliminar</Button></td>
            </tr>)
            })}
        </table>

      <Modal show={showModal} onHide={canviEstatModal}>
        <Modal.Header closeButton >
          <Modal.Title>{tipoModal} Producte</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          
      <Formik
            initialValues= {(tipoModal==='Modificar'?valorsInicials: {quantity_received: '', description: '' })}
            validationSchema={IncidenciaSchema}
            onSubmit={values => {
                console.log(values)
                tipoModal==="Crear"?postData(url,"Incident", values):updateId(url,"Incident",values.id,values)
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
            {/*ID Ordre de Recepció*/}
            <div>
                <label htmlFor='id_ordre_recepcio'>ID Ordre de Recepció</label>
                <Field
                    type="text" 
                    name="id_ordre_recepcio"
                    placeholder="ID ordre de recepció"
                    autoComplete="off"
                    disabled

                    value={values.orderReception_id}
                />
                {errors.name && touched.name ? <div>{errors.name}</div> : null}
            </div>
            {/*Data creació*/}
            <div>
                <label htmlFor='data_creacio'>Data creació</label>
                <Field
                    type="text" 
                    name="data_creacio"
                    placeholder="Data de creació"
                    autoComplete="off"
                    disabled

                    value={values.created_at}
                />
                {errors.name && touched.name ? <div>{errors.name}</div> : null}
            </div>
            {/*Producte*/}
            <div>
                <label htmlFor='name'>Producte</label>
                <Field
                    type="text" 
                    name="product"
                    placeholder="Nom del producte"
                    autoComplete="off"
                    disabled

                    value={getProductName(values.product)}
                />
                {errors.name && touched.name ? <div>{errors.name}</div> : null}
            </div>
            {/*Proveïdor*/}
            <div>
                <label htmlFor='name'>Proveïdor</label>
                <Field
                    type="text" 
                    name="supplier"
                    placeholder="Nom del proveïdor"
                    autoComplete="off"
                    disabled

                    value={values.supplier}
                />
                {errors.name && touched.name ? <div>{errors.name}</div> : null}
            </div>
            {/*Operari*/}
            <div>
                <label htmlFor='name'>Operari</label>
                <Field
                    type="text" 
                    name="operator"
                    placeholder="Operari"
                    autoComplete="off"
                    disabled

                    value={values.operator}
                />
                {errors.name && touched.name ? <div>{errors.name}</div> : null}
            </div>
            {/*Quantitat demanada*/}
            <div>
                <label htmlFor='name'>Quantitat demanada</label>
                <Field
                    type="text" 
                    name="quantity_ordered"
                    placeholder="Quantiat demanada"
                    autoComplete="off"
                    disabled

                    value={values.quantity_ordered}
                />
                {errors.name && touched.name ? <div>{errors.name}</div> : null}
            </div>
            {/*Quantitat rebuda*/}
            <div>
                <label htmlFor='name'>Quantitat rebuda</label>
                <Field
                    type="text" 
                    name="quantity_received"
                    placeholder="Quantitat rebuda"
                    autoComplete="off"

                    value={values.quantity_received}
                />
                {errors.name && touched.name ? <div>{errors.name}</div> : null}
            </div>
            {/*Em senc atacat -- Descripcio*/}
            <div>
                <label htmlFor='description'>Descripció</label>
                <Field
                    as='textarea'
                    type="text"
                    name="description"
                    placeholder="Descripció"
                    autoComplete="off"

                    value={values.description}
                />
                {errors.description && touched.description ? <div>{errors.description}</div> : null}
            </div>

            <div>
            <Button variant="secondary" onClick={canviEstatModal}>Close</Button>

                <Button variant={tipoModal==="Modificar"?"success":"info"} type="submit">{tipoModal}</Button>             
           
            </div>
          </Form>
        )}

      </Formik>
       </Modal.Body>
      </Modal>
    </>
  )
}

export default Incidencies

