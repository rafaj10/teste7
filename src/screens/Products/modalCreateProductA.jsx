import React, { useState } from 'react'
import {
  Card,
  CardBody,
  Col,
  Row,
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  Label,
  Input,
  Button,
  FormFeedback,
} from 'reactstrap'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Spinners from '../../components/Common/Spinner'

import { ToastContainer } from 'react-toastify'

const ModalCreateProductA = (props) => {
  const optionsSetor = [
    { value: 'Alimentação e Bebidas', label: 'Alimentação e Bebidas' },
    { value: 'Vestuário e calçados', label: 'Vestuário e calçados' },
    { value: 'Construção', label: 'Construção' },
    { value: 'Saúde', label: 'Saúde' },
    { value: 'Educação', label: 'Educação' },
    { value: 'Financeiro', label: 'Financeiro' },
    { value: 'Serviços pessoai', label: 'Serviços pessoais' },
    { value: 'Vendas e marketing', label: 'Vendas e marketing' },
    { value: 'Entretenimento', label: 'Entretenimento' },
  ]

  const optionsTamanho = [
    { value: 'Pequena', label: 'Pequena' },
    { value: 'Média', label: 'Média' },
    { value: 'Grande', label: 'Grande' },
  ]

  const optionsEstados = [
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' },
    { value: 'DF', label: 'Distrito Federal' },
  ]

  const [isEdit, setIsEdit] = useState(false)
  const [toggleSwitch, settoggleSwitch] = useState(true)

  const findValue = (arr, type) => {
    let myValue = ''
    arr.map((item) => {
      if (item.type.toLowerCase() === type) myValue = item.value
    })
    return myValue
  }

  const findAddressesValue = (type) => {
    let myValue = ''
    if (props.editing.addresses) {
      const add = props.editing.addresses
      if (add.length > 0) {
        myValue = add[0][type]
      }
    }
    return myValue
  }

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      relationDescription: props.editing
        ? props.editing.relationDescription
        : '',
      nome: props.editing ? props.editing.name : '',
      email: props.editing ? findValue(props.editing.contacts, 'email') : '',
      cargo: props.editing ? findValue(props.editing.contacts, 'cargo') : '',
      telefone: props.editing
        ? findValue(props.editing.contacts, 'telefone')
        : '',
      celular: props.editing
        ? findValue(props.editing.contacts, 'celular')
        : '',
      linkedin: props.editing
        ? findValue(props.editing.contacts, 'linkedin')
        : '',
    },
    validationSchema: Yup.object({
      nome: Yup.string().required('Preencha o Nome'),
      email: Yup.string().required('Preencha o E-mail'),
      cargo: Yup.string().required('Preencha o Cargo'),
      telefone: Yup.string()
        .matches(
          /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/,
          'Telefone precisa ser válido'
        )
        .required('Preencha o telefone'),
      celular: Yup.string()
        .matches(
          /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/,
          'Celular precisa ser válido'
        )
        .required('Preencha o celular'),
      linkedin: Yup.string().required('Preencha o Linkedin'),
    }),
    onSubmit: (values) => {
      const payload = {
        name: values.nome,
        alias: values.nome,
        contacts: [
          { type: 'email', value: values.email },
          { type: 'cargo', value: values.cargo },
          { type: 'telefone', value: values.telefone },
          { type: 'celular', value: values.celular },
          { type: 'linkedin', value: values.linkedin },
        ],
      }
      if (props.relation) {
        payload['relations'] = [
          {
            people: props.relation._id,
            type: props.relation.type,
            description: values.relationDescription,
          },
        ]
      }
      props.editing
        ? props.updatePeople(props.editing._id, payload)
        : props.createPeople(payload)
    },
  })

  return (
    <React.Fragment>
      <Modal
        id="modalForm"
        isOpen={props.modal}
        toggle={props.toggle}
        centered={true}
        size="lg"
      >
        <ModalHeader
          toggle={props.toggle}
          style={{ backgroundColor: '#54398b', color: '#fff' }}
        >
          {!!isEdit ? 'Editar' : '+ ' + props.typeName}
        </ModalHeader>
        <ModalBody style={{ backgroundColor: '#f0f0f0' }}>
          <Form
            onSubmit={(e) => {
              e.preventDefault()
              validation.handleSubmit()
              return false
            }}
          >
            <Row>
              <Col xs="12">
                {/* Dados da empresa*/}
                <Card>
                  <CardBody>
                    {props.relation && (
                      <Row>
                        <Col sm="6">
                          <div className="mb-3">
                            <Label className="form-label">
                              Titula de relação com {props.relation.name}:
                            </Label>
                            <Input
                              name="relationDescription"
                              type="text"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={
                                validation.values.relationDescription || ''
                              }
                              invalid={
                                validation.touched.relationDescription &&
                                validation.errors.relationDescription
                                  ? true
                                  : false
                              }
                            />
                          </div>
                        </Col>
                      </Row>
                    )}
                    <Row>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label className="form-label">Nome Completo</Label>
                          <Input
                            name="nome"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.nome || ''}
                            invalid={
                              validation.touched.nome && validation.errors.nome
                                ? true
                                : false
                            }
                          />
                          {validation.touched.nome && validation.errors.nome ? (
                            <FormFeedback type="invalid">
                              {validation.errors.nome}
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="site">E-mail</Label>
                          <Input
                            name="email"
                            className="form-control"
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
                          <Label htmlFor="endereco">Telefone</Label>
                          <Input
                            name="telefone"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.telefone || ''}
                            invalid={
                              validation.touched.telefone &&
                              validation.errors.telefone
                                ? true
                                : false
                            }
                          />
                          {validation.touched.telefone &&
                          validation.errors.telefone ? (
                            <FormFeedback type="invalid">
                              {validation.errors.telefone}
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="endereco">Linkedin</Label>
                          <Input
                            name="linkedin"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.linkedin || ''}
                            invalid={
                              validation.touched.linkedin &&
                              validation.errors.linkedin
                                ? true
                                : false
                            }
                          />
                          {validation.touched.linkedin &&
                          validation.errors.linkedin ? (
                            <FormFeedback type="invalid">
                              {validation.errors.linkedin}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>

                      <Col sm="6">
                        <div className="mb-3">
                          <Label className="control-label">Cargo</Label>
                          <Input
                            name="cargo"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.cargo || ''}
                            invalid={
                              validation.touched.cargo &&
                              validation.errors.cargo
                                ? true
                                : false
                            }
                          />
                          {validation.touched.cargo &&
                          validation.errors.cargo ? (
                            <FormFeedback type="invalid">
                              {validation.errors.cargo}
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="endereco">Celular</Label>
                          <Input
                            name="celular"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.celular || ''}
                            invalid={
                              validation.touched.celular &&
                              validation.errors.celular
                                ? true
                                : false
                            }
                          />
                          {validation.touched.celular &&
                          validation.errors.celular ? (
                            <FormFeedback type="invalid">
                              {validation.errors.celular}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg={20}>
                <div className="d-flex flex-wrap gap-2">
                  {props.isCreateLoading ? (
                    <div style={{ height: '70px' }}>
                      <Spinners setLoading={true} />
                    </div>
                  ) : (
                    <React.Fragment>
                      <Button type="submit" color="primary">
                        {props.editing ? 'Editar' : 'Confirmar'}
                      </Button>
                      <Button
                        type="button"
                        color="secondary"
                        onClick={props.toggle}
                      >
                        Cancelar
                      </Button>
                    </React.Fragment>
                  )}
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
      <ToastContainer />
    </React.Fragment>
  )
}

export default ModalCreateProductA
