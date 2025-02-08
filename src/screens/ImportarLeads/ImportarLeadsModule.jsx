import React, { useState, useEffect } from 'react'
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Button,
  Form,
  Label,
  Input,
  Table,
} from 'reactstrap'
import Breadcrumbs from '/src/components/Common/Breadcrumb'
import Spinners from '/src/components/Common/Spinner'
import { ToastContainer } from 'react-toastify'
import { readExcelFile } from '../../service/importarLeadsService'
import BoardStepSelector from '../../components/Common/BoardStepSelector'

const ImportarLeads = () => {
  const [file, setFile] = useState(null)
  const [columns, setColumns] = useState([])
  const [data, setData] = useState([])
  const [mapping, setMapping] = useState({})
  const [formattedData, setFormattedData] = useState([])
  const [invalidData, setInvalidData] = useState([])
  const [boardId, setBoardId] = useState('')
  const [stepId, setStepId] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (file) {
      handleFileUpload()
    }
  }, [file])

  const handleFileUpload = async () => {
    setLoading(true)
    try {
      const jsonData = await readExcelFile(file)
      const columnNames = Object.keys(jsonData[0])
      setColumns(columnNames)
      setData(jsonData)
    } catch (error) {
      console.error('Error reading file:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApplyMapping = () => {
    const { validLeads, invalidLeads } = processLeads(data, mapping)
    setFormattedData(validLeads)
    setInvalidData(invalidLeads)
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleMappingChange = (column, value) => {
    setMapping((prevMapping) => ({
      ...prevMapping,
      [value]: column,
    }))
  }

  const processLeads = (data, mapping) => {
    const validLeads = []
    const invalidLeads = []

    data.forEach((row) => {
      console.log('Processando linha:', JSON.stringify(row))

      const companyName = row[mapping['company_name']]
      const companyCnpj = row[mapping['company_cnpj']]

      const company = {
        name: companyName,
        alias: companyName,
        documents: [{ type: 'cnpj', value: companyCnpj }],
        contacts: [
          { type: 'setor', value: row[mapping['company_setor']] },
          {
            type: 'setorCategoria',
            value: row[mapping['company_setorCategoria']],
          },
          { type: 'phone', value: row[mapping['company_phone']] },
          { type: 'celular', value: row[mapping['company_celular']] },
          { type: 'email', value: row[mapping['company_email']] },
          { type: 'linkedin', value: row[mapping['company_linkedin']] },
        ].filter((contact) => contact.value),
        addresses: [
          {
            type: 'main_office',
            address: row[mapping['company_address']],
            city: row[mapping['company_city']],
            state: row[mapping['company_state']],
            zipcode: row[mapping['company_zipcode']],
          },
        ].filter((address) => address.address),
      }

      console.log('Nome da Empresa:', companyName)
      console.log('CNPJ da Empresa:', companyCnpj)
      console.log('Objeto Empresa:', JSON.stringify(company))

      const isValidCompany = companyName && companyCnpj

      if (!isValidCompany) {
        console.log('--------------------------------------')
        console.log('Mapping:', JSON.stringify(mapping))
        console.log('Company Name:', companyName)
        console.log('Company CNPJ:', companyCnpj)
        console.log('Generated Company Object:', JSON.stringify(company))
        console.log('Row Data:', JSON.stringify(row))
        console.log('--------------------------------------')
        invalidLeads.push({ ...row, reason: 'Nome ou CNPJ inválido' })
        return
      }

      const agency = row[mapping['agency_name']]
        ? {
            name: row[mapping['agency_name']],
            alias: row[mapping['agency_alias']],
            documents: [{ type: 'cnpj', value: row[mapping['agency_cnpj']] }],
            contacts: [
              { type: 'servicos', value: row[mapping['agency_servicos']] },
              { type: 'phone', value: row[mapping['agency_phone']] },
              { type: 'celular', value: row[mapping['agency_celular']] },
              { type: 'email', value: row[mapping['agency_email']] },
              { type: 'linkedin', value: row[mapping['agency_linkedin']] },
            ].filter((contact) => contact.value),
            addresses: [
              {
                type: 'main_office',
                address: row[mapping['agency_address']],
                city: row[mapping['agency_city']],
                state: row[mapping['agency_state']],
                zipcode: row[mapping['agency_zipcode']],
              },
            ].filter((address) => address.address),
            relations: [
              { _id: '{{id_da_company}}', type: 'company', description: '' },
            ],
          }
        : null

      const contact = row[mapping['contact_name']]
        ? {
            name: row[mapping['contact_name']],
            documents: [{ type: 'cpf', value: row[mapping['contact_cpf']] }],
            contacts: [
              { type: 'cargo', value: row[mapping['contact_cargo']] },
              { type: 'phone', value: row[mapping['contact_phone']] },
              { type: 'celular', value: row[mapping['contact_celular']] },
              { type: 'email', value: row[mapping['contact_email']] },
              { type: 'linkedin', value: row[mapping['contact_linkedin']] },
            ].filter((contact) => contact.value),
            relations: [
              { _id: '{{id_da_company}}', type: 'company', description: '' },
              agency
                ? { _id: '{{id_da_agency}}', type: 'agency', description: '' }
                : null,
            ].filter((relation) => relation),
          }
        : null

      validLeads.push({ company, agency, contact })
    })

    return { validLeads, invalidLeads }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Importar" breadcrumbItem="Dados" />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <Form>
                    <BoardStepSelector
                      setBoardId={setBoardId}
                      setStepId={setStepId}
                      shouldSelectStep={true}
                      setStepList={null}
                    />
                    <div className="mb-3">
                      <Label>Arquivo Excel</Label>
                      <Input type="file" onChange={handleFileChange} />
                    </div>
                    <Button
                      color="primary"
                      onClick={handleApplyMapping}
                      disabled={loading}
                    >
                      {loading ? <Spinners /> : 'Aplicar Mapeamento'}
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {columns.length > 0 && (
            <>
              <h4>Mapeamento de Colunas</h4>
              <Table>
                <thead>
                  <tr>
                    {columns.map((column, index) => (
                      <th key={index}>{column}</th>
                    ))}
                  </tr>
                  <tr>
                    {columns.map((column, index) => (
                      <td key={index}>
                        <Input
                          type="select"
                          onChange={(e) =>
                            handleMappingChange(column, e.target.value)
                          }
                        >
                          <option value="">Selecionar</option>
                          <option value="company_name">Nome da Empresa</option>
                          <option value="company_cnpj">CNPJ da Empresa</option>
                          <option value="company_setor">
                            Setor da Empresa
                          </option>
                          <option value="company_setorCategoria">
                            Categoria da Empresa
                          </option>
                          <option value="company_phone">
                            Telefone da Empresa
                          </option>
                          <option value="company_celular">
                            Celular da Empresa
                          </option>
                          <option value="company_email">
                            Email da Empresa
                          </option>
                          <option value="company_linkedin">
                            LinkedIn da Empresa
                          </option>
                          <option value="company_address">
                            Endereço da Empresa
                          </option>
                          <option value="company_city">
                            Cidade da Empresa
                          </option>
                          <option value="company_state">
                            Estado da Empresa
                          </option>
                          <option value="company_zipcode">
                            CEP da Empresa
                          </option>
                          <option value="agency_name">Nome da Agência</option>
                          <option value="agency_alias">Alias da Agência</option>
                          <option value="agency_cnpj">CNPJ da Agência</option>
                          <option value="agency_servicos">
                            Serviços da Agência
                          </option>
                          <option value="agency_phone">
                            Telefone da Agência
                          </option>
                          <option value="agency_celular">
                            Celular da Agência
                          </option>
                          <option value="agency_email">Email da Agência</option>
                          <option value="agency_linkedin">
                            LinkedIn da Agência
                          </option>
                          <option value="agency_address">
                            Endereço da Agência
                          </option>
                          <option value="agency_city">Cidade da Agência</option>
                          <option value="agency_state">
                            Estado da Agência
                          </option>
                          <option value="agency_zipcode">CEP da Agência</option>
                          <option value="contact_name">Nome do Contato</option>
                          <option value="contact_cpf">CPF do Contato</option>
                          <option value="contact_cargo">
                            Cargo do Contato
                          </option>
                          <option value="contact_phone">
                            Telefone do Contato
                          </option>
                          <option value="contact_celular">
                            Celular do Contato
                          </option>
                          <option value="contact_email">
                            Email do Contato
                          </option>
                          <option value="contact_linkedin">
                            LinkedIn do Contato
                          </option>
                        </Input>
                      </td>
                    ))}
                  </tr>
                </thead>
              </Table>
              <Button color="primary" onClick={handleApplyMapping}>
                Aplicar Mapeamento
              </Button>
            </>
          )}

          {formattedData.length > 0 && (
            <>
              <h4>Importações Aceitas</h4>
              <Table>
                <thead>
                  <tr>
                    <th>Empresa</th>
                    <th>Agência</th>
                    <th>Contato</th>
                  </tr>
                </thead>
                <tbody>
                  {formattedData.map((item, index) => (
                    <tr key={index}>
                      <td>{JSON.stringify(item.company)}</td>
                      <td>
                        {item.agency ? JSON.stringify(item.agency) : 'N/A'}
                      </td>
                      <td>
                        {item.contact ? JSON.stringify(item.contact) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}

          {invalidData.length > 0 && (
            <>
              <h4>Dados Inválidos</h4>
              <Table>
                <thead>
                  <tr>
                    <th>Erro</th>
                    <th>Detalhes</th>
                  </tr>
                </thead>
                <tbody>
                  {invalidData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.reason}</td>
                      <td>{JSON.stringify(item)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}

          <ToastContainer />
        </Container>
      </div>
    </React.Fragment>
  )
}

export default ImportarLeads
