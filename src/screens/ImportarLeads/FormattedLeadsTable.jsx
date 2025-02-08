import React from 'react'
import { Table, Button } from 'reactstrap'

const FormattedLeadsTable = ({
  formattedLeads,
  handleConfirmImport,
  loading,
}) => (
  <>
    {formattedLeads.length > 0 && (
      <div className="table-responsive">
        <Table className="table table-bordered mb-0">
          <thead>
            <tr>
              <th>Nome da Empresa</th>
              <th>CNPJ</th>
              <th>Setor</th>
              <th>Nome do Contato</th>
              <th>Contato</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {formattedLeads.map((lead, index) => (
              <tr key={index}>
                <td>{lead.company.name}</td>
                <td>{lead.company.documents[0].value}</td>
                <td>
                  {
                    lead.company.contacts.find(
                      (contact) => contact.type === 'setor'
                    )?.value
                  }
                </td>
                <td>{lead.contact ? lead.contact.name : 'N/A'}</td>
                <td>
                  {lead.contact
                    ? lead.contact.contacts.find(
                        (contact) => contact.type === 'phone'
                      )?.value
                    : 'N/A'}
                </td>
                <td>
                  {lead.contact
                    ? lead.contact.contacts.find(
                        (contact) => contact.type === 'email'
                      )?.value
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button
          color="success"
          onClick={handleConfirmImport}
          disabled={loading}
        >
          Confirmar Importação
        </Button>
      </div>
    )}
  </>
)

export default FormattedLeadsTable
