import React from 'react'

const Sidebar = ({ addNode }) => {
  return (
    <div className="sidebar">
      <button onClick={() => addNode('follow_up')}>Add Task</button>
    </div>
  )
}

export default Sidebar
