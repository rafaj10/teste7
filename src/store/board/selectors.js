import { createSelector } from 'reselect'
import { useSelector } from 'react-redux'

const selectBoardState = (state) => state.Board

export const useBoardSelector = () => {
  const boardSteps = useSelector(
    createSelector(
      [selectBoardState],
      (Board) => Board.currentBoard?.steps ?? []
    )
  )

  const boardById = useSelector(
    createSelector([selectBoardState], (Board) => Board.currentBoard ?? {})
  )

  const boardList = useSelector(
    createSelector([selectBoardState], (Board) => Board.boards ?? [])
  )

  const leadList = useSelector(
    createSelector([selectBoardState], (Board) => Board.leads ?? [])
  )

  const isLoading = useSelector(
    createSelector([selectBoardState], (Board) => Board.loading ?? false)
  )

  const getRequiredFields = ({ step }) => {
    const currentStep = boardById.steps?.find((s) => s._id === step)
    return currentStep?.fields ?? []
  }

  const hasRequiredFields = ({ step }) => {
    const currentStep = boardById.steps?.find((s) => s._id === step)
    return currentStep?.fields?.length > 0
  }

  const getNextStep = ({ current }) => {
    const currentStepIndex =
      boardById.steps?.findIndex((s) => s._id === current) ?? 0
    return (
      boardById.steps[currentStepIndex + 1]?._id ??
      boardById.steps[currentStepIndex]?._id
    )
  }

  const getStepsByOrderUpdatedAt = () => {
    return boardSteps.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    )
  }

  return {
    steps: boardSteps,
    leadList: leadList,
    stepsByOrderUpdatedAt: getStepsByOrderUpdatedAt,
    boardById: boardById,
    boardList: boardList,
    getRequiredFields,
    hasRequiredFields,
    getNextStep,
    isLoading,
  }
}
