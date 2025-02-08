import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Col,
  FormFeedback,
  Input,
  Label,
  Row,
} from 'reactstrap';
import InputMask from 'react-input-mask';
import { fetchCepRequest } from '../../../store/cep/actions';
import { useCepSelector } from '../../../store/cep/selectors';
import { getCategories } from '../../../store/categories/actions'
import { useCategorySelector } from '../../../store/categories/selectors'
import CompanyOrAgencySelector from '../../../components/Common/CompanyOrAgencySelector';
import Tour from 'reactour';

const findValue = (arr, type) => {
  if (!arr) return '';
  let myValue = '';
  arr.map((item) => {
    if (item.type.toLowerCase() === type) myValue = item.value;
  });
  return myValue;
};

const InfoLead = ({
  validation,
  selectedCompany,
  handleSelectionChange,
  setSelectedCompany,
  setSelectedAgency,
}) => {
  const dispatch = useDispatch();

  const { categories, loading } = useCategorySelector()

  useEffect(() => {
      dispatch(getCategories('origem'))
  }, [])

  const { cepData, loading: cepLoading, error: cepError } = useCepSelector();

  const [isTourOpen, setIsTourOpen] = useState(false);
  const tourSteps = [
    {
      selector: '.origin-select',
      content: 'Selecione a origem da oportunidade a partir desta lista.',
    },
    {
      selector: '.company-selector',
      content: 'Aqui você pode procurar e selecionar uma empresa para sua oportunidade.',
    },
  ];

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

  const [selectedCompanyOrAgency, setSelectedCompanyOrAgency] = useState(null);

  const handleCompanySelectionChange = (selected) => {
    setSelectedCompanyOrAgency(selected);
  };

  useEffect(() => {
    setSelectedCompany(selectedCompanyOrAgency);
    setSelectedAgency(null);
    if (selectedCompanyOrAgency) {
      validation.setFieldValue('cnpj', findValue(selectedCompanyOrAgency?.documents, 'cnpj') || '');
    } else {
      validation.setFieldValue('cnpj', '');
    }
  }, [selectedCompanyOrAgency]);

  return (
    <React.Fragment>
      <Tour
        steps={tourSteps}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
      />
              <p className="card-title-desc mb-4" style={{ marginTop: '20px'}}>
          Você pode criar multiplas oportunidades para uma mesma empresa, é facil selecione a origem, procure a empresa e se quiser você pode dar um titulo para essa oportunidade também!  <a
                        onClick={(e) => {
                          e.preventDefault();
                          setIsTourOpen(true)
                        }}
                        style={{
                          fontWeight: '800',
                        }}
                      >
                        clicar aqui
                      </a>
        </p>
      <Row>
        <Col xs="12">
          <Row>
            <Col xs="12">
              {/* Dados básicos do lead */}
              <div style={{ marginTop: '10px' }}></div>
              <Row>
                <Col sm="4">
                  <div className="mb-3">
                    <Label className="form-label">
                      Origem da oportunidade
                    </Label>
                    <Input
                      type="select"
                      name="origin"
                      className="form-select origin-select"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.origin || []}
                      invalid={
                        validation.touched.origin && validation.errors.origin
                          ? true
                          : false
                      }
                    >
                      <option value="">
                        Selecione uma origem
                      </option>
                      {categories.map((category) => (
          <option key={category.key} value={category.key}>
            {category.value}
          </option>
        ))}
                    </Input>
                    {validation.touched.origin && validation.errors.origin ? (
                      <FormFeedback type="invalid">
                        {validation.errors.origin}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col sm="6">
              <div className="mb-3 company-selector">
                <Label className="form-label">
                  Encontre a empresa
                </Label>
                <CompanyOrAgencySelector
                  type="company"
                  onChange={handleCompanySelectionChange}
                />
              </div>
            </Col>
          </Row>
          <Row
            style={{
              opacity: '0.7',
              pointerEvents: 'none',
            }}
          >
            <Col sm="6">
              <div className="mb-3">
                <Label className="control-label">
                  CNPJ
                </Label>
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
                  className="form-control input-color cnpj-input"
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
              <div className="mb-3"></div>
            </Col>

          </Row>
          <Row>
            <Col sm="6">
              <div className="mb-3">
                  {' '}
                  <Label className="form-label">Titulo da oportunidade</Label>
                  <Input
                    name="titulo"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.titulo || ''}
                    invalid={
                      validation.touched.titulo &&
                      validation.errors.titulo
                        ? true
                        : false
                    }
                  />
                </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default InfoLead
