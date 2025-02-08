import React from 'react'
import { Table } from 'reactstrap'

const DiscardedLeadsTable = ({ discardedLeads }) => (
  <>
    {discardedLeads.length > 0 && (
      <div className="table-responsive">
        <Table className="table table-bordered mb-0">
          <thead>
            <tr>
              <th>Nome da Empresa</th>
              <th>CNPJ</th>
              <th>Setor</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Motivo</th>
            </tr>
          </thead>
          <tbody>
            {discardedLeads.map((lead, index) => (
              <tr key={index}>
                <td>{lead.Cliente}</td>
                <td>{lead.CNPJ}</td>
                <td>{lead['Setor Monitor']}</td>
                <td>{lead.Telefone}</td>
                <td>{lead.Email}</td>
                <td>{lead.reason}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    )}
  </>
)

export default DiscardedLeadsTable
