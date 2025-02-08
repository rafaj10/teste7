import { dateToViewAndHour } from '../../../helpers/frontend_helper'
import useLead from '../../../store/lead/hooks'

export const LeadHistoricTabView = ({ id }) => {
  const lead = useLead()
  const { data, isError, isLoading } = lead.getHistories(id)

  if (isLoading) {
    return <div className="padding-content">Carregando histórico...</div>
  }

  if (!data || isError) {
    return <div className="padding-content">Erro ao carregar histórico</div>
  }

  if (data.length === 0) {
    return <div className="padding-content text-muted">Lead sem histórico</div>
  }

  return (
    <div className="padding-content">
      <div className="mt-4">
        <ul className="verti-timeline list-unstyled">
          {data?.map((desc, key) => (
            <li key={key} className="event-list">
              <div className="event-timeline-dot">
                <i className={'bx bx-right-arrow-circle'} />
              </div>
              <div className="d-flex">
                <div className="flex-grow-1">
                  <div>
                    <h6 className="mb-2">
                      {dateToViewAndHour(desc.createdAt)}
                    </h6>
                    <h5>{desc.title}</h5>
                    <p className="text-muted">{desc.description}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}