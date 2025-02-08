import React, { useState, useEffect } from 'react'
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from 'reactstrap'

// Formik Validation
import * as Yup from 'yup'
import { useFormik } from 'formik'

// Import React Query hook
import { useProfile } from '../../store/profile/useProfile'

//Import Breadcrumb
import Breadcrumb from '../../components/Common/Breadcrumb'

// Import avatar image
import avatar from '../../assets/images/users/avatar-2.jpg'

const UserProfile = () => {
  // Meta title
  document.title = 'Perfil do Usuário | 7stratos'

  const [user, setUser] = useState({})

  // Hook para alterar a senha
  const { changePassword } = useProfile()
  const mutation = changePassword()

  useEffect(() => {
    if (localStorage.getItem('user')) {
      const obj = JSON.parse(localStorage.getItem('user'))
      setUser(obj)
    }
  }, [])

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required('Por favor, insira sua senha atual'),
      newPassword: Yup.string()
        .required('Por favor, insira a nova senha')
        .min(6, 'A senha deve ter pelo menos 6 caracteres'),
      confirmNewPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'As senhas não coincidem')
        .required('Por favor, confirme a nova senha'),
    }),
    onSubmit: (values, { resetForm }) => {
      mutation.mutate({
        password: values.currentPassword,
        newPassword: values.newPassword,
      })
      resetForm()
    },
  })

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumb title="7stratos" breadcrumbItem="Perfil do Usuário" />

          <Row>
            <Col lg="12">
              {mutation.isError && (
                <Alert color="danger">
                  {mutation.error?.response?.data?.message || 'Erro ao alterar a senha'}
                </Alert>
              )}
              {mutation.isSuccess && (
                <Alert color="success">
                  Senha alterada com sucesso!
                </Alert>
              )}

              <Card>
                <CardBody>
                  <div className="d-flex">
                    {/* <div className="ms-3">
                      <img
                        src={avatar}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div> */}
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>{user.name}</h5>
                        <p className="mb-1">{user.email}</p>
                        {/* <p className="mb-0">Perfil: {user.role}</p> */}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-4">Alterar Senha</h4>

          <Card>
            <CardBody>
              <Form
                className="form-horizontal"
                onSubmit={(e) => {
                  e.preventDefault()
                  validation.handleSubmit()
                  return false
                }}
              >
                <div className="mb-3">
                  <Label className="form-label">Senha Atual</Label>
                  <Input
                    name="currentPassword"
                    type="password"
                    placeholder="Digite sua senha atual"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.currentPassword || ''}
                    invalid={
                      validation.touched.currentPassword && validation.errors.currentPassword
                        ? true
                        : false
                    }
                  />
                  {validation.touched.currentPassword && validation.errors.currentPassword ? (
                    <FormFeedback type="invalid">
                      {validation.errors.currentPassword}
                    </FormFeedback>
                  ) : null}
                </div>

                <div className="mb-3">
                  <Label className="form-label">Nova Senha</Label>
                  <Input
                    name="newPassword"
                    type="password"
                    placeholder="Digite a nova senha"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.newPassword || ''}
                    invalid={
                      validation.touched.newPassword && validation.errors.newPassword
                        ? true
                        : false
                    }
                  />
                  {validation.touched.newPassword && validation.errors.newPassword ? (
                    <FormFeedback type="invalid">
                      {validation.errors.newPassword}
                    </FormFeedback>
                  ) : null}
                </div>

                <div className="mb-3">
                  <Label className="form-label">Confirmar Nova Senha</Label>
                  <Input
                    name="confirmNewPassword"
                    type="password"
                    placeholder="Confirme a nova senha"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.confirmNewPassword || ''}
                    invalid={
                      validation.touched.confirmNewPassword && validation.errors.confirmNewPassword
                        ? true
                        : false
                    }
                  />
                  {validation.touched.confirmNewPassword && validation.errors.confirmNewPassword ? (
                    <FormFeedback type="invalid">
                      {validation.errors.confirmNewPassword}
                    </FormFeedback>
                  ) : null}
                </div>

                <div className="text-center mt-4">
                  <Button type="submit" color="primary" disabled={mutation.isLoading}>
                    {mutation.isLoading ? 'Alterando...' : 'Alterar Senha'}
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default UserProfile
