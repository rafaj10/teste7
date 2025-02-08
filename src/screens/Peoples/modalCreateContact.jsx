import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  Label,
  Input,
  Button,
  FormFeedback,
} from 'reactstrap';
import '../../App.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Spinners from '../../components/Common/Spinner';
// Form Mask
import InputMask from 'react-input-mask';
import { ToastContainer } from 'react-toastify';

// Importar ReactTags
import { WithContext as ReactTags } from 'react-tag-input';
import './../../helpers/ReactTags.css'; // Ajuste o caminho conforme necessário

const ModalCreateContact = (props) => {
  // Estados para as tags
  const [tags, setTags] = useState([]);

  const handleDeleteTag = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAdditionTag = (tag) => {
    setTags([...tags, tag]);
  };

  useEffect(() => {
    // Inicializar as tags se estiver em modo de edição
    if (props.editing && props.editing.tags) {
      setTags(props.editing.tags.map((tag) => ({ id: tag, text: tag })));
    } else {
      // Se não estiver editando, inicializar com array vazio
      setTags([]);
    }
  }, [props.editing]);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      relationDescription: props.editing ? props.editing.relationDescription : '',
      nome: props.editing ? props.editing.name : '',
      sobrenome: props.editing ? findValue(props.editing.contacts, 'sobrenome') : '',
      datanascimento: props.editing ? findValue(props.editing.contacts, 'datanascimento') : '',
      email: props.editing ? findValue(props.editing.contacts, 'email') : '',
      cargo: props.editing ? findValue(props.editing.contacts, 'cargo') : '',
      telefone: props.editing ? findValue(props.editing.contacts, 'telefone') : '',
      celular: props.editing ? findValue(props.editing.contacts, 'celular') : '',
      linkedin: props.editing ? findValue(props.editing.contacts, 'linkedin') : '',
    },
    validationSchema: Yup.object({
      nome: Yup.string().required('Preencha o Nome'),
      email: Yup.string().required('Preencha o E-mail'),
    }),
    onSubmit: (values) => {
      const payload = {
        name: values.nome,
        alias: values.nome,
        contacts: [
          { type: 'sobrenome', value: values.sobrenome },
          { type: 'datanascimento', value: values.datanascimento },
          { type: 'email', value: values.email },
          { type: 'cargo', value: values.cargo },
          { type: 'telefone', value: values.telefone },
          { type: 'celular', value: values.celular },
          { type: 'linkedin', value: values.linkedin },
        ],
      };

      if (props.relation) {
        payload['relations'] = [
          {
            people: props.relation._id,
            type: props.relation.type,
            description: '',
          },
        ];
      }

      // Incluir as tags no payload, mesmo se estiver vazio
      payload.tags = tags.map((tag) => tag.text);

      props.editing
        ? props.updatePeople(props.editing._id, payload)
        : props.createPeople(payload);
    },
  });

  function findValue(arr, type) {
    if (!arr) return '';
    let myValue = '';
    arr.forEach((item) => {
      if (item.type.toLowerCase() === type) myValue = item.value;
    });
    return myValue;
  }

  return (
    <React.Fragment>
      <Modal
        id="modalForm"
        isOpen={props.modal}
        toggle={props.toggle}
        fade={false}
        style={{
          position: 'fixed',
          margin: 'auto',
          right: '0px',
          minWidth: '50%',
          height: '100%',
          minHeight: '100%',
        }}
        contentClassName="modal-full-height"
        size="lg"
      >
        <ModalHeader toggle={props.toggle}>
          {props.editing
            ? 'Editar dados do ' + props.typeName
            : 'Adicionar ' + props.typeName}
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
          >
            <Row>
              <Col xs="12">
                {/* Dados da empresa*/}
                <Card>
                  <CardBody>
                    <Row>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label className="form-label">Nome</Label>
                          <Input
                            name="nome"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.nome || ''}
                            invalid={
                              validation.touched.nome && validation.errors.nome
                                ? true
                                : false
                            }
                          />
                          {validation.touched.nome && validation.errors.nome ? (
                            <FormFeedback type="invalid">
                              {validation.errors.nome}
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="site">E-mail</Label>
                          <Input
                            name="email"
                            className="form-control"
                            type="email"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ''}
                            invalid={
                              validation.touched.email && validation.errors.email
                                ? true
                                : false
                            }
                          />
                          {validation.touched.email && validation.errors.email ? (
                            <FormFeedback type="invalid">
                              {validation.errors.email}
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="endereco">Telefone</Label>
                          <InputMask
                            mask="99 9999-9999"
                            alwaysShowMask={true}
                            maskChar={null}
                            name="telefone"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.telefone || ''}
                            invalid={
                              validation.touched.telefone && validation.errors.telefone
                                ? true
                                : false
                            }
                            className="form-control input-color"
                          >
                            {(inputProps) => (
                              <Input
                                {...inputProps}
                                type="text"
                                name="telefone"
                                className="form-control"
                              />
                            )}
                          </InputMask>
                          {validation.touched.telefone && validation.errors.telefone ? (
                            <FormFeedback type="invalid">
                              {validation.errors.telefone}
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="endereco">Linkedin</Label>
                          <Input
                            name="linkedin"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.linkedin || ''}
                            invalid={
                              validation.touched.linkedin && validation.errors.linkedin
                                ? true
                                : false
                            }
                          />
                          {validation.touched.linkedin && validation.errors.linkedin ? (
                            <FormFeedback type="invalid">
                              {validation.errors.linkedin}
                            </FormFeedback>
                          ) : null}
                        </div>
                        {/* Campo de Tags */}
                        <div className="mb-3">
                          <Label className="form-label">Tags</Label>
                          <ReactTags
                            tags={tags}
                            handleDelete={handleDeleteTag}
                            handleAddition={handleAdditionTag}
                            placeholder="Digite e pressione Enter para adicionar uma nova tag"
                            inputFieldPosition="bottom"
                            autocomplete
                            classNames={{
                              tags: 'd-flex flex-wrap align-items-center',
                              tagInput: 'flex-grow-1',
                              tagInputField: 'form-control border-0',
                              selected: 'd-flex flex-wrap',
                              tag: 'badge bg-primary me-1 mb-1',
                              remove: 'ms-1',
                            }}
                          />
                        </div>
                      </Col>

                      <Col sm="6">
                        <div className="mb-3">
                          <Label className="control-label">Sobrenome</Label>
                          <Input
                            name="sobrenome"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.sobrenome || ''}
                            invalid={
                              validation.touched.sobrenome && validation.errors.sobrenome
                                ? true
                                : false
                            }
                          />
                          {validation.touched.sobrenome && validation.errors.sobrenome ? (
                            <FormFeedback type="invalid">
                              {validation.errors.sobrenome}
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="endereco">Celular</Label>
                          <InputMask
                            mask="99 9 9999-9999"
                            alwaysShowMask={true}
                            maskChar={null}
                            name="celular"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.celular || ''}
                            invalid={
                              validation.touched.celular && validation.errors.celular
                                ? true
                                : false
                            }
                            className="form-control input-color"
                          >
                            {(inputProps) => (
                              <Input
                                {...inputProps}
                                type="text"
                                name="celular"
                                className="form-control"
                              />
                            )}
                          </InputMask>
                          {validation.touched.celular && validation.errors.celular ? (
                            <FormFeedback type="invalid">
                              {validation.errors.celular}
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label className="control-label">Data de nascimento</Label>
                          <InputMask
                            mask="99/99/9999"
                            alwaysShowMask={true}
                            maskChar={null}
                            name="datanascimento"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.datanascimento || ''}
                            invalid={
                              validation.touched.datanascimento && validation.errors.datanascimento
                                ? true
                                : false
                            }
                            className="form-control input-color"
                          >
                            {(inputProps) => (
                              <Input
                                {...inputProps}
                                type="text"
                                name="datanascimento"
                                className="form-control"
                              />
                            )}
                          </InputMask>
                          {validation.touched.datanascimento && validation.errors.datanascimento ? (
                            <FormFeedback type="invalid">
                              {validation.errors.datanascimento}
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label className="control-label">Cargo</Label>
                          <Input
                            name="cargo"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.cargo || ''}
                            invalid={
                              validation.touched.cargo && validation.errors.cargo
                                ? true
                                : false
                            }
                          />
                          {validation.touched.cargo && validation.errors.cargo ? (
                            <FormFeedback type="invalid">
                              {validation.errors.cargo}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg={20}>
                <div className="d-flex flex-wrap gap-2">
                  {props.isCreateLoading ? (
                    <div style={{ height: '70px' }}>
                      <Spinners setLoading={true} />
                    </div>
                  ) : (
                    <React.Fragment>
                      <Button type="submit" color="primary">
                        {props.editing ? 'Editar' : 'Confirmar'}
                      </Button>
                      <Button type="button" color="secondary" onClick={props.toggle}>
                        Cancelar
                      </Button>
                    </React.Fragment>
                  )}
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
      <ToastContainer />
    </React.Fragment>
  );
};

export default ModalCreateContact;
