import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap'
import { useRole } from '../../../store/admin/useRole'

const RoleForm = ({ initialValues, onSubmit }) => {
  const { data: permissions, isLoading, isError } = useRole().listPermissions()

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    permissions: Yup.array().min(1, 'At least one permission is required'),
  })

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {
        onSubmit(values)
        actions.setSubmitting(false)
      }}
    >
      {({ handleSubmit, isSubmitting, setFieldValue, values }) => (
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="name">Nome</Label>
            <Field
              name="name"
              type="text"
              as={Input}
              invalid={!!ErrorMessage.name}
            />
            <ErrorMessage
              name="name"
              component={FormFeedback}
              className="d-block"
            />
          </FormGroup>
          <FormGroup>
            <Label for="permissions">Permissões</Label>
            {isLoading ? (
              <p>Carregando permissões...</p>
            ) : isError ? (
              <p>Error carregando permissões.</p>
            ) : (
              <Field
                name="permissions"
                as="select"
                multiple
                className="form-control"
                style={{ height: '300px' }} // Increase the height of the select box
                onChange={(event) => {
                  const options = event.target.options
                  let value = []
                  for (let i = 0, l = options.length; i < l; i++) {
                    if (options[i].selected) {
                      value.push(options[i].value)
                    }
                  }
                  setFieldValue('permissions', value)
                }}
                value={values.permissions}
              >
                {permissions.map((permission) => (
                  <option key={permission._id} value={permission._id}>
                    {permission.name}
                  </option>
                ))}
              </Field>
            )}
            <ErrorMessage
              name="permissions"
              component={FormFeedback}
              className="d-block"
            />
          </FormGroup>
          <Button type="submit" color="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Criar Perfil'}
          </Button>
        </Form>
      )}
    </Formik>
  )
}

export default RoleForm
