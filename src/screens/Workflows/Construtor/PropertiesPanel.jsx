import React from 'react'

const PropertiesPanel = ({ node, updateNode }) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    updateNode({
      ...node,
      [name]: value,
    })
  }

  const handleWhenChange = (e) => {
    const { name, value } = e.target
    updateNode({
      ...node,
      when: {
        ...node.when,
        [name]: value,
      },
    })
  }

  return (
    <div className="properties-panel">
      <h3>Properties for {node.type}</h3>
      <div>
        <label>Title</label>
        <input name="title" value={node.title} onChange={handleChange} />
      </div>
      <div>
        <label>Trigger</label>
        <select name="trigger" value={node.trigger} onChange={handleChange}>
          <option value="now">Now</option>
          <option value="after_previous">After Previous</option>
        </select>
      </div>
      <div>
        <label>When</label>
        <select name="type" value={node.when.type} onChange={handleWhenChange}>
          <option value="hours">Hours</option>
          <option value="days">Days</option>
        </select>
        <input
          name="value"
          type="number"
          value={node.when.value}
          onChange={handleWhenChange}
        />
      </div>
    </div>
  )
}

export default PropertiesPanel
