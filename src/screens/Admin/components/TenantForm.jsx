import React from 'react'
import { useFormik } from 'formik'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'

const TenantForm = ({ initialValues, onSubmit }) => {
  const formik = useFormik({
    initialValues,
    onSubmit,
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
          value={formik.values.name}
        />
      </FormGroup>
      <Button type="submit">Criar</Button>
    </Form>
  )
}

export default TenantForm
