import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const SignupSchema = Yup.object().shape({
  email: Yup.string().email('Correo electrónico inválido').required('Campo obligatorio'),
  password: Yup.string().min(6, 'Demasiado corta').max(20, 'Demasiado larga').required('Campo obligatorio'),
});

function Login() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: SignupSchema,
    onSubmit: (values) => {
      const url = "https://api.dwes.iesevalorpego.es/users"; 

      fetch(url, {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error en la autenticación.');
          }
          return response.json();
        })
        .then((data) => {
          if (data.token) {
            localStorage.setItem('token', data.token);

            navigate('/transportistes');
          } else {
            throw new Error('Token no recibido. Verifique el servidor.');
          }
        })
        .catch((errorAjax) => {
          console.error('Error:', errorAjax);
          setError(errorAjax.message || 'Error al iniciar sesión');
        });
    },
  });

  return (
    <div>
      <h1>Login</h1>
      {error && <div className="text-danger">{error}</div>}
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group className="mb-3">
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
            <div className="text-danger">{formik.errors.email}</div>
          ) : null}
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
            <div className="text-danger">{formik.errors.password}</div>
          ) : null}
        </Form.Group>
        <Form.Group className="mb-3">
          <Button variant="primary" type="submit">Enviar</Button>
        </Form.Group>
      </Form>
    </div>
  );
}

export default Login;
