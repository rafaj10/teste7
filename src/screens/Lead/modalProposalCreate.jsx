import React, { useEffect, useState } from 'react'
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
import Select from 'react-select'
import { ToastContainer } from 'react-toastify'
import useLead from '../../store/lead/hooks'
import { useBoard } from '../../store/board/hooks'
import { getLoggedInUser } from '../../helpers/backend_helper'

const ProposalSchema = Yup.object({
  step: Yup.string().required('Campo obrigatório'),
  // contact: Yup.string().required('Campo obrigatório'),
  owner: Yup.string().required('Campo obrigatório'),
  name: Yup.string().required('Campo obrigatório'),
  // temperature: Yup.string().required('Campo obrigatório'),
  paymentType: Yup.string().required('Campo obrigatório'),
  closeDate: Yup.string().required('Campo obrigatório'),
  products: Yup.array()
    .of(
      Yup.object({
        _id: Yup.string().required('Campo obrigatório'),
        price: Yup.number().min(1).required('Campo obrigatório'),
      })
    )
    .min(1, 'Campo obrigatório')
    .required('Campo obrigatório'),
  observations: Yup.string(),
  totalPrice: Yup.number().required('Campo obrigatório'),
  discount: Yup.number().required('Campo obrigatório'),
  finalPrice: Yup.number().required('Campo obrigatório'),
})

const ModalProposalCreate = (props) => {
  const [toggle, setToggle] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  const [selectedProducts, setSelectedProducts] = useState([])

  const leadHooks = useLead()
  const { refetch: refetchLead } = leadHooks.getLead()
  const boardHooks = useBoard()
  const { data: board } = boardHooks.getBoard()
  const { data: productOpts } = leadHooks.getProducts()
  const { data: lead } = leadHooks.getLead()
  const createProposal = leadHooks.createProposal()

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      step: '',
      contact: '',
      owner: '',
      name: '',
      temperature: '',
      paymentType: '',
      closeDate: '',
      products: [],
      observations: '',
      discount: 0,
      totalPrice: 0,
      finalPrice: 0,
    },
    validationSchema: ProposalSchema,
    onSubmit: async (values, { resetForm }) => {
      await createProposal.mutateAsync(values)
      refetchLead()
      resetForm()
      props.toggle()
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
          style={{ backgroundColor: '#debb21', color: '#fff' }}
        >
          {!!isEdit ? 'Editar' : '+ ' + 'Criar Proposta'}
        </ModalHeader>
        <ModalBody style={{ backgroundColor: '#f0f0f0' }}>
          <Form
            onSubmit={async (e) => {
              e.preventDefault()
              await validation.setValues({
                ...validation.values,
                products: selectedProducts.map((e) => {
                  return {
                    ...e,
                    _id: e.value,
                    price: e?.price ?? 0,
                  }
                }),
                step: leadHooks.getCurrentStep({ steps: board.steps })?._id,
                owner: getLoggedInUser()._id ?? '',
                totalPrice: selectedProducts.reduce(
                  (acc, cur) => Number(acc) + Number(cur.price),
                  0
                ),
              })

              validation.handleSubmit()
              return false
            }}
          >
            <Row>
              <Col xs="12">
                {/* Dados da empresa*/}
                <Card>
                  <CardBody>
                    <Row>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label>Nome da proposta</Label>
                          <Input
                            name="name"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.name}
                            valid={
                              !validation.errors.name && validation.touched.name
                            }
                          />
                          {validation.touched.name && validation.errors.name ? (
                            <FormFeedback type="invalid" className="d-block">
                              {validation.errors.name}
                            </FormFeedback>
                          ) : null}
                        </div>
                        {/*<div className="mb-3">
                          <Label>Valor líquido negociação</Label>
                          <Input
                            type="number"
                            name="totalPrice"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.totalPrice}
                            valid={!validation.errors.totalPrice && validation.touched.totalPrice}
                          />
                          {validation.touched.totalPrice && validation.errors.totalPrice ? (
                            <FormFeedback type="invalid" className="d-block">
                              {validation.errors.totalPrice}
                            </FormFeedback>
                          ) : null}
                        </div>
                        */}
                        {/*<div className="mb-3">
                          <Label>Período de veiculação</Label>
                          <Input
                            name="period"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.period}
                            valid={!validation.errors.period && validation.touched.period}
                          />
                          {validation.touched.period && validation.errors.period ? (
                            <FormFeedback type="invalid" className="d-block">
                              {validation.errors.period}
                            </FormFeedback>
                          ) : null}
                        </div>
                        */}
                        <div className="mb-3">
                          <Label>Contato demandante da proposta</Label>
                          <Input
                            type="select"
                            name="contact"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.contact}
                            valid={
                              !validation.errors.contact &&
                              validation.touched.contact
                            }
                          >
                            <option value=""></option>
                            {lead?.contacts?.map((c) => {
                              return (
                                <option value={c?.person?._id}>
                                  {c?.person?.name}
                                </option>
                              )
                            })}
                          </Input>
                          {validation.touched.contact &&
                          validation.errors.contact ? (
                            <FormFeedback type="invalid" className="d-block">
                              {validation.errors.contact}
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label>Data de fechamento</Label>
                          <Input
                            type="date"
                            name="closeDate"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.closeDate}
                            valid={
                              !validation.errors.closeDate &&
                              validation.touched.closeDate
                            }
                          />
                          {validation.touched.closeDate &&
                          validation.errors.closeDate ? (
                            <FormFeedback type="invalid" className="d-block">
                              {validation.errors.closeDate}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>

                      <Col sm="6">
                        <div className="mb-3">
                          <Label>Temperatura da proposta</Label>
                          <Input
                            type="text"
                            name="temperature"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.temperature}
                            valid={
                              !validation.errors.temperature &&
                              validation.touched.temperature
                            }
                          />
                          {validation.touched.temperature &&
                          validation.errors.temperature ? (
                            <FormFeedback type="invalid" className="d-block">
                              {validation.errors.temperature}
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label>Forma de pagamento</Label>
                          <Input
                            type="select"
                            name="paymentType"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.paymentType}
                            valid={
                              !validation.errors.paymentType &&
                              validation.touched.paymentType
                            }
                          >
                            <option value=""></option>
                            <option value="credit_card">
                              Cartão de crédito
                            </option>
                            <option value="debit_card">
                              Cartão de debito
                            </option>
                            <option value="pix">Pix</option>
                            <option value="boleto">Boleto</option>
                            <option value="ted">TED</option>
                            <option value="doc">DOC</option>
                            <option value="ted">TED</option>
                            <option value="desconto">Desconto</option>
                            <option value="cashback">Cashback</option>
                          </Input>
                          {validation.touched.paymentType &&
                          validation.errors.paymentType ? (
                            <FormFeedback type="invalid" className="d-block">
                              {validation.errors.paymentType}
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <Label>Observações</Label>
                          <Input
                            name="observations"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.observations}
                          />
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <div className="mb-3">
                          <Label>Produtos</Label>
                          <Select
                            name="products"
                            options={productOpts?.map((p) => ({
                              value: p._id,
                              label: p.description,
                            }))}
                            placeholder="Selecione"
                            noOptionsMessage={() => 'Nenhum produto encontrado'}
                            isClearable={false}
                            onChange={(e) => {
                              const selectedValues = selectedProducts.map(
                                (e) => e.value
                              )
                              if (selectedValues.includes(e.value)) {
                                setSelectedProducts(
                                  selectedProducts.filter(
                                    (p) => p.value !== e.value
                                  )
                                )
                                return
                              }

                              setSelectedProducts([...selectedProducts, e])
                            }}
                          />
                          {validation.touched.products &&
                          validation.errors.products ? (
                            <FormFeedback type="invalid" className="d-block">
                              Produtos e Valores são obrigatórios
                            </FormFeedback>
                          ) : null}

                          <hr />

                          <div style={{ marginTop: 16 }}>
                            {selectedProducts.map((p, i) => (
                              <div
                                key={i}
                                style={{
                                  display: 'grid',
                                  gridTemplateColumns: '2fr 2fr 0.5fr',
                                  gap: 12,
                                  alignItems: 'center',
                                  marginBottom: 12,
                                }}
                              >
                                <div>
                                  <span>{p.label}</span>
                                </div>
                                <Input
                                  type="number"
                                  placeholder="R$"
                                  bsSize="sm"
                                  onChange={(e) => {
                                    const value = e.target.value
                                    const newProducts = selectedProducts.map(
                                      (sp) => {
                                        if (sp.value === p.value) {
                                          return {
                                            ...sp,
                                            price: value,
                                          }
                                        }

                                        return { ...sp }
                                      }
                                    )

                                    setSelectedProducts([...newProducts])
                                  }}
                                />
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    setSelectedProducts(
                                      selectedProducts.filter(
                                        (x) => p.value !== x.value
                                      )
                                    )
                                  }
                                >
                                  <i className="fa fa-trash" />
                                </Button>
                              </div>
                            ))}
                          </div>
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

export default ModalProposalCreate
