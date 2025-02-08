import { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { toast } from 'sonner';
import { useBoard } from '../../../store/board/hooks';
import useLead from '../../../store/lead/hooks';

export const LeadRequiredStepActions = ({ id }) => {
  const boardHooks = useBoard();
  const { getRequiredFields, getNextStep } = boardHooks;

  const { data: lead, refetch } = useLead().getLead();
  const { data: tasks } = useLead().getLeadTasks(id ?? '')
  // const { data: meetings } = useLead().getLeadMee(id ?? '')
  const updateStep = useLead().updateStep();
  const updateFields = useLead().updateFields();

  const hasAtLeastOneContact = (lead?.contacts ?? []).length > 0;
  const hasAtLeastOneContactEstrategic = (lead?.contacts ?? []).some(contact => contact.strategic === true);
  const hasAtLeastOneTask = (lead?.counters ?? {"emails":0,"files":0,"meetings":0,"observations":0,"proposals":0,"tasks":0}).tasks > 0;
  const hasAtLeastOneAgenda = (lead?.counters ?? {"emails":0,"files":0,"meetings":0,"observations":0,"proposals":0,"tasks":0}).meetings > 0;

  const [form, setForm] = useState({});

  // useEffect para inicializar o formulário com customFields
  useEffect(() => {
    if (lead?.customFields) {
      setForm(prevForm => ({
        ...prevForm,
        ...lead.customFields
      }));
    }
  }, [lead]);

  const isAllFieldsValid = () => {
    const requiredFields = getRequiredFields({ step: lead?.step?._id });
    let valid = false;

    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];

      if (field.type === 'boolean') {
        valid = true;
        break;
      }

      if (field.type === 'has_one_internal_contact') {
        valid = hasAtLeastOneContact;
        if(hasAtLeastOneContact){
          continue;
        }else{
          break;
        }
      }

      if (field.type === 'has_one_internal_contact_estrategic') {
        valid = hasAtLeastOneContactEstrategic;
        if(hasAtLeastOneContactEstrategic){
          continue;
        }else{
          break;
        }
      }

      if (field.type === 'has_one_internal_agenda') {
        valid = hasAtLeastOneAgenda;
        if(hasAtLeastOneAgenda){
          continue;
        }else{
          break;
        }
      }

      if (field.type === 'has_one_internal_task') {
        valid = hasAtLeastOneTask;
        if(hasAtLeastOneTask){
          continue;
        }else{
          break;
        }
      }

      if (field.type === 'option') {
        if (
          form[field.name] === undefined ||
          form[field.name] === ''
        ) {
          valid = false;
          break;
        }
        valid = true;
        continue;
      }

      if (
        form[field.name] === undefined ||
        form[field.name] === ''
      ) {
        valid = false;
        break;
      }

      valid = true;
    }

    return valid;
  };

  const onlySave = async () => {
    const valid = isAllFieldsValid();

    if (valid) {
      await updateFields.mutateAsync({ id: lead?._id, fields: form });
      toast.success('Salvo com sucesso');
      setForm({});
      refetch();

      return;
    }

    toast.error('Preencha todos os campos obrigatórios');
  };

  const validateAllRequiredField = async () => {
    const valid = isAllFieldsValid();

    if (valid) {
      await updateFields.mutateAsync({ id: lead?._id, fields: form });
      const nextStep = getNextStep({ current: lead?.step?._id });
      await updateStep.mutateAsync(
        { id: lead?._id, step: nextStep },
        {
          onSuccess: () => {
            toast.success('Salvo com sucesso');
            setForm({});
            refetch();
          },
        }
      );

      return;
    }

    toast.error('Preencha todos os campos obrigatórios');
  };

  const onMoveToNextStep = () => {
    validateAllRequiredField();
  };

  return (
    <>
      <Form>
        {getRequiredFields({ step: lead?.step?._id }).map((field, i) => {
          return (
            <div className="mb-4" key={field._id || i}>
              {field.type === 'has_one_internal_contact' && (
                <FormGroup>
                  {/* <Label>{field.label}</Label> */}
                  <div
                    style={{
                      display: 'flex',
                      gap: 10,
                      alignItems: 'center',
                      fontSize: 21,
                      width: '100%',
                    }}
                  >
                    {hasAtLeastOneContact ? (
                      <i className="fa fa-check" style={{ color: 'green' }} />
                    ) : (
                      <i className="fa fa-times" style={{ color: 'red' }} />
                    )}
                    <div style={{ width: '50%' }}>
                      <Input
                        type="text"
                        name={field.name}
                        value={field.label}
                        required={field.required}
                        disabled
                        readOnly
                      />
                    </div>
                  </div>
                </FormGroup>
              )}

              {field.type === 'has_one_internal_contact_estrategic' && (
                <FormGroup>
                  {/* <Label>{field.label}</Label> */}
                  <div
                    style={{
                      display: 'flex',
                      gap: 10,
                      alignItems: 'center',
                      fontSize: 21,
                      width: '100%',
                    }}
                  >
                    {hasAtLeastOneContactEstrategic ? (
                      <i className="fa fa-check" style={{ color: 'green' }} />
                    ) : (
                      <i className="fa fa-times" style={{ color: 'red' }} />
                    )}
                    <div style={{ width: '50%' }}>
                      <Input
                        type="text"
                        name={field.name}
                        value={field.label}
                        required={field.required}
                        disabled
                        readOnly
                      />
                    </div>
                  </div>
                </FormGroup>
              )}

              {field.type === 'has_one_internal_agenda' && (
                <FormGroup>
                  {/* <Label>{field.label}</Label> */}
                  <div
                    style={{
                      display: 'flex',
                      gap: 10,
                      alignItems: 'center',
                      fontSize: 21,
                      width: '100%',
                    }}
                  >
                    {hasAtLeastOneAgenda ? (
                      <i className="fa fa-check" style={{ color: 'green' }} />
                    ) : (
                      <i className="fa fa-times" style={{ color: 'red' }} />
                    )}
                    <div style={{ width: '50%' }}>
                      <Input
                        type="text"
                        name={field.name}
                        value={field.label}
                        required={field.required}
                        disabled
                        readOnly
                      />
                    </div>
                  </div>
                </FormGroup>
              )}

              {field.type === 'has_one_internal_task' && (
                <FormGroup>
                  {/* <Label>{field.label}</Label> */}
                  <div
                    style={{
                      display: 'flex',
                      gap: 10,
                      alignItems: 'center',
                      fontSize: 21,
                      width: '100%',
                    }}
                  >
                    {hasAtLeastOneTask ? (
                      <i className="fa fa-check" style={{ color: 'green' }} />
                    ) : (
                      <i className="fa fa-times" style={{ color: 'red' }} />
                    )}
                    <div style={{ width: '50%' }}>
                      <Input
                        type="text"
                        name={field.name}
                        value={field.label}
                        required={field.required}
                        disabled
                        readOnly
                      />
                    </div>
                  </div>
                </FormGroup>
              )}

              {/* Campo do tipo 'boolean' */}
              {field.type === 'boolean' && (
                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      name={field.name}
                      checked={form[field.name] ?? false}
                      onChange={() => {
                        setForm({
                          ...form,
                          [field.name]: !form[field.name],
                        });
                      }}
                    />{' '}
                    {field.label}
                  </Label>
                </FormGroup>
              )}

              {/* Campos do tipo 'text' */}
              {field.type === 'text' && (
                <FormGroup>
                  <Label>{field.label}</Label>
                  <Input
                    type="text"
                    name={field.name}
                    required={field.required}
                    value={form[field.name] || ''}
                    onChange={(e) => {
                      setForm({ ...form, [field.name]: e.target.value });
                    }}
                  />
                </FormGroup>
              )}

              {/* Adição do novo tipo de campo 'option' */}
              {field.type === 'option' && (
                <FormGroup>
                  <Label>{field.label}</Label>
                  <Input
                    type="select"
                    name={field.name}
                    required={field.required}
                    value={form[field.name] || ''}
                    onChange={(e) => {
                      setForm({ ...form, [field.name]: e.target.value });
                    }}
                  >
                    {/* Opção padrão para incentivar a seleção */}
                    <option value="">Selecione uma opção</option>
                    {/* Renderiza as opções a partir de field.configs.list_options */}
                    {field.configs?.list_options?.map((option, idx) => (
                      <option key={option.key || idx} value={option.key}>
                        {option.value}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              )}
            </div>
          );
        })}

        <div className="mt-4">
          <Button
            color="primary"
            disabled={!isAllFieldsValid()}
            type="button"
            onClick={onlySave}
          >
            Salvar
          </Button>
          <Button
            color="primary"
            disabled={!isAllFieldsValid()}
            type="button"
            onClick={onMoveToNextStep}
            style={{ marginLeft: '20px' }}
          >
            Salvar e continuar
          </Button>
        </div>
      </Form>
    </>
  );
};

export default LeadRequiredStepActions;
