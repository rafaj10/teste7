import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
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
import InputMask from 'react-input-mask';
import { ToastContainer } from 'react-toastify';
import SectorAndCategorySelector from '../../components/Common/CategoryMultiSelector/SectorAndCategorySelector';
import { useDispatch } from 'react-redux';
import { fetchCepRequest } from '../../store/cep/actions';
import { useCepSelector } from '../../store/cep/selectors';

// Importar ReactTags
import { WithContext as ReactTags } from 'react-tag-input';
import './../../helpers/ReactTags.css'; // Ajuste o caminho conforme necessário

const ModalCreate = (props) => {
  const optionsTamanho = [
    { value: 'Pequena', label: 'Pequena' },
    { value: 'Média', label: 'Média' },
    { value: 'Grande', label: 'Grande' },
  ];

  const optionsTipoServico = [
    { value: '360', label: '360' },
    { value: 'Publicidade', label: 'Publicidade' },
    { value: 'Digital', label: 'Digital' },
    { value: 'Mkt Direto', label: 'Mkt Direto' },
    { value: 'Evento', label: 'Evento' },
  ];

  const optionsEstados = [
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' },
    { value: 'DF', label: 'Distrito Federal' },
  ];

  const dispatch = useDispatch();
  const { cepData } = useCepSelector();

  const [selectedValues, setSelectedValues] = useState({
    sector: '',
    category: '',
  });

  const handleSelectionChange = (values) => {
    setSelectedValues(values);
  };

  // Estados para as tags
  const [tags, setTags] = useState([]);

  const handleDeleteTag = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAdditionTag = (tag) => {
    setTags([...tags, tag]);
  };

  useEffect(() => {
    if (props.editing && props.typeName !== 'Agencia') {
      setSelectedValues({
        sector: props.editing.sector || '',
        category: props.editing.category || '',
      });
    }

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
      cnpj: props.editing ? findValue(props.editing.documents, 'cnpj') : '',
      site: props.editing ? findValue(props.editing.contacts, 'site') : '',
      setor: props.editing ? findValue(props.editing.contacts, 'setor') : '',
      cep: props.editing ? findAddressesValue('zipcode') : '',
      endereco: props.editing ? findAddressesValue('address') : '',
      cidade: props.editing ? findAddressesValue('city') : '',
      estado: props.editing ? findAddressesValue('state') : '',
      tipo_servico: props.editing ? findValue(props.editing.contacts, 'tipo_servico') : '',
    },
    validationSchema: Yup.object({
      nome: Yup.string().required('Preencha o nome'),
      // cnpj: Yup.string()
      //   .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/, 'CNPJ precisa ser válido ex: 00.000.000/0001-00')
      //   .required('Preencha o CNPJ'),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        name: values.nome,
        alias: values.nome,
        documents: [{ type: 'cnpj', value: values.cnpj }],
        addresses: [
          {
            type: 'Principal',
            address: values.endereco,
            city: values.cidade,
            state: values.estado,
            zipcode: values.cep,
          },
        ],
        contacts: [
          // { type: 'cnpj', value: values.cnpj },
          { type: 'site', value: values.site },
        ],
      };

      if (props.typeName === 'Agencia') {
        payload.contacts.push({ type: 'tipo_servico', value: values.tipo_servico });
      } else {
        payload.category = selectedValues.category.split('|')[1];
        payload.sector = selectedValues.sector;
      }

      if (props.relation) {
        payload.relations = [
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
      resetForm();
    },
  });

  useEffect(() => {
    if (validation.values.cep && validation.values.cep.length === 9) {
      const cepWithoutDash = validation.values.cep.replace('-', '');
      dispatch(fetchCepRequest(cepWithoutDash));
    }
  }, [validation.values.cep, dispatch]);

  useEffect(() => {
    if (cepData && validation.values.cep.replace('-', '') === cepData.cep) {
      validation.setFieldValue('endereco', cepData.address || '');
      validation.setFieldValue('cidade', cepData.city || '');
      validation.setFieldValue('estado', cepData.state || '');
    }
  }, [cepData]);

  function findValue(arr, type) {
    if (!arr) return '';
    let myValue = '';
    arr.forEach((item) => {
      if (item.type.toLowerCase() === type) myValue = item.value;
    });
    return myValue;
  }

  function findAddressesValue(type) {
    if (!props.editing) return '';
    let myValue = '';
    if (props.editing.addresses) {
      const add = props.editing.addresses;
      if (add.length > 0) {
        myValue = add[0][type];
      }
    }
    return myValue;
  }

  return (
    <React.Fragment>
      <Offcanvas
        id="modalForm"
        isOpen={props.modal}
        toggle={props.toggle}
        direction="end"
        style={{
          minWidth: '50%',
        }}
      >
        <OffcanvasHeader
          toggle={props.toggle}
          style={{
            background: 'linear-gradient(135deg, #54398b 0%, #6b52a1 100%)',
            color: '#fff',
          }}
        >
          {props.editing
            ? 'Editar dados da ' + props.typeName
            : 'Adicionar ' + props.typeName}
        </OffcanvasHeader>
        <OffcanvasBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
            style={{
              height: '100%',
            }}
          >
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>
                    <Row>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label className="form-label">Nome Fantasia</Label>
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
                          <Label htmlFor="cep">CEP</Label>
                          <InputMask
                            mask="99999-999"
                            alwaysShowMask={true}
                            maskChar={null}
                            name="cep"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.cep || ''}
                            invalid={
                              validation.touched.cep && validation.errors.cep
                                ? true
                                : false
                            }
                            className="form-control input-color"
                          >
                            {(inputProps) => (
                              <Input
                                {...inputProps}
                                type="text"
                                name="cep"
                                className="form-control"
                              />
                            )}
                          </InputMask>
                          {validation.touched.cep && validation.errors.cep ? (
                            <FormFeedback type="invalid">
                              {validation.errors.cep}
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="endereco">Endereço</Label>
                          <Input
                            name="endereco"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.endereco || ''}
                            invalid={
                              validation.touched.endereco &&
                              validation.errors.endereco
                                ? true
                                : false
                            }
                          />
                          {validation.touched.endereco &&
                          validation.errors.endereco ? (
                            <FormFeedback type="invalid">
                              {validation.errors.endereco}
                            </FormFeedback>
                          ) : null}
                        </div>

                        {props.typeName === 'Agencia' ? (
                          <div className="mb-3">
                            <Label htmlFor="tamanho">Tipo de serviço</Label>
                            <Input
                              type="select"
                              name="tipo_servico"
                              className="form-select"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.tipo_servico || []}
                              invalid={
                                validation.touched.tipo_servico &&
                                validation.errors.tipo_servico
                                  ? true
                                  : false
                              }
                            >
                              <option></option>
                              {optionsTipoServico.map((item) => (
                                <option value={item.value} key={item.value}>
                                  {item.label}
                                </option>
                              ))}
                            </Input>
                            {validation.touched.tipo_servico &&
                            validation.errors.tipo_servico ? (
                              <FormFeedback type="invalid">
                                {validation.errors.tipo_servico}
                              </FormFeedback>
                            ) : null}
                          </div>
                        ) : (
                          <div className="mb-3">
                            <Label className="form-label">Setor e Categoria</Label>
                            <SectorAndCategorySelector
                              onChange={handleSelectionChange}
                              initialSector={
                                props.editing && props.typeName !== 'Agencia'
                                  ? props.editing.sector || ''
                                  : ''
                              }
                              initialCategory={
                                props.editing && props.typeName !== 'Agencia'
                                  ? `${props.editing.sector}|${props.editing.category}` || ''
                                  : ''
                              }
                            />
                          </div>
                        )}

                        {/* Campo de Tags */}
                        <div className="mb-3">
                          <Label className="form-label">Tags</Label>
                          <ReactTags
                            tags={tags}
                            handleDelete={handleDeleteTag}
                            handleAddition={handleAdditionTag}
                            inputFieldPosition="bottom"
                            placeholder="Digite e pressione Enter para adicionar uma nova tag"
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
                          <Label className="control-label">CNPJ</Label>
                          <InputMask
                            mask="99.999.999/9999-99"
                            alwaysShowMask={true}
                            maskChar={null}
                            name="cnpj"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.cnpj || ''}
                            invalid={
                              validation.touched.cnpj && validation.errors.cnpj
                                ? true
                                : false
                            }
                            className="form-control input-color"
                          >
                            {(inputProps) => (
                              <Input
                                {...inputProps}
                                type="text"
                                name="cnpj"
                                className="form-control"
                              />
                            )}
                          </InputMask>
                          {validation.touched.cnpj && validation.errors.cnpj ? (
                            <FormFeedback type="invalid">
                              {validation.errors.cnpj}
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label className="control-label">Cidade</Label>
                          <Input
                            name="cidade"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.cidade || ''}
                            invalid={
                              validation.touched.cidade && validation.errors.cidade
                                ? true
                                : false
                            }
                          />
                          {validation.touched.cidade && validation.errors.cidade ? (
                            <FormFeedback type="invalid">
                              {validation.errors.cidade}
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label className="control-label">Estado</Label>
                          <Input
                            type="select"
                            name="estado"
                            className="form-select"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.estado || []}
                            invalid={
                              validation.touched.estado && validation.errors.estado
                                ? true
                                : false
                            }
                          >
                            <option></option>
                            {optionsEstados.map((item) => (
                              <option value={item.value} key={item.value}>
                                {item.label}
                              </option>
                            ))}
                          </Input>
                          {validation.touched.estado && validation.errors.estado ? (
                            <FormFeedback type="invalid">
                              {validation.errors.estado}
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label className="form-label">Site</Label>
                          <Input
                            name="site"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.site || ''}
                            invalid={
                              validation.touched.site && validation.errors.site
                                ? true
                                : false
                            }
                          />
                          {validation.touched.site && validation.errors.site ? (
                            <FormFeedback type="invalid">
                              {validation.errors.site}
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
        </OffcanvasBody>
      </Offcanvas>
      <ToastContainer />
    </React.Fragment>
  );
};

export default ModalCreate;
