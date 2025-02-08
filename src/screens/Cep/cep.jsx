import React from 'react'
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Button,
  Form,
  Label,
  Input,
  FormFeedback,
} from 'reactstrap'
import InputMask from 'react-input-mask'
import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Breadcrumbs from '../../components/Common/Breadcrumb'
import { fetchCepRequest } from '../../store/cep/actions'
import { useCepSelector } from '../../store/cep/selectors'
import Spinners from '../../components/Common/Spinner'
import { ToastContainer } from 'react-toastify'

const Cep = () => {
  const dispatch = useDispatch()
  const { cepData, loading, error } = useCepSelector()

  const formik = useFormik({
    initialValues: {
      cep: '',
    },
    validationSchema: Yup.object({
      cep: Yup.string()
        .matches(/^\d{5}-?\d{3}$/, 'CEP inválido')
        .required('CEP é obrigatório'),
    }),
    onSubmit: (values) => {
      const cepWithoutDash = values.cep.replace('-', '')
      dispatch(fetchCepRequest(cepWithoutDash))
    },
  })

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Consulta" breadcrumbItem="CEP" />
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={4}>
            <Card>
              <CardBody>
                <h4 className="card-title">Consultar CEP</h4>
                <Form onSubmit={formik.handleSubmit}>
                  <div className="mb-3">
                    <Label for="cep">CEP</Label>
                    <InputMask
                      mask="99999-999"
                      alwaysShowMask={true}
                      maskChar={null}
                      name="cep"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.cep}
                      invalid={formik.touched.cep && formik.errors.cep}
                      className="form-control"
                    >
                      {(inputProps) => (
                        <Input
                          {...inputProps}
                          type="text"
                          name="cep"
                          className="form-control"
                        />
                      )}
                    </InputMask>
                    {formik.touched.cep && formik.errors.cep ? (
                      <FormFeedback>{formik.errors.cep}</FormFeedback>
                    ) : null}
                  </div>
                  <div className="d-grid gap-2">
                    <Button color="primary" type="submit">
                      Consultar CEP
                    </Button>
                  </div>
                </Form>
                {loading && <Spinners />}
                {error && <div className="text-danger mt-3">{error}</div>}
                {cepData && !loading && (
                  <div className="mt-4">
                    <h5>Resultados da Consulta</h5>
                    <p>
                      <strong>Logradouro:</strong> {cepData.address}
                    </p>
                    <p>
                      <strong>Bairro:</strong> {cepData.neighborhood}
                    </p>
                    <p>
                      <strong>Cidade:</strong> {cepData.city}
                    </p>
                    <p>
                      <strong>Estado:</strong> {cepData.state}
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </div>
  )
}

export default Cep
