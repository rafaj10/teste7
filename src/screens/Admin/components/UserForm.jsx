import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Button, Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap'

const UserForm = ({ onSubmit, initialValues }) => {
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      name: Yup.string().required('Nome é obrigatório'),
      email: Yup.string()
        .email('Email inválido')
        .required('Email é obrigatório'),
      password: Yup.string().required('Senha é obrigatória'),
    }),
    onSubmit: (values) => {
      onSubmit(values)
    },
  })

  return (
    <Form onSubmit={formik.handleSubmit}>
      <FormGroup>
        <Label for="name">Nome</Label>
        <Input
          id="name"
          name="name"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          invalid={formik.touched.name && !!formik.errors.name}
        />
        <FormFeedback>{formik.errors.name}</FormFeedback>
      </FormGroup>
      <FormGroup>
        <Label for="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          invalid={formik.touched.email && !!formik.errors.email}
        />
        <FormFeedback>{formik.errors.email}</FormFeedback>
      </FormGroup>
      <FormGroup>
        <Label for="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          invalid={formik.touched.password && !!formik.errors.password}
        />
        <FormFeedback>{formik.errors.password}</FormFeedback>
      </FormGroup>
      <Button type="submit" color="primary">
        Criar Usuário
      </Button>
    </Form>
  )
}

export default UserForm
