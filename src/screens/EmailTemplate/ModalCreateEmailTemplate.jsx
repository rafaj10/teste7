import React, { useRef } from 'react'
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
import { useEmailTemplate } from '../../store/emailtemplate/hooks'
import EmailEditor from 'react-email-editor'

const ModalCreateEmailTemplate = (props) => {
  const emailTemplate = useEmailTemplate()
  const { mutateAsync: create } = emailTemplate.create()
  const { mutateAsync: update } = emailTemplate.update()
  const emailEditorRef = useRef(null)

  const { refetch } = emailTemplate.list()

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      titulo_email: props?.edit?.title ?? '',
    },
    validationSchema: Yup.object({
      titulo_email: Yup.string().required('Preencha o título do e-mail'),
    }),
    onSubmit: async (values, { resetForm }) => {
      emailEditorRef.current.editor.exportHtml(async (data) => {
        const { design, html } = data

        const emailTemplateData = {
          title: values.titulo_email,
          body: html,
        }

        if (!props.edit) await create(emailTemplateData)
        if (props.edit)
          await update({ ...emailTemplateData, id: props.edit._id })

        refetch()
        resetForm()
        props.toggle()
      })
    },
  })

  return (
    <React.Fragment>
      <Offcanvas
        id="modalForm"
        isOpen={props.modal}
        toggle={props.toggle}
        direction="end"
        style={{
          minWidth: '80%',
          borderTopLeftRadius: '10px',
        }}
      >
        <OffcanvasHeader toggle={props.toggle}>
          {!!props.edit ? 'Editar Template de E-mail' : 'Template de E-mail'}
        </OffcanvasHeader>
        <OffcanvasBody style={{ overflow: 'auto' }}>
          <Form
            onSubmit={(e) => {
              e.preventDefault()
              validation.handleSubmit()
              return false
            }}
          >
            <FormGroup>
              <Label className="form-label">Título do E-mail</Label>
              <Input
                type="text"
                name="titulo_email"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.titulo_email || ''}
                invalid={
                  validation.touched.titulo_email &&
                  validation.errors.titulo_email
                    ? true
                    : false
                }
              />
              {validation.touched.titulo_email &&
              validation.errors.titulo_email ? (
                <FormFeedback type="invalid">
                  {validation.errors.titulo_email}
                </FormFeedback>
              ) : null}
            </FormGroup>

            <FormGroup>
              <Label className="form-label">Conteúdo do E-mail</Label>
              <EmailEditor
                options={{
                  projectId: 236309,
                  appearance: {
                    theme: 'modern_light',
                  },
                }}
                ref={emailEditorRef}
              />
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

export default ModalCreateEmailTemplate
