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
  FormFeedback,
} from 'reactstrap'
import { useDispatch } from 'react-redux'
import Breadcrumbs from '../../components/Common/Breadcrumb'
import {
  importLeadsRequest,
  confirmImportLeads,
} from '../../store/importarLeads/actions'
import { useImportarLeadsSelector } from '../../store/importarLeads/selectors'
import Spinners from '../../components/Common/Spinner'
import { ToastContainer } from 'react-toastify'
import { processLeads } from '../../service/importarLeadsService'
import BoardStepSelector from '../../components/Common/BoardStepSelector'
import FormattedLeadsTable from './FormattedLeadsTable'
import DiscardedLeadsTable from './DiscardedLeadsTable'
import ImportSummary from './ImportSummary'

const ImportarLeads = () => {
  const dispatch = useDispatch()
  const { data, loading, error } = useImportarLeadsSelector()
  const [file, setFile] = useState(null)
  const [formattedLeads, setFormattedLeads] = useState([])
  const [summary, setSummary] = useState({
    companies: 0,
    contacts: 0,
    discarded: 0,
  })
  const [discardedLeads, setDiscardedLeads] = useState([])
  const [boardId, setBoardId] = useState('')
  const [stepId, setStepId] = useState('')

  useEffect(() => {
    if (data) {
      const { validLeads, invalidLeads } = processLeads(data)
      setFormattedLeads(validLeads)
      setDiscardedLeads(invalidLeads)
      setSummary({
        companies: validLeads.length,
        contacts: validLeads.reduce(
          (acc, lead) => acc + (lead.contact ? 1 : 0),
          0
        ),
        discarded: invalidLeads.length,
      })
    }
  }, [data])

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0]
    setFile(uploadedFile)
  }

  const handleSubmit = () => {
    dispatch(importLeadsRequest(file))
  }

  const handleConfirmImport = () => {
    dispatch(confirmImportLeads({ formattedLeads, boardId, stepId }))
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Importar" breadcrumbItem="Leads" />
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
                      <Input type="file" onChange={handleFileUpload} />
                      {error && <FormFeedback>{error}</FormFeedback>}
                    </div>
                    <Button
                      color="primary"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? <Spinners /> : 'Importar Leads'}
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {formattedLeads.length > 0 && <ImportSummary summary={summary} />}

          {formattedLeads.length > 0 && (
            <FormattedLeadsTable
              formattedLeads={formattedLeads}
              handleConfirmImport={handleConfirmImport}
              loading={loading}
            />
          )}

          {discardedLeads.length > 0 && (
            <DiscardedLeadsTable discardedLeads={discardedLeads} />
          )}

          <ToastContainer />
        </Container>
      </div>
    </React.Fragment>
  )
}

export default ImportarLeads
