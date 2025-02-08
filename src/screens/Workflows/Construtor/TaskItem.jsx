import React from 'react'
import { Card, CardBody, Row, Col } from 'reactstrap'

const TaskItem = ({ task }) => {
  return (
    <Card className="mb-3">
      <CardBody>
        <Row>
          <Col md="12">
            <h5>{task.title}</h5>
            <p>{`Trigger: ${task.trigger}`}</p>
            <p>{`When: ${task.when.type} ${task.when.value}`}</p>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default TaskItem
