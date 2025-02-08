import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  Col,
  FormFeedback,
  Input,
  Label,
  Row,
} from 'reactstrap'
import InputMask from 'react-input-mask'
import { fetchCepRequest } from '../../../store/cep/actions'
import { useCepSelector } from '../../../store/cep/selectors'
import { getCategories } from '../../../store/categories/actions'
import { useCategorySelector } from '../../../store/categories/selectors'
import SectorAndCategorySelector from '../../../components/Common/CategoryMultiSelector/SectorAndCategorySelector'

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
]

const InfoLead = ( {validation, selectedCompany, handleSelectionChange} ) => {
  const dispatch = useDispatch()
  const { cepData, loading: cepLoading, error: cepError } = useCepSelector()
  useEffect(() => {
    if (validation.values.cep && validation.values.cep.length === 9) {
      const cepWithoutDash = validation.values.cep.replace('-', '')
      dispatch(fetchCepRequest(cepWithoutDash))
    }
  }, [validation.values.cep, dispatch])

  useEffect(() => {
    if (cepData && validation.values.cep.replace('-', '') === cepData.cep) {
      validation.setFieldValue('endereco', cepData.address || '')
      validation.setFieldValue('cidade', cepData.city || '')
      validation.setFieldValue('estado', cepData.state || '')
      //alert('Complete o endereço com o seu numero') // TODO toast
    }
  }, [cepData])

  const { categories, loading } = useCategorySelector()

  useEffect(() => {
      dispatch(getCategories('origem'))
  }, [])

  return (
    <React.Fragment>
      <Row>
        <Col xs="12">
          <Row>
            <Col xs="12">
              {/* Dados básicos do lead */}
              <div style={{ marginTop: '20px' }}></div>
              <Row>
                <Col sm="4">
                  <div className="mb-3">
                    <Label className="form-label">
                      Origem do lead
                    </Label>
                    <Input
                      type="select"
                      name="origin"
                      className="form-select"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={
                        validation.values.origin || []
                      }
                      invalid={
                        validation.touched.origin &&
                        validation.errors.origin
                          ? true
                          : false
                      }
                    >
                      <option value="">Selecione uma origem</option>
                        {categories.map((category) => (
                          <option key={category.key} value={category.key}>
                            {category.value}
                          </option>
                        ))}
                    </Input>
                    {validation.touched.origin &&
                    validation.errors.origin ? (
                      <FormFeedback type="invalid">
                        {validation.errors.origin}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>

                {/* campos que podem voltar */}
                <>
                                {/* <Col sm="4">
                  <div className="mb-3">
                    <Label className="form-label">
                      Proprietario do lead
                    </Label>
                    <Input
                      type="select"
                      name="owner"
                      className="form-select"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={
                        validation.values.owner || []
                      }
                      invalid={
                        validation.touched.owner &&
                        validation.errors.owner
                          ? true
                          : false
                      }
                    >
                      <option></option>
                      {usersByTenant.map((item) => (
                        <option value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </Input>
                    {validation.touched.owner &&
                    validation.errors.owner ? (
                      <FormFeedback type="invalid">
                        {validation.errors.owner}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col> */}
                {/* <Col sm="4">
                  <div className="mb-3">
                    <Label className="form-label">
                      Etapa do funil
                    </Label>
                    <Input
                      type="select"
                      name="step"
                      className="form-select"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.step || []}
                      invalid={
                        validation.touched.step &&
                        validation.errors.step
                          ? true
                          : false
                      }
                    >
                      <option></option>
                      {steps.map((item) => (
                        <option value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </Input>
                    {validation.touched.step &&
                    validation.errors.step ? (
                      <FormFeedback type="invalid">
                        {validation.errors.step}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col> */}
                </>
                {/* campos que podem voltar */}

              </Row>
              <div style={{ marginTop: '20px' }}></div>
            </Col>
          </Row>
          <Row
            style={{
              opacity: selectedCompany ? '0.2' : '1',
              pointerEvents: selectedCompany
                ? 'none'
                : 'all',
            }}
          >
            <Col sm="6">
              <div className="mb-3">
                <Label className="form-label">
                  Nome da empresa *
                </Label>
                <Input
                  name="nome"
                  type="text"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.nome || ''}
                  invalid={
                    validation.touched.nome &&
                    validation.errors.nome
                      ? true
                      : false
                  }
                />
                {validation.touched.nome &&
                validation.errors.nome ? (
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
                    validation.touched.cep &&
                    validation.errors.cep
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
                {validation.touched.cep &&
                validation.errors.cep ? (
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
              <div className="mb-3">
                <Label className="form-label">
                  Setor e Categoria
                </Label>
                <SectorAndCategorySelector
                  onChange={handleSelectionChange}
                />
              </div>
            </Col>

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
                    validation.touched.cnpj &&
                    validation.errors.cnpj
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
                {validation.touched.cnpj &&
                validation.errors.cnpj ? (
                  <FormFeedback type="invalid">
                    {validation.errors.cnpj}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mb-3">
                <Label className="control-label">
                  Cidade
                </Label>
                <Input
                  name="cidade"
                  type="text"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.cidade || ''}
                  invalid={
                    validation.touched.cidade &&
                    validation.errors.cidade
                      ? true
                      : false
                  }
                />
                {validation.touched.cidade &&
                validation.errors.cidade ? (
                  <FormFeedback type="invalid">
                    {validation.errors.cidade}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mb-3">
                <Label className="control-label">
                  Estado
                </Label>
                <Input
                  type="select"
                  name="estado"
                  className="form-select"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.estado || []}
                  invalid={
                    validation.touched.estado &&
                    validation.errors.estado
                      ? true
                      : false
                  }
                >
                  <option></option>
                  {optionsEstados.map((item) => (
                    <option value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </Input>
                {validation.touched.estado &&
                validation.errors.estado ? (
                  <FormFeedback type="invalid">
                    {validation.errors.estado}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mb-3">
                {' '}
                <Label className="form-label">Site</Label>
                <Input
                  name="site"
                  type="text"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.site || ''}
                  invalid={
                    validation.touched.site &&
                    validation.errors.site
                      ? true
                      : false
                  }
                />
                {validation.touched.site &&
                validation.errors.site ? (
                  <FormFeedback type="invalid">
                    {validation.errors.site}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mb-3"></div>
            </Col>
          </Row>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default InfoLead
