import { useState } from "react"
import { useBoard } from "../../../store/board/hooks"
import useLead from "../../../store/lead/hooks"
import clx from 'classnames'
import './lead-custom-fields.css'
import '../lead.css'

export const LeadCustomFields = () => {
  const [toggleView, setToggleView] = useState(false)
  const boardHooks = useBoard()
  const { getBoardFields } = boardHooks

  const { data: lead } = useLead().getLead()

  function getCustomFieldLabel(field) {
    if (typeof field === 'boolean') return field ? 'Sim' : 'Não'
    return field
  }

  return (
    <>
      <div
        onClick={() => setToggleView(!toggleView)}
        style={{ fontSize: '12px', color: '#54398b', display: 'flex', justifyContent: 'space-between', margin: '16px 0', cursor: 'pointer' }}
      >
        <div>
          <h6 className="mb-2" style={{ fontSize: '12px', color: '#54398b' }}>Campos personalizados</h6>
        </div>
        <div className="toggler">
          <i className={clx("fas", {
            "fa-chevron-up": toggleView,
            "fa-chevron-down": !toggleView
          })} />
        </div>
      </div >

      <div style={{ display: !toggleView ? 'block' : 'none' }}>
        {getBoardFields().map((field, i) => {
          if (!lead.customFields) return null

          const cf = lead.customFields[field.name]

          if (!cf) return null
          if (!lead.customFields[field.name]) return null

          return (
            <div key={i} className="cf-container">
              <div>{field.label}</div>
              <div className="cf-label">{getCustomFieldLabel(lead.customFields[field.name])}</div>
            </div>
          )
        })}
      </div>
    </>
  )
}