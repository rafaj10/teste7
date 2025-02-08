import { FormFeedback, FormGroup, Input, Label } from 'reactstrap'

export const FormInput = ({
  label,
  name,
  type,
  placeholder,
  validation,
  ...props
}) => {
  return (
    <FormGroup>
      <Label className="form-label">{label}</Label>
      <Input
        type={type}
        name={name}
        onChange={validation.handleChange}
        onBlur={validation.handleBlur}
        value={validation.values[name] || ''}
        invalid={
          validation.touched[name] && validation.errors[name] ? true : false
        }
        placeholder={placeholder}
        {...props}
      />
      {validation.touched[name] && validation.errors[name] ? (
        <FormFeedback type="invalid">{validation.errors[name]}</FormFeedback>
      ) : null}
    </FormGroup>
  )
}
