import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Button, Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap'

const EditUserForm = ({ onSubmit, initialValues, roles, isLoading }) => {
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      roles: Yup.array().min(1, 'At least one role is required'),
    }),
    onSubmit: (values) => {
      onSubmit(values)
    },
  })

  return (
    <Form onSubmit={formik.handleSubmit}>
      <FormGroup>
        <Label for="roles">Perfis</Label>
        {isLoading ? (
          <div>Carregando...</div>
        ) : (
          <Input
            id="roles"
            name="roles"
            type="select"
            multiple
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.roles}
            invalid={formik.touched.roles && !!formik.errors.roles}
          >
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.name}
              </option>
            ))}
          </Input>
        )}
        <FormFeedback>{formik.errors.roles}</FormFeedback>
      </FormGroup>
      <Button type="submit" color="primary">
        Alterar Perfis
      </Button>
    </Form>
  )
}

export default EditUserForm
