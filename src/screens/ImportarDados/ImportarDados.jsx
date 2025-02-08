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
import { useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { readExcelFile } from '../../service/importarLeadsService'
import BoardStepSelector from '../../components/Common/BoardStepSelector'
import { useImportData } from '../../store/importData/importData'
import { getLoggedInUser } from '../../helpers/backend_helper'
import {
  createLeads as onCreateLeads,
} from '../../store/peoples/actions'
import { useDispatch } from 'react-redux'
import { isNull } from 'lodash'

const ImportarDados = () => {
  const dispatch = useDispatch()
  //const importDataMutation = useImportData()
  //const { mutateAsync: importData } = importDataMutation
  const { importData, addRelation } = useImportData()

  const [file, setFile] = useState(null)
  const [columns, setColumns] = useState([])
  const [data, setData] = useState([])
  const [mapping, setMapping] = useState({})
  const [formattedData, setFormattedData] = useState([])
  const [invalidData, setInvalidData] = useState([])
  const [boardId, setBoardId] = useState('')
  const [stepId, setStepId] = useState('')
  const [steps, setSteps] = useState([])
  const [loading, setLoading] = useState(false)
  const [importStatus, setImportStatus] = useState([])

  // Novos estados para controle do progresso
  const [isImporting, setIsImporting] = useState(false)
  const [completedImports, setCompletedImports] = useState(0)
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(null)
  const [isImportingEnd, setIsImportingEnd] = useState(false)

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const q = queryParams.get('q')
  const type = queryParams.get('type')

  // Função para corrigir problemas de codificação
  function fixEncoding(str) {
    try {
      // Tenta decodificar como UTF-8
      return decodeURIComponent(escape(str))
    } catch (e) {
      // Se falhar, retorna a string original
      return str
    }
  }

  // Função para normalizar cada linha de dados
  function normalizeRow(row) {
    const normalizedRow = {}
    for (const key in row) {
      if (typeof row[key] === 'string') {
        normalizedRow[key] = fixEncoding(row[key])
      } else {
        normalizedRow[key] = row[key]
      }
    }
    return normalizedRow
  }

  const handleFileUpload = async () => {
    setLoading(true)
    try {
      const jsonData = await readExcelFile(file)
      // Normaliza os dados
      const normalizedData = jsonData.map(normalizeRow)
      const allKeys = new Set()
      normalizedData.forEach(row => {
        Object.keys(row).forEach(key => {
          allKeys.add(key)
        })
      })
      const columnNames = Array.from(allKeys)
      setColumns(columnNames)
      setData(normalizedData)
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
    setImportStatus(new Array(validLeads.length).fill(''))
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
      const company = {
        name: row[mapping['company_name']],
        alias: row[mapping['company_name']],
        documents: row[mapping['company_cnpj']] ? [{ type: 'cnpj', value: row[mapping['company_cnpj']] }] : [],
        sector: row[mapping['company_setor']],
        category: row[mapping['company_setorCategoria']],
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

      const isValidCompany =
        row[mapping['company_name']]

      if (!isValidCompany) {
        invalidLeads.push({ ...row, reason: 'Nome da empresa é obrigatorio' })
        return
      }

      const agency = null
      // const agency = row[mapping['agency_name']]
      //   ? {
      //       name: row[mapping['agency_name']],
      //       alias: row[mapping['agency_alias']],
      //       documents: [{ type: 'cnpj', value: row[mapping['agency_cnpj']] }],
      //       contacts: [
      //         { type: 'servicos', value: row[mapping['agency_servicos']] },
      //         { type: 'phone', value: row[mapping['agency_phone']] },
      //         { type: 'celular', value: row[mapping['agency_celular']] },
      //         { type: 'email', value: row[mapping['agency_email']] },
      //         { type: 'linkedin', value: row[mapping['agency_linkedin']] },
      //       ].filter((contact) => contact.value),
      //       addresses: [
      //         {
      //           type: 'main_office',
      //           address: row[mapping['agency_address']],
      //           city: row[mapping['agency_city']],
      //           state: row[mapping['agency_state']],
      //           zipcode: row[mapping['agency_zipcode']],
      //         },
      //       ].filter((address) => address.address),
      //       relations: [
      //         { _id: '{{id_da_company}}', type: 'company', description: '' },
      //       ],
      //     }
      //   : null


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

  const handleImport = async () => {
    setIsImporting(true)
    setCompletedImports(0)
    setEstimatedTimeRemaining(null)

    const newStatus = [...importStatus]
    const startTime = Date.now() // Para estimar o tempo restante
    for (let i = 0; i < formattedData.length; i++) {
      const itemStartTime = Date.now()
      const item = formattedData[i]
      try {
        const companyResponse = await importData({ type: 'company', ...item.company })
        const companyId = companyResponse._id

        // let agencyId = null
        // console.log('d')
        // if (item.agency) {
        //   const agencyResponse = await importData({
        //     type: 'agency',
        //     ...item.agency,
        //     relations: [{ _id: companyId, type: 'company', description: '' }],
        //   })
        //   console.log('f')
        //   agencyId = agencyResponse._id
        //   console.log(agencyId)
        //   console.log('g')
        // }

        let contactId = null
        if (item.contact) {
          const contactResponse = await importData({
            type: 'person',
            ...item.contact,
            relations: []
          })
          contactId = contactResponse._id
          await addRelation({
            id_company: companyId,
            people: contactId,
            description: '',
          })
        }

        if(q === 'funil'){
          const stetpStarter = steps.filter((e) => e.flags.starter)
          const userMeId = getLoggedInUser()?._id

          const payload = {
            step: stetpStarter[0]._id,
            owner: userMeId,
            origin: 'lista',
            title: '',
            type: 'engagement',
            company: companyId,
            agency: '',
            contacts: contactId ? [{
              person: contactId,
              ref:  companyId,
              strategic: true
            }] : [],
          }
          dispatch(
            onCreateLeads(boardId, payload, () => { console.log('Lead criado') })
          )
        }

        newStatus[i] = 'Importado com sucesso'
      } catch (error) {
        if(error.message){
          newStatus[i] = error.message
        }else{
          newStatus[i] = 'Erro na importação'
        }
      }
      setImportStatus([...newStatus])

      // Atualiza o progresso
      setCompletedImports(i + 1)

      // Estima o tempo restante
      const timeElapsed = Date.now() - startTime
      const averageTimePerItem = timeElapsed / (i + 1)
      const itemsRemaining = formattedData.length - (i + 1)
      const estimatedRemainingTime = itemsRemaining * averageTimePerItem
      setEstimatedTimeRemaining(estimatedRemainingTime)
    }

    setIsImporting(false)
    setIsImportingEnd(true)
  }

  const [selectedCompanyOrAgency, setSelectedCompanyOrAgency] = useState(null)

  const handleSelectionChange = (selected) => {
    setSelectedCompanyOrAgency(selected)
  }

  // Calcula os totais para o resumo final
  const totalImported = importStatus.filter(status => status === 'Importado com sucesso').length
  const totalErrors = importStatus.filter(status => status !== 'Importado com sucesso').length

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Importar" breadcrumbItem="Dados" />
          {(!isImportingEnd || isImporting) && (
            <>
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <Form>
                      {q === 'funil' ? (
                        <BoardStepSelector
                          setBoardId={setBoardId}
                          setStepId={setStepId}
                          shouldSelectStep={false}
                          setStepList={setSteps}
                        />
                      ) : null}
                      <div className="mb-3">
                        <Label>Arquivo Excel</Label>
                        <Input type="file" onChange={handleFileChange} />
                      </div>
                      <Button
                        color="primary"
                        onClick={handleFileUpload}
                        disabled={loading}
                      >
                        {loading ? <Spinners /> : 'Processar Lista'}
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
                            {/* <option value="agency_name">Nome da Agência</option>
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
                            <option value="agency_zipcode">CEP da Agência</option> */}
                          </Input>
                        </td>
                      ))}
                    </tr>
                  </thead>
                </Table>
                <Button
                  color="primary"
                  onClick={handleApplyMapping}
                  style={{ marginBottom: '40px', marginTop: '20px' }}
                >
                  Aplicar Mapeamento
                </Button>
              </>
            )}
            </>
          )}


          {formattedData.length > 0 && (
            <>
              <h4>Importações Aceitas ({formattedData.length})</h4>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <Table>
                  <thead>
                    <tr>
                      <th>Empresa</th>
                      {/* <th>Agência</th> */}
                      <th>Contato</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formattedData.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div>
                            <strong>Nome:</strong> {item.company.name}
                          </div>
                          <div>
                            <strong>CNPJ:</strong>{' '}
                            {item.company.documents[0]?.value || 'N/A'}
                          </div>
                          <div>
                            <strong>Setor:</strong>{' '}
                            {item.company.contacts.find((c) => c.type === 'setor')
                              ?.value || 'N/A'}
                          </div>
                          <div>
                            <strong>Categoria:</strong>{' '}
                            {item.company.contacts.find(
                              (c) => c.type === 'setorCategoria'
                            )?.value || 'N/A'}
                          </div>
                          <div>
                            <strong>Telefone:</strong>{' '}
                            {item.company.contacts.find((c) => c.type === 'phone')
                              ?.value || 'N/A'}
                          </div>
                          <div>
                            <strong>Email:</strong>{' '}
                            {item.company.contacts.find((c) => c.type === 'email')
                              ?.value || 'N/A'}
                          </div>
                        </td>
                        <td>
                          {item.contact ? (
                            <div>
                              <div>
                                <strong>Nome:</strong> {item.contact.name}
                              </div>
                              <div>
                                <strong>CPF:</strong>{' '}
                                {item.contact.documents[0]?.value || 'N/A'}
                              </div>
                              <div>
                                <strong>Cargo:</strong>{' '}
                                {item.contact.contacts.find(
                                  (c) => c.type === 'cargo'
                                )?.value || 'N/A'}
                              </div>
                              <div>
                                <strong>Telefone:</strong>{' '}
                                {item.contact.contacts.find(
                                  (c) => c.type === 'phone'
                                )?.value || 'N/A'}
                              </div>
                              <div>
                                <strong>Email:</strong>{' '}
                                {item.contact.contacts.find(
                                  (c) => c.type === 'email'
                                )?.value || 'N/A'}
                              </div>
                            </div>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td>{importStatus[index]}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Botão ou progresso de importação */}
              {!isImporting && completedImports < formattedData.length ? (
                <Button
                  color="success"
                  onClick={handleImport}
                  style={{ marginBottom: '40px', marginTop: '20px' }}
                >
                  Concluir e Importar
                </Button>
              ) : isImporting ? (
                <div style={{ marginBottom: '40px', marginTop: '20px' }}>
                  {completedImports} concluídas de {formattedData.length} registros...
                  {estimatedTimeRemaining !== null && (
                    <div>
                      Tempo estimado restante: {Math.ceil(estimatedTimeRemaining / 1000)} segundos
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ marginBottom: '40px', marginTop: '20px' }}>
                  Importação finalizada. Tivemos {totalImported} itens importados com sucesso.
                  {totalErrors > 0 && ` ${totalErrors} erros totalizando ${formattedData.length} importações.`}
                </div>
              )}
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
                      <td>
                        {Object.keys(item).map((key) => {
                          if (key !== 'reason') {
                            return (
                              <div key={key}>
                                <strong>{key}:</strong> {item[key]}
                              </div>
                            )
                          }
                          return null
                        })}
                      </td>
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

export default ImportarDados
