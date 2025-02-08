import React from 'react'

const ImportSummary = ({ summary }) => (
  <>
    {summary && (
      <div>
        <h4>Resumo da Importação</h4>
        <p>Empresas: {summary.companies}</p>
        <p>Contatos: {summary.contacts}</p>
        <p>Descartados: {summary.discarded}</p>
      </div>
    )}
  </>
)

export default ImportSummary
