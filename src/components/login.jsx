import React, { useState, useEffect,useContext } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useFormik } from "formik";
import * as Yup from 'yup';
import {useNavigate} from 'react-router';
import { url, getData } from '../apiAccess/crud';
import Header from './Header';
import { UserContext } from '../contextData/UserContext';

const SignupSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too Short!').max(20, 'Too Long!').required('Required'),
});


function Login() {
  // Declara una nueva variable de estado, que llamaremos "count".
  const [error, setError] = useState("");
  const [users,setUsers] = useState({});
  const navigate = useNavigate();

  const { login } = useContext(UserContext)
  
  useEffect ( async ()=>{
      const data = await getData(url,"User")
      setUsers(data)
  },[])


  const formik = useFormik({
    initialValues: { email: '',password:''},
    onSubmit: values => {
      
       //setSubmitting(false); // Reactivar el botó d'enviament
      //Comprobar si esisteix l'email i la contrasenya aamb els usuaris regitrats 
        const usuariRegistrat =  users.find(users => users.email === values.email && users.password === values.password);
        if (usuariRegistrat === undefined)
           {
              setError("Email  o password incorrecte")
           } else {
            delete usuariRegistrat.password;
            login(usuariRegistrat)
            //localStorage.setItem("usuariActiu",JSON.stringify(usuariRegistrat))
            //console.log(usuariRegistrat)
          // enviar a inici
          //navigate('/');
        }
  
      
    },
    validationSchema: SignupSchema,
  });

  return (
    <div>
      <Header title="Login" ></Header>
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