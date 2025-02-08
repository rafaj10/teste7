import clx from 'classnames'
import '../lead.css'
import useLead from '../../../store/lead/hooks'
import { useBoard } from '../../../store/board/hooks'

export const LeadCurrentStepView = ({ isLate }) => {
  const { data, isLoading } = useBoard().getBoard()
  const currentLeadStep = useLead().getCurrentStep({ steps: data?.steps ?? [] })

  const isCurrentStep = (step) => {
    return step?._id === currentLeadStep?._id
  }

  if (isLoading) {
    return (
      <div>
        <div className="lead-step-container">
          <div className="lead-step-item">
            <span>
              <i className="fa fa-spinner fa-spin" />
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="lead-step-container">
        {data?.steps?.map((step, index) => {
          return (
            <div
              style={{ "--step-active": !isLate ? step.color : 'red' }}
              key={index}
              className={clx('lead-step-item', {
                'lead-step-item-active': isCurrentStep(step),
              })}
            >
              <span>
                {step.name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}