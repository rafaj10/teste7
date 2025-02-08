import React, { useState } from "react";
import { Link } from "react-router-dom";
import Dropzone from "react-dropzone";
import { Button, Card, CardBody, CardTitle, Col, Container, Form, FormFeedback, FormGroup, Input, Label, Row } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

// FlatPickr
import "flatpickr/dist/themes/material_blue.css";
import FlatPickr from "react-flatpickr";

import * as Yup from "yup";
import { useFormik } from "formik";
import moment from "moment";

const LeadImportar = () => {

  //meta title
  document.title = "7startos | Importar leads";

  const [selectedFiles, setselectedFiles] = useState([]);
  function handleAcceptedFiles(files) {
    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size)
      })
    );

    setselectedFiles(files);
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      projectname: '',
      projectdesc: '',
      startDate: '',
      endDate: '',
      projectbudget: ''
    },
    validationSchema: Yup.object({
      projectname: Yup.string().required("Please Enter Your Project Name"),
      projectdesc: Yup.string().required("Please Enter Your Project desc"),
      startDate: Yup.string().required("Please Enter Your Start Date"),
      endDate: Yup.string().required("Please Enter Your End Date"),
      projectbudget: Yup.string().required("Please Enter Your Rating"),
    }),
    onSubmit: (values) => {
      validation.resetForm();
      toggle();
      setselectedFiles('')
    },
  });
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Funil" breadcrumbItem="Importar Leads" />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">Importar lista de leads</CardTitle>
                  <Form autoComplete="off" onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
                    return false;
                  }}>
                    <FormGroup className="mb-4" row>
                      <Label
                        htmlFor="projectname"
                        className="col-form-label col-lg-2"
                      >
                        Nome da importação
                      </Label>
                      <Col lg="10">
                        <Input
                          id="projectname"
                          name="projectname"
                          type="text"
                          className="form-control"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.projectname || ""}
                          invalid={
                            validation.touched.projectname && validation.errors.projectname ? true : false
                          }
                        />
                        {validation.touched.projectname && validation.errors.projectname ? (
                          <FormFeedback type="invalid">{validation.errors.projectname}</FormFeedback>
                        ) : null}
                      </Col>
                    </FormGroup>
                    <FormGroup className="mb-4" row>
                      <Label
                        htmlFor="projectdesc"
                        className="col-form-label col-lg-2"
                      >
                        Descrição da importação
                      </Label>
                      <Col lg="10">
                        <textarea
                          className="form-control"
                          id="projectdesc"
                          rows="3"
                          name="projectdesc"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.projectdesc || ""}
                        />
                        {validation.touched.projectdesc && validation.errors.projectdesc ? (
                          <FormFeedback type="invalid" className="d-block">{validation.errors.projectdesc}</FormFeedback>
                        ) : null}
                      </Col>
                    </FormGroup>

                    <Row className="mb-4">
                      <Label className="col-form-label col-lg-2">
                        Arquivo csv
                      </Label>
                      <Col lg="10">
                        <Dropzone
                          onDrop={acceptedFiles => {
                            handleAcceptedFiles(acceptedFiles);
                          }}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <div className="dropzone">
                              <div
                                className="dz-message needsclick"
                                {...getRootProps()}
                              >
                                <input {...getInputProps()} />
                                <div className="dz-message needsclick">
                                  <div className="mb-3">
                                    <i className="display-4 text-muted bx bxs-cloud-upload" />
                                  </div>
                                  <h4>Arraste teu arquivo (aqui) ou clique para selecionar.</h4>
                                </div>
                              </div>
                            </div>
                          )}
                        </Dropzone>
                        <div
                          className="dropzone-previews mt-3"
                          id="file-previews"
                        >
                          {selectedFiles.map((f, i) => {
                            return (
                              <Card
                                className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                key={i + "-file"}
                              >
                                <div className="p-2">
                                  <Row className="align-items-center">
                                    <Col className="col-auto">
                                      <img
                                        data-dz-thumbnail=""
                                        height="80"
                                        className="avatar-sm rounded bg-light"
                                        alt={f.name}
                                        src={f.preview}
                                      />
                                    </Col>
                                    <Col>
                                      <Link
                                        to="#"
                                        className="text-muted font-weight-bold"
                                      >
                                        {f.name}
                                      </Link>
                                      <p className="mb-0">
                                        <strong>{f.formattedSize}</strong>
                                      </p>
                                    </Col>
                                  </Row>
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                      </Col>
                      <Col lg="10">
                        <Button type="submit" color="primary">
                          Importar
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                  {/* <Row className="justify-content-end"> */}
                  {/* </Row> */}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default LeadImportar;
