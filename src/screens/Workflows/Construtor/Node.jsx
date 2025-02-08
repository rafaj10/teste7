import React from 'react'

const Node = ({ node, setSelectedNode }) => {
  const handleSelect = () => {
    setSelectedNode(node)
  }

  return (
    <div
      className="node"
      style={{ left: node.position?.x || 100, top: node.position?.y || 100 }}
      onClick={handleSelect}
    >
      <div className="node-header">{node.title || node.type}</div>
    </div>
  )
}

export default Node
