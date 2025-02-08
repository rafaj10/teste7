import React, { useState } from 'react'
import {
  Container,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap'
import Breadcrumbs from '../../components/Common/Breadcrumb'
import classnames from 'classnames'
import TenantsTab from './TenantsTab'
import UsersTab from './UsersTab'
import BoardsTab from './BoardsTab'
import RolesTab from './RolesTab'
import { ToastContainer } from 'react-toastify'

const TenantManagement = () => {
  const [activeTab, setActiveTab] = useState('1')
  const [selectedTenant, setSelectedTenant] = useState(null)

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  const handleSelectTenant = (tenantId) => {
    setSelectedTenant(tenantId)
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Admin" breadcrumbItem="Administração de Empresas" />
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '1' })}
                onClick={() => {
                  toggleTab('1')
                }}
              >
                Empresas
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: activeTab === '2',
                  disabled: !selectedTenant,
                })}
                onClick={() => {
                  if (selectedTenant) toggleTab('2')
                }}
              >
                Usuarios
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: activeTab === '3',
                  disabled: !selectedTenant,
                })}
                onClick={() => {
                  if (selectedTenant) toggleTab('3')
                }}
              >
                Perfil
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: activeTab === '4',
                  disabled: !selectedTenant,
                })}
                onClick={() => {
                  if (selectedTenant) toggleTab('4')
                }}
              >
                Funil
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <TenantsTab
                onSelectTenant={handleSelectTenant}
                selectedTenant={selectedTenant}
              />
            </TabPane>
            <TabPane tabId="2">
              <UsersTab tenantId={selectedTenant} />
            </TabPane>
            <TabPane tabId="3">
              <RolesTab tenantId={selectedTenant} />
            </TabPane>
            <TabPane tabId="4">
              <BoardsTab tenantId={selectedTenant} />
            </TabPane>
          </TabContent>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}

export default TenantManagement
