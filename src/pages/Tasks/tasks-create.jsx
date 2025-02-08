import React, { useState } from 'react'
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Input,
  FormGroup,
  Label,
  Button,
} from 'reactstrap'

// Import Editor
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

// FlatPickr
import 'flatpickr/dist/themes/material_blue.css'
import FlatPickr from 'react-flatpickr'

//Import Breadcrumb
import Breadcrumbs from '/src/components/Common/Breadcrumb'

const TasksCreate = () => {
  //meta title
  document.title = 'Create Task | Skote - Vite React Admin & Dashboard Template'

  const inpRow = [{ name: '', file: '' }]
  const [startDate, setstartDate] = useState(new Date())
  const [endDate, setendDate] = useState(new Date())
  const [inputFields, setinputFields] = useState(inpRow)

  const startDateChange = (date) => {
    setstartDate(date)
  }

  const endDateChange = (date) => {
    setendDate(date)
  }

  // Function for Create Input Fields
  function handleAddFields() {
    const item1 = { name: '', file: '' }
    setinputFields([...inputFields, item1])
  }

  // Function for Remove Input Fields
  function handleRemoveFields(idx) {
    document.getElementById('nested' + idx).style.display = 'none'
  }

  return (
    <>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Funil" breadcrumbItem="Criar Workflow" />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">Create Novo Workflow</CardTitle>
                  <form className="outer-repeater">
                    <div data-repeater-list="outer-group" className="outer">
                      <div data-repeater-item className="outer">
                        <FormGroup className="mb-4" row>
                          <Label
                            htmlFor="taskname"
                            className="col-form-label col-lg-2"
                          >
                            Nome do Workflow
                          </Label>
                          <Col lg="10">
                            <Input
                              id="taskname"
                              name="taskname"
                              type="text"
                              className="form-control"
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup className="mb-4" row>
                          <Label className="col-form-label col-lg-2">
                            Descrição do Workflow
                          </Label>
                          <Col lg="10">
                            <CKEditor
                              editor={ClassicEditor}
                              data=""
                              onReady={(editor) => {
                                // You can store the "editor" and use when it is needed.
                                // console.log('Editor is ready to use!', editor);
                              }}
                              onChange={(event, editor) => {
                                const data = editor.getData()
                              }}
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup className="mb-4" row>
                          <Label
                            htmlFor="taskname"
                            className="col-form-label col-lg-2"
                          >
                            Nome da atividade
                          </Label>
                          <Col lg="10">
                            <Input
                              id="taskname"
                              name="taskname"
                              type="text"
                              className="form-control"
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup className="mb-4" row>
                          <Label className="col-form-label col-lg-2">
                            Período
                          </Label>
                          <Col lg="10">
                            <Row>
                              <Col md={6} className="pr-0">
                                <FlatPickr
                                  className="form-control"
                                  name="joiningDate"
                                  options={{
                                    dateFormat: 'd M,Y',
                                  }}
                                  placeholder="Inicio"
                                  selected={startDate}
                                  onChange={startDateChange}
                                />
                              </Col>
                              <Col md={6} className="pl-0">
                                <FlatPickr
                                  className="form-control"
                                  options={{
                                    dateFormat: 'd M,Y',
                                  }}
                                  name="joiningDate"
                                  placeholder="Fim"
                                  selected={endDate}
                                  onChange={endDateChange}
                                />
                              </Col>
                            </Row>
                          </Col>
                        </FormGroup>
                      </div>
                    </div>
                  </form>
                  <Row className="justify-content-end">
                    <Col lg="10">
                      <Button type="submit" color="primary">
                        Criar workflow
                      </Button>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default TasksCreate
