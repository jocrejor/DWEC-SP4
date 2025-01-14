import { useState, useEffect } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud'
import { Button, Modal } from 'react-bootstrap';

const ProducteSchema = Yup.object().shape({
  supplier_name: Yup.string().min(4, 'Valor mínim de 4 caracters.').max(50, 'El valor màxim és de 60 caracters').required('Valor requerit'),
  estimated_reception_date: Yup.date().required('El valor màxim és de 60 caracters'),
  volume: Yup.number().positive('El valor ha de ser positiu').required('Valor requerit'),
  weight: Yup.number().positive('El valor ha de ser positiu').required('Valor requerit'),
  lotorserial: Yup.string().matches(/(Lot|Serial|Non)/).required('Valor requerit'),
  sku: Yup.string().matches(/^[A-Z0-9]{5,10}$/, 'El SKU ha de tindre alfanumèrics en majúscules i números (5 i 10) ').required('Valor requerit'),
  image_url: Yup.string().url("La url ha de ser correcta")
})

function Productes() {

  const [orderReception, setOrderReception] = useState([])
  const [supplier, setSupplier] = useState([])
  const [orderReception_status, setOrderReception_status] = useState([])
  
  const [showModal, setShowModal] = useState(false)
  const [tipoModal, setTipoModal]  = useState("Crear")
  const [valorsInicials, setValorsInicials] = useState({ name: '', description: '', volume: 0, weight: 0, lotorserial: 'Non', sku: '', image_url: '' })
  


  useEffect(async () => {
    let data = await getData(url, "orderReception")
    setOrderReception(data)
    data = await getData(url, "supplier")
    setSupplier(data)
    data = await getData(url, "orderReception_status")
    setOrderReception_status(data)
  }, [])

const eliminarProducte = (id) =>{
  deleteData(url, "Product", id) 
  const newproducts = products.filter(item => item.id != id)
  setProducts(newproducts)
}

const modificarProducte = (valors) =>{
 setTipoModal("Modificar")
 setValorsInicials(valors);
}


const canviEstatModal = () =>{
    setShowModal(!showModal)
}


  return (
    <>

<div><h2>Llistat Ordres de Recepció</h2></div>
    <Button variant='success' onClick={()=>{canviEstatModal(); setTipoModal("Crear")}}>Nova Ordre</Button>
      <table>
        <tr>
          <th>Id</th>
          <th>Proveïdor</th>
          <th>Data estimada</th>
          <th>Estat</th>
          <th>Modificar</th>
          <th>Eliminar</th>
        </tr>
        {(products.length == 0)?
          <div>No hi ha ordres</div>
        :products.map((valors) => {
          return (
          <tr key={valors.id}>
            <td>{valors.id}</td>
            <td>{valors.supplier_id}</td>
            <td>{valors.estimated_reception_date}</td>
            <td>{valors.status}</td>
            <td><Button variant="warning"  onClick={()=> {modificarProducte(valors);canviEstatModal(); }}>Modificar</Button></td>
            <td><Button variant="primary"  onClick={()=> {eliminarProducte(valors.id)}}>Eliminar</Button></td>

          </tr>)
        })}
      </table>

      <Modal show={showModal} onHide={canviEstatModal}>
        <Modal.Header closeButton >
          <Modal.Title>{tipoModal} Ordre de Recepció</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          
      <Formik
        initialValues= {(tipoModal==='Modificar'?valorsInicials: {name: '', description: '', volume: 0, weight: 0, lotorserial: 'Non', sku: '', image_url: '' })}
        validationSchema={ProducteSchema}
        onSubmit={values => {
          console.log(values)
          tipoModal==="Crear"?postData(url,"Product", values):updateId(url,"Product",values.id,values)  
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
            {/*Em senc atacat*/}
            <div>
              <label htmlFor='description'>Descripció </label>
              <Field
                as='textarea'
                type="text"
                name="description"
                placeholder="Descripció del producte"
                autoComplete="off"

                value={values.description}
              />
              {errors.description && touched.description ? <div>{errors.description}</div> : null}
            </div>

            <div>
              <label htmlFor='volume'>Volumen </label>
              <Field
                type="number"
                name="volume"
                step="0.001"
                placeholder="0"
                autoComplete="off"

                value={values.volume}
              />
              {errors.volume && touched.volume ? <div>{errors.volume}</div> : null}
            </div>



            <div>
              <label htmlFor='weight'>Pes </label>
              <Field
                type="number"
                name="weight"
                step="1"
                placeholder="0"
                autoComplete="off"

                value={values.weight}
              />
              {errors.weight && touched.weight ? <div>{errors.weight}</div> : null}
            </div>

            <div>
              <label htmlFor='lotorserial'>Control lot o serie</label>
              <Field
                as="select"
                name="lotorserial"
              >
                <option value="">
                  Selecciona una opció
                </option>
                <option value="Non">
                  No
                </option>
                <option value="Lot">
                  Lot
                </option>
                <option value="Serial">
                  Serie
                </option>
              </Field>

              {errors.lotorserial && touched.lotorserial ? <div>{errors.lotorserial}</div> : null}
            </div>

            <div>
              <label htmlFor='sku'>SKU </label>
              <Field
                type="text"
                name="sku"
                placeholder="sku del producte"
                autocomplete="off"

                value={values.sku}
              />
              {errors.sku && touched.sku ? <div>{errors.sku}</div> : null}
            </div>
            <div>
              <label htmlFor='image_url'>url de la imatge </label>
              <Field
                type="text"
                name="image_url"
                placeholder="url de la imatge del producte"
                autoComplete="off"

                value={values.image_url}
              />
              {errors.image_url && touched.image_url ? <div>{errors.image_url}</div> : null}
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

export default Productes

