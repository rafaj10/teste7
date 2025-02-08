import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import withRouter from '../../components/Common/withRouter'

//redux
import { useSelector, useDispatch } from 'react-redux'
import { createSelector } from 'reselect'

// Formik validation
import * as Yup from 'yup'
import { useFormik } from 'formik'

import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Form,
  Input,
  FormFeedback,
  Label,
} from 'reactstrap'

// actions
import { loginUser, socialLogin } from '../../store/actions'

// import images
import profile from '../../assets/images/profile-img.png'
import logoDark from '../../assets/images/logo-dark.png'
import logoLight from '../../assets/images/logo-light.png'
import CarouselPage from './CarouselPage'

const Login = (props) => {
  const [passwordShow, setPasswordShow] = useState(false)

  //meta title
  document.title = 'Login | 7stratos - Entre e acelere a sua operação'
  const dispatch = useDispatch()

  const validation = useFormik({
    enableReinitialize: true,

    // initialValues: {
    //   email: 'user@email.com' || '',
    //   password: '102030' || '',
    // },
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Por favor, insira seu email'),
      password: Yup.string().required('Por favor, insira sua senha'),
    }),
    onSubmit: (values) => {
      dispatch(loginUser(values, props.router.navigate))
    },
  })

  const selectLoginState = (state) => state.Login
  const LoginProperties = createSelector(selectLoginState, (login) => ({
    error: login.error,
  }))

  const { error } = useSelector(LoginProperties)

  const signIn = (type) => {
    dispatch(socialLogin(type, props.router.navigate))
  }

  const socialResponse = (type) => {
    signIn(type)
  }

  return (
    <React.Fragment>
      <div>
        <Container fluid className="p-0">
          <Row className="g-0">
            <CarouselPage />

            <Col xl={3}>
              <div className="auth-full-page-content p-md-5 p-4">
                <div className="w-100">
                  <div className="d-flex flex-column h-100">
                    <div className="mb-4 mb-md-5">
                      <Link to="/inicio" className="d-block card-logo">
                        <img
                          src={logoDark}
                          alt=""
                          height="28"
                          className="logo-dark-element"
                        />
                        <img
                          src={logoLight}
                          alt=""
                          height="28"
                          className="logo-light-element"
                        />
                      </Link>
                    </div>
                    <div className="my-auto">
                      <div>
                        <h5 className="text-primary">Bem vindo de volta!</h5>
                        <p className="text-muted">
                          Entre para continuar usando 7Stratos.
                        </p>
                      </div>

                      <div className="mt-4">
                        <Form
                          className="form-horizontal"
                          onSubmit={(e) => {
                            e.preventDefault()
                            validation.handleSubmit()
                            return false
                          }}
                        >
                          {error ? <Alert color="danger">{error}</Alert> : null}

                          <div className="mb-3">
                            <Label className="form-label">Email</Label>
                            <Input
                              name="email"
                              className="form-control"
                              placeholder="Insira seu email"
                              type="email"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.email || ''}
                              invalid={
                                validation.touched.email &&
                                validation.errors.email
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.email &&
                            validation.errors.email ? (
                              <FormFeedback type="invalid">
                                {validation.errors.email}
                              </FormFeedback>
                            ) : null}
                          </div>

                          <div className="mb-3">
                            {/* <div className="float-end">
                              <Link
                                to="/forgot-password"
                                className="text-muted"
                              >
                                Esqueceu a senha?
                              </Link>
                            </div> */}
                            <Label className="form-label">Senha</Label>
                            <div className="input-group auth-pass-inputgroup">
                              <Input
                                name="password"
                                value={validation.values.password || ''}
                                type={passwordShow ? 'text' : 'password'}
                                placeholder="Insira sua senha"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                invalid={
                                  validation.touched.password &&
                                  validation.errors.password
                                    ? true
                                    : false
                                }
                              />
                              <button
                                onClick={() => setPasswordShow(!passwordShow)}
                                className="btn btn-light "
                                type="button"
                                id="password-addon"
                              >
                                <i className="mdi mdi-eye-outline"></i>
                              </button>
                            </div>
                            {validation.touched.password &&
                            validation.errors.password ? (
                              <FormFeedback type="invalid">
                                {validation.errors.password}
                              </FormFeedback>
                            ) : null}
                          </div>

                          <div className="form-check">
                            <Input
                              type="checkbox"
                              className="form-check-input"
                              id="auth-remember-check"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="auth-remember-check"
                            >
                              Lembrar me
                            </label>
                          </div>

                          <div className="mt-3 d-grid">
                            <button
                              className="btn btn-primary btn-block"
                              type="submit"
                            >
                              Entrar
                            </button>
                          </div>
                        </Form>

                        <div className="mt-5 text-center">
                          <p>
                            Não tem conta?{' '}
                            <Link
                              to="https://7stratos.com.br"
                              className="fw-medium text-primary"
                            >
                              Peça uma demonstração agora
                            </Link>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 mt-md-5 text-center">
                      <p className="mb-0">
                        © {new Date().getFullYear()} feito com{' '}
                        <i className="mdi mdi-heart text-danger"></i> por
                        7stratos dev team
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default withRouter(Login)

Login.propTypes = {
  history: PropTypes.object,
}
