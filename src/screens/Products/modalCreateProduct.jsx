import React, { useState } from 'react'
import {
  Button,
  FormGroup,
  Input,
  FormFeedback,
  Label,
  Form,
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
} from 'reactstrap'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { ToastContainer } from 'react-toastify'
import { useProduct } from '../../store/product/hooks'

const ModalCreateProduct = (props) => {
  const product = useProduct()
  const { mutateAsync: create } = product.create()
  const { mutateAsync: update } = product.update()

  const { refetch } = product.list()

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      description: props?.edit?.description ?? '',
      price: props?.edit?.price ?? '',
    },
    validationSchema: Yup.object({
      description: Yup.string().required('Preencha a descrição'),
      price: Yup.string().required('Preencha o valor'),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!props.edit) await create(values)
      if (props.edit) await update({ ...values, id: props.edit._id })

      refetch()
      resetForm()
      props.toggle()
    },
  })

  return (
    <React.Fragment>
      <Offcanvas
        id="modalForm"
        isOpen={props.modal}
        toggle={props.toggle}
        centered={true}
        size="lg"
        direction="end"
      >
        <OffcanvasHeader
          toggle={props.toggle}
          style={{
            background: 'linear-gradient(135deg, #54398b 0%, #6b52a1 100%)',
            color: '#fff',
          }}
        >
          {!!props.edit ? 'Editar Produto' : 'Produto'}
        </OffcanvasHeader>
        <OffcanvasBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault()
              validation.handleSubmit()
              return false
            }}
          >
            <FormGroup>
              <Label className="form-label">Descrição</Label>
              <Input
                type="text"
                name="description"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.description || ''}
                invalid={
                  validation.touched.description &&
                  validation.errors.description
                    ? true
                    : false
                }
              />
              {validation.touched.description &&
              validation.errors.description ? (
                <FormFeedback type="invalid">
                  {validation.errors.description}
                </FormFeedback>
              ) : null}
            </FormGroup>

            <FormGroup>
              <Label className="form-label">Preço</Label>
              <Input
                type="number"
                name="price"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.price || ''}
                invalid={
                  validation.touched.price && validation.errors.price
                    ? true
                    : false
                }
              />
              {validation.touched.price && validation.errors.price ? (
                <FormFeedback type="invalid">
                  {validation.errors.price}
                </FormFeedback>
              ) : null}
            </FormGroup>

            <Button color="primary" type="submit">
              Confirmar
            </Button>
          </Form>
        </OffcanvasBody>
      </Offcanvas>
      <ToastContainer />
    </React.Fragment>
  )
}

export default ModalCreateProduct
