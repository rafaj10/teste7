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
import {
  createLeads as onCreateLeads,
} from '../../../store/peoples/actions'
import { useDispatch } from 'react-redux'
import * as Yup from 'yup'
import useLead from '../../../store/lead/hooks'
import Lottie from 'react-lottie'
import animationData from './animations/anim.json'
import { getLoggedInUser } from '../../../helpers/backend_helper'
import BoardStepSelector from '../../../components/Common/BoardStepSelector'

const congratulationsMessages = [
  "Fantástico trabalho! Você demonstrou excelente habilidade em concretizar negócios!",
  "Incrível! Sua dedicação em alcançar resultados está clara. Parabéns pela venda!",
  "Excelente execução! Sua competência em fechar vendas continua a impressionar!",
  "Negócio fechado! Sua habilidade em converter oportunidades é notável. Parabéns!",
  "Mestre das vendas! Você fez acontecer novamente. Continue assim!",
  "Vitória merecida! Você jogou e ganhou. Excelente venda!",
  "Sucesso total! Você sabe como atingir o alvo. Ótimo trabalho nesta venda!"
];

const Schema = Yup.object({})

const LeadModalWon = ({ config, toggle }) => {
  const dispatch = useDispatch()
  const [randomMessage, setRandomMessage] = useState('');
  const [boardId, setBoardId] = useState('')
  const [stepId, setStepId] = useState('')
  const [steps, setSteps] = useState([])

  useEffect(() => {
    setRandomMessage(congratulationsMessages[Math.floor(Math.random() * congratulationsMessages.length)]);
  }, [config.open]); // Randomize message when modal opens

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
      observation: '',
    },
    validationSchema: Schema,
    onSubmit: async (values) => {
      //alert('Op')
      if (!config.lead) return false
      //alert('teste')
      if (!boardId) return false
      //alert('teste1')
      if (!steps) return false
      //alert('teste2')

      const stetpStarter = steps.filter((e) => e.flags.starter)
      const userMeId = getLoggedInUser()?._id

      const payload = {
        step: stetpStarter[0]._id,
        owner: userMeId,
        origin: 'ganho',
        title: values.observation,
        type: 'crm',
        company: config.lead?.company?._id,
        agency: config.lead?.agency?._id ?? '',
        contacts: config.lead?.contacts?.map(contact => ({
          person: contact.person._id,
          ref: contact.ref._id,
          strategic: contact.strategic
        })) || []
      }

      dispatch(
        onCreateLeads(boardId, payload, () => {
          console.log('Lead criado')
          refetch()
          toggle()
        })
      )
    },
  })

  return (
    <Modal isOpen={config.open} toggle={toggle} centered={true} size="lg">
      <ModalBody>
        <div className="mb-3">
          <Lottie options={defaultOptions} height={200} width={200} />
        </div>
        <div className="mb-3 form-group" style={{ textAlign:'center', width:'100%', padding:'10px' }}>
          <Label style={{ fontSize:'20px' }}>{randomMessage}</Label>
        </div>
        <Form
          onSubmit={(e) => {
            e.preventDefault()
            validation.handleSubmit()

            return false
          }}
        >
          <div className="mb-3 form-group">
            <Label>Gostaria de criar uma nova oportunidade em algum dos funis abaixo?</Label>
            <BoardStepSelector
              className="board-step-selector"
              setBoardId={setBoardId}
              setStepId={setStepId}
              setStepList={setSteps}
              shouldFilterCrm={true}
            />
          </div>
          <div className="mb-3 form-group">
            <Label>Você pode dar um titulo para essa oportunidade</Label>
            <Input
              type="text"
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

          <Button type="submit">
            Criar Oportunidade
          </Button>&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="button" onClick={() => {
            toggle()
          }}>
            Apenas Fechar
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default LeadModalWon
