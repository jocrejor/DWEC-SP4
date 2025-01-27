import { useState, useEffect } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud'
import { Button, Modal } from 'react-bootstrap';
import Header from './Header'

const IncidenciaSchema = Yup.object().shape({
    //Aso es té que llevar quan estiga ben fet, es soles un formulari de alta de prova perque Crespo no m'ha explicat on és fa l'alta i quins camps tinc que posar
    product:            Yup.string().min(4, 'Valor mínim de 4 caracters.').max(50, 'El valor màxim és de 60 caracters').required('Valor requerit'),
    supplier:           Yup.string().min(1, 'Valor mínim de 1 caracter.').max(50, 'El valor màxim és de 60 caracters').required('Valor requerit'),
    operator:           Yup.string().min(1, 'Valor mínim de 1 caracter.').max(50, 'El valor màxim és de 60 caracters').required('Valor requerit'),
    quantity_ordered:   Yup.number().positive().integer().required('Tens que introduïr una cantitat vàlida'),
    created_at:         Yup.date().min('2024/01/22', 'No pot ser abans del 22 de gener del 2024').max('2025/01/23').required("Introdueïx una data vàlida", 'No pot ser després del 23 de gener del 2025'),

    //Estos dos camos eb teoria están be per a quan modifiquem la incidència
    quantity_received: Yup.number().positive().integer().required('Tens que introduïr una cantitat vàlida'),
    description: Yup.string().min(4, 'Valor mínim de 4 caracters.').max(200, 'El valor màxim és de 60 caracters')
})

function Incidencies() {

    const [incidents, setIncident]                  = useState([])
    const [products, setProducts]                   = useState([])
    const [orderlineStatus, setOrderlineStatus]     = useState([])
    const [showModal, setShowModal]                 = useState(false)
    const [tipoModal, setTipoModal]                 = useState("Crear")
    const [valorsInicials, setValorsInicials]       = useState({
        product: '',
        quantity_received: '',
        description: '',
        supplier: '',
        operator: '',
        quantity_ordered: '',
        created_at: ''
    });

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
          <Modal.Title>{tipoModal} Incidència</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          
      <Formik
            initialValues= {(tipoModal==='Modificar'?valorsInicials: {product: '', quantity_received: '', description: '', supplier: '', operator: '', quantity_ordered: '', created_at: '', orderReception_id: '', })}
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
                {errors.orderReception_id && touched.orderReception_id ? <div>{errors.orderReception_id}</div> : null}
            </div>
            {/*Data creació*/}
            <div>
                <label htmlFor='created_at'>Data creació</label>
                <Field
                    type="date" 
                    name="created_at"
                    placeholder="Data de creació"
                    autoComplete="off"
                    disabled={tipoModal === "Modificar"}

                    value={values.created_at}
                />
                {errors.created_at && touched.created_at ? <div>{errors.created_at}</div> : null}
            </div>
            {/*Producte*/}
            <div>
                <label htmlFor='product'>Producte</label>
                <Field
                    type="text" 
                    name="product"
                    placeholder="Nom del producte"
                    autoComplete="off"
                    disabled={tipoModal === "Modificar"}

                    value={tipoModal === "Modificar" ? getProductName(values.product) : values.product}
                />
                {/*{errors.getProductName(values.product) && touched.getProductName(values.product) ? <div>{errors.getProductName(values.product)}</div> : null}*/}
                {errors.product && touched.product ? <div>{errors.product}</div> : null}
            </div>
            {/*Proveïdor*/}
            <div>
                <label htmlFor='name'>Proveïdor</label>
                <Field
                    type="text" 
                    name="supplier"
                    placeholder="Nom del proveïdor"
                    autoComplete="off"
                    disabled={tipoModal === "Modificar"}

                    value={values.supplier}
                />
                {errors.supplier && touched.supplier ? <div>{errors.supplier}</div> : null}
            </div>
            {/*Operari*/}
            <div>
                <label htmlFor='name'>Operari</label>
                <Field
                    type="text" 
                    name="operator"
                    placeholder="Operari"
                    autoComplete="off"
                    disabled={tipoModal === "Modificar"}

                    value={values.operator}
                />
                {errors.operator && touched.operator ? <div>{errors.operator}</div> : null}
            </div>
            {/*Quantitat demanada*/}
            <div>
                <label htmlFor='name'>Quantitat demanada</label>
                <Field
                    type="text" 
                    name="quantity_ordered"
                    placeholder="Quantiat demanada"
                    autoComplete="off"
                    disabled={tipoModal === "Modificar"}

                    value={values.quantity_ordered}
                />
                {errors.quantity_ordered && touched.quantity_ordered ? <div>{errors.quantity_ordered}</div> : null}
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
                {errors.quantity_received && touched.quantity_received ? <div>{errors.quantity_received}</div> : null}
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

