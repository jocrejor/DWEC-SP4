import { useState, useEffect } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { url, postData, getData, deleteData, updateId } from '../apiAccess/crud'
import { Button, Modal } from 'react-bootstrap';
import Header from './Header';




const ProducteSchema = Yup.object().shape({
  name: Yup.string().min(4, 'Valor mínim de 4 caracters.').max(50, 'El valor màxim és de 60 caracters').required('Valor requerit'),
  description: Yup.string().min(4, 'Valor mínim de 4 caracters.').max(200, 'El valor màxim és de 60 caracters'),
  volume: Yup.number().positive('El valor ha de ser positiu').required('Valor requerit'),
  weight: Yup.number().positive('El valor ha de ser positiu').required('Valor requerit'),
  lotorserial: Yup.string().matches(/(Lot|Serial|Non)/).required('Valor requerit'),
  sku: Yup.string().matches(/^[A-Z0-9]{5,10}$/, 'El SKU ha de tindre alfanumèrics en majúscules i números (5 i 10) ').required('Valor requerit'),
  image_url: Yup.string().url("La url ha de ser correcta")
})

function Productes() {

  const [products, setProducts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [tipoModal, setTipoModal]  = useState("Crear")
  const [valorsInicials, setValorsInicials] = useState({ name: '', description: '', volume: 0, weight: 0, lotorserial: 'Non', sku: '', image_url: '' })
  


  useEffect(async () => {
    const data = await getData(url, "Product")
    setProducts(data)
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

const grabar = async (values)=>{
  if(tipoModal==="Crear"){
    await postData(url,'Product', values)
  }else{
    await updateId(url,'Product',values.id,values)
    }
  const data = await getData(url, "Product")
  await setProducts(data)
  canviEstatModal()
}


  return (
    <>

    <Header title="Productes" />
    <Button variant='success' className="m-2" onClick={()=>{canviEstatModal(); setTipoModal("Crear")}}>Alta Producte</Button>
      <table className="table">
        <thead>
        <tr>
          <th scope="col">Id</th>
          <th scope="col">Nom</th>
          <th scope="col">Descripció</th>
          <th scope="col">Volume</th>
          <th scope="col">Pes</th>
          <th scope="col">Control</th>
          <th scope="col">SKU</th>
          <th scope="col">Modificar</th>
          <th>Eliminar</th>
        </tr>
        </thead>
        <tbody>
        {(products.length == 0)?
          <tr><th>No hi han articles</th></tr>
        :products.map((valors) => {
          return (
          <tr key={valors.id}>
            <td>{valors.id}</td>
            <td>{valors.name}</td>
            <td>{valors.description}</td>
            <td>{valors.volume}</td>
            <td>{valors.weight}</td>
            <td>{valors.lotorserial}</td>
            <td>{valors.sku}</td>
            <td><Button variant="warning"  onClick={()=> {modificarProducte(valors);canviEstatModal(); }}>Modificar</Button></td>
            <td><Button variant="primary"  onClick={()=> {eliminarProducte(valors.id)}}>Eliminar</Button></td>

          </tr>)
        })}
        </tbody>
      </table>

      <Modal show={showModal} onHide={canviEstatModal}>
        <Modal.Header closeButton >
          <Modal.Title>{tipoModal} Producte</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          
      <Formik
        initialValues= {(tipoModal==='Modificar'?valorsInicials: {name: '', description: '', volume: 0, weight: 0, lotorserial: 'Non', sku: '', image_url: '' })}
        validationSchema={ProducteSchema}
        onSubmit={ values => { grabar(values)} }
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

