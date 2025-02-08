import React, { useEffect, useState } from 'react'
import { useBoardSelector } from '../../store/board/selectors'
import { useDispatch } from 'react-redux'
import { getBoardListReq } from '../../store/board/actions'
import { FormGroup, Label, Input } from 'reactstrap'

const BoardStepSelector = ({
  shouldSelectStep,
  setBoardId,
  setStepId,
  setStepList,
  shouldFilterCrm,
}) => {
  const dispatch = useDispatch()
  const { boardList, steps, boardById } = useBoardSelector()
  const [selectedBoard, setSelectedBoard] = useState('')
  const [selectedStep, setSelectedStep] = useState('')

  useEffect(() => {
    dispatch(getBoardListReq())
  }, [dispatch])

  useEffect(() => {
    if (selectedBoard) {
      setBoardId(selectedBoard)
      const board = boardList.find((board) => board._id === selectedBoard)
      setSelectedStep(board?.steps?.[0]?._id ?? '')
      if (setStepList) setStepList(board.steps)
    }
  }, [selectedBoard, boardList, setBoardId])

  useEffect(() => {
    setStepId(selectedStep)
  }, [selectedStep, setStepId])

  const handleBoardChange = (e) => {
    setSelectedBoard(e.target.value)
  }

  const handleStepChange = (e) => {
    setSelectedStep(e.target.value)
  }

  return (
    <FormGroup>
      <Input
        type="select"
        id="boardSelect"
        onChange={handleBoardChange}
        value={selectedBoard}
      >
        <option value="">Selecione um funil</option>
        {(shouldFilterCrm ? boardList.filter(board => board.type === 'crm') : boardList)
          .map((board) => (
            <option key={board._id} value={board._id}>
              {board.name}
            </option>
        ))}
      </Input>

      {selectedBoard && shouldSelectStep && (
        <div style={{ marginTop: '20px' }}>
          <Label for="stepSelect">Etapa</Label>
          <Input
            type="select"
            id="stepSelect"
            onChange={handleStepChange}
            value={selectedStep}
          >
            <option value="">Selecione um step</option>
            {boardById.steps.map((step) => (
              <option key={step._id} value={step._id}>
                {step.name}
              </option>
            ))}
          </Input>
        </div>
      )}
    </FormGroup>
  )
}

export default BoardStepSelector
