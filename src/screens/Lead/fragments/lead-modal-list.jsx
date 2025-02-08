import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import {
  Form,
  Label,
  Input,
  Modal,
  FormFeedback,
  ModalBody,
  Button,
} from 'reactstrap'
import * as Yup from 'yup'
import Lottie from 'react-lottie'
import useLead from '../../../store/lead/hooks'
import animationData from './animations/at.json'

const Schema = Yup.object({
  reason: Yup.string().required('Campo obrigatório'),
  observation: Yup.string().required('Campo obrigatório'),
})

const LeadModalLost = ({ config, toggle }) => {
  console.log(config)
  const lead = useLead()
  const { refetch } = lead.getLead()
  const { updateStep, registerLostReason } = lead
  const { mutateAsync: registerLostReasonMut } = registerLostReason()
  const { mutate: updateStepMut } = updateStep()

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }


  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      reason: '',
      observation: '',
    },
    validationSchema: Schema,
    onSubmit: async (values) => {
      if (!config.lead) return false

      await registerLostReasonMut({
        id: config.lead._id,
        board: config.lead.board,
        reason: values.reason,
        observation: values.observation,
      })

      updateStepMut(
        {
          id: config.lead._id,
          step: config.value,
          board: config.lead.board,
        },
        {
          onSuccess: async () => {
            await refetch()
            toggle()
          },
        }
      )
    },
  })

  return (
    <Modal isOpen={config.open} toggle={toggle} centered={true} size="lg">
      <ModalBody>
      <div className="mb-3">
          <Lottie options={defaultOptions} height={200} width={200} />
        </div>
        <Form
          onSubmit={(e) => {
            e.preventDefault()
            validation.handleSubmit()

            return false
          }}
        >
          <div className="mb-3 form-group">
            <Label>Motivo</Label>
            <Input
              type="select"
              name="reason"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.reason}
              valid={!validation.errors.reason && validation.touched.reason}
            >
              {[
                '',
                'Tentativas de Contato Esgotadas',
                'Não deu abertura pra conversar',
                'Preferiu concorrente',
                'Não possui budget',
                'Não possui campanhas prevista',
                'Não tem interesse na proposta',
              ].map((reason, i) => {
                return (
                  <option key={i} value={reason}>
                    {reason}
                  </option>
                )
              })}
            </Input>
            {validation.touched.reason && validation.errors.reason ? (
              <FormFeedback type="invalid" className="d-block">
                {validation.errors.reason}
              </FormFeedback>
            ) : null}
          </div>
          <div className="mb-3 form-group">
            <Label>Observações</Label>
            <Input
              type="textarea"
              name="observation"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.observation}
              valid={
                !validation.errors.observation && validation.touched.observation
              }
            />
            {validation.touched.observation && validation.errors.observation ? (
              <FormFeedback type="invalid" className="d-block">
                {validation.errors.observation}
              </FormFeedback>
            ) : null}
          </div>

          <Button color="danger" type="submit">
            Mover para perdido
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default LeadModalLost
