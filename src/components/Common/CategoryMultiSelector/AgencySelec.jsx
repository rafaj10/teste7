import { useCategoryMultiSelector } from './CategoryMultiSelectorHooks'
import { Input } from 'reactstrap'

export const AgencySelect = ({ handle }) => {
  const { getAgencies } = useCategoryMultiSelector()
  const { data, isLoading } = getAgencies()

  const handleChange = (e) => {
    // Atualiza o filtro apenas se um valor válido for selecionado
    const value = e.target.value;
    handle.setFilter(prev => ({
      ...prev,
      agency: value !== "" ? value : undefined  // Se o valor for a string vazia, remove a agência do filtro
    }))
  }

  return (
    <Input
      type="select"
      defaultValue=""
      onChange={handleChange}
    >
      <option value="">Não filtrar agência</option>
      {isLoading ? <option>Loading...</option> : data.map((item) => (
        <option key={item._id} value={item._id}>
          {item.name}
        </option>
      ))}
    </Input>
  )
}
