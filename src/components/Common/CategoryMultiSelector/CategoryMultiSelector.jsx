import { useCategoryMultiSelector } from './CategoryMultiSelectorHooks'
import './CategoryMultiSelector.css'
import { Input } from 'reactstrap'

export const Category = ({ type, title, handle, isMulti = true, ...props }) => {
  const use = useCategoryMultiSelector()
  const { data, isLoading } = use.getData(type)

  function getFilteredData() {
    if (props.filterBy) {
      return data.filter(props.filterBy)
    }

    return data
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!data) {
    return <div>Ocorreu um erro inesperado...</div>
  }

  if (data.length === 0) {
    return <div>Nenhum registro encontrado...</div>
  }

  if (props.filterBy && getFilteredData().length == 0) {
    return <div />
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <h5>{title}</h5>
      <div className="category-container">
        {getFilteredData().map((item, i) => (
          <div key={i} className="category-item">
            <div className="form-check">
              {!isMulti ? (
                <Input
                  type="radio"
                  className="form-check-input"
                  id={item.key}
                  name={type}
                  onChange={() => {
                    const { filter, setFilter } = handle

                    setFilter({
                      ...filter,
                      [type]: [item.key],
                    })
                  }}
                />
              ) : (
                <Input
                  type="checkbox"
                  className="form-check-input"
                  id={item.key}
                  name={item.key}
                  defaultChecked={handle.filter[type].includes(item.key)}
                  onChange={(e) => {
                    const { filter, setFilter } = handle

                    setFilter({
                      ...filter,
                      [type]: e.target.checked
                        ? [...filter[type], item.key]
                        : filter[type].filter((x) => x !== item.key),
                    })
                  }}
                />
              )}
              <label className="form-check-label" htmlFor={item.key}>
                {item.value}
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const CategoryMultiSelector = ({ children }) => {
  return <div>{children}</div>
}
