import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Card, CardBody } from 'reactstrap'
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
} from 'react-flow-renderer'
import { mockWorkflows } from './mockData'
import Breadcrumbs from '../../../components/Common/Breadcrumb'
import TaskModal from './TaskModal'
import './Constructor.css'

const Constructor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [modal, setModal] = useState(false)
  const [newNode, setNewNode] = useState(null)
  const { project } = useReactFlow()
  const toggle = () => setModal(!modal)

  useEffect(() => {
    const initialNodes = mockWorkflows[0].tasks.map((task, index) => ({
      id: (index + 1).toString(),
      data: { label: task.title },
      position: { x: 250, y: index * 100 },
    }))

    const initialEdges = mockWorkflows[0].tasks.slice(1).map((task, index) => ({
      id: `e${index + 1}-${index + 2}`,
      source: (index + 1).toString(),
      target: (index + 2).toString(),
      animated: true,
    }))

    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [])

  const onDoubleClick = (event) => {
    const { top, left } = event.currentTarget.getBoundingClientRect()
    const position = project({
      x: event.clientX - left,
      y: event.clientY - top,
    })
    setNewNode(position)
    toggle()
  }

  const handleAddTask = (task) => {
    const newTaskId = (nodes.length + 1).toString()
    const newNodeData = {
      id: newTaskId,
      data: { label: task.title },
      position: newNode,
    }

    const newEdge = {
      id: `e${nodes.length}-${newTaskId}`,
      source: nodes.length.toString(),
      target: newTaskId,
      animated: true,
    }

    setNodes((nds) => nds.concat(newNodeData))
    setEdges((eds) => eds.concat(newEdge))
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title="Workflow"
          breadcrumbItem="Construtor de Workflows"
        />
        <Row className="justify-content-center">
          <Col lg="12">
            <Card>
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="card-title">Construtor de Workflows</h4>
                  <Button color="primary" onClick={toggle}>
                    Adicionar Tarefa
                  </Button>
                </div>
                <div style={{ height: '500px' }} onDoubleClick={onDoubleClick}>
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={(params) =>
                      setEdges((els) => addEdge(params, els))
                    }
                  >
                    <MiniMap />
                    <Controls />
                    <Background />
                  </ReactFlow>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <TaskModal isOpen={modal} toggle={toggle} onSubmit={handleAddTask} />
    </div>
  )
}

const WrappedConstructor = () => (
  <ReactFlowProvider>
    <Constructor />
  </ReactFlowProvider>
)

export default WrappedConstructor
