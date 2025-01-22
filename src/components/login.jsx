import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useFormik } from "formik";
import * as Yup from 'yup';
import {useNavigate} from 'react-router-dom';


const SignupSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too Short!').max(20, 'Too Long!').required('Required'),
});


function Login() {
  // Declara una nueva variable de estado, que llamaremos "count".
  const [error, setError] = useState("");
  const navigate = useNavigate();

  

  const formik = useFormik({
    initialValues: { email: '',password:""},
    onSubmit: values => {
      // 
      const url = "http://node.daw.iesevalorpego.es:3001/User";
      const url2 = "http://localhost:3003/api/login";
      
      fetch(url, {
          method: 'POST',
          body: JSON.stringify(values, null, 2), 
          headers:{
            'Accept': 'application/json, text/plain, */*',  
            'Content-Type': 'application/json'
          },
          mode: 'cors', // no-cors, *cors, same-origin
      }).then(response => response.json())
      .then(data => {
          if(data.error != null){
              console.log(data.error);
              setError(data.error);
          }else{
          console.error("succes",data.data.token);
          //setError("succes" + data.data.token)
          // si tot es correste guardar el token i enviar a areaPresonal 
          localStorage.setItem("tk",JSON.stringify(data.data.token));    
          // enviar a inici
          navigate('/');
      }
      })
      .catch((errorajax) => {
        console.error('Error:', errorajax);
        setError(errorajax)
          
      });
    },
    validationSchema: SignupSchema,
  });

  return (
    <div>
      <h1>Login</h1>
      <div className="text-danger">{error}</div>
      <Form onSubmit={formik.handleSubmit}>
  <Form.Group className="mb-3" >
    <Form.Label htmlFor="email">Correo Electrónico</Form.Label>
    <Form.Control 
         type="email" 
         placeholder="name@example.com" 
         id="email"
         name="email"
         onChange={formik.handleChange}
         onBlur={formik.handleBlur}
         value={formik.values.email}
         
        />
          {formik.touched.email && formik.errors.email ? (
          <div className="text-danger">{formik.errors.email}</div> ) : null}
  </Form.Group>
  <Form.Group className="mb-3">
    <Form.Label>Contraseña</Form.Label>
    <Form.Control
     type="password" 
     id="password"
     name="password"
     onChange={formik.handleChange}
     onBlur={formik.handleBlur}
     value={formik.values.password}
    />
      {formik.touched.password && formik.errors.password ? (
      <div className="text-danger">{formik.errors.password}</div> ) : null} 
  </Form.Group>
  <Form.Group className="mb-3" >
    <Button variant="primary" type="submit"> Enviar </Button>
  </Form.Group>
  
</Form>

    </div>
  );
}
export default Login; 