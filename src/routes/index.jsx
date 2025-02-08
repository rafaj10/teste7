import React from 'react'
import { Navigate } from 'react-router-dom'

import ForgetPwd from '../screens/Autenticacao/ForgetPassword'
import Login from '../screens/Autenticacao/Login'
import Logout from '../screens/Autenticacao/Logout'

import UserProfile from '../screens/Profile/user-profile'
import Agenda from '../screens/Agenda/agenda'
import Dashboards from '../screens/Dashboards/dashboards'
import Funil from '../screens/Funil/funil'
import Inicio from '../screens/Inicio/inicio'
import Lead from '../screens/Lead/lead'
import LeadImportar from '../screens/Lead/lead-importar'
import CriarLead from '../screens/CriarLead/criar-lead'
import Peoples from '../screens/Peoples/peoples'
import Products from '../screens/Products/products'
import EmailTemplates from '../screens/EmailTemplate/EmailTemplates'
import Tenants from '../screens/Tenants/tenants'
import Cep from '../screens/Cep/cep'
import ImportarLeads from '../screens/ImportarLeads/ImportarLeads'
import ImportarDados from '../screens/ImportarDados/ImportarDados'
import WorkflowList from '../screens/Workflows/WorkflowList'
import WorkflowConstructor from '../screens/Workflows/Construtor/Constructor'
import Admin from '../screens/Admin/TenantManagement'
import EditStep from '../screens/Admin/EditStep'
import Ajuda from '../screens/Ajuda/ajuda'

const authProtectedRoutes = [
  //Novo
  { path: '/inicio', component: <Inicio /> },
  { path: '/funil/:id', component: <Funil /> },
  { path: '/agenda', component: <Agenda /> },
  {
    path: '/contatos',
    component: <Peoples />,
  },
  {
    path: '/empresas',
    component: <Peoples />,
  },
  {
    path: '/agencias',
    component: <Peoples />,
  },
  {
    path: '/produtos',
    component: <Products />,
  },
  {
    path: '/emailtemplates',
    component: <EmailTemplates />,
  },
  { path: '/cep', component: <Cep /> },
  { path: '/importar-leads', component: <ImportarLeads /> },
  { path: '/importar-dados', component: <ImportarDados /> },

  { path: '/tenants', component: <Tenants /> },
  { path: '/lead/:id', component: <Lead /> },
  { path: '/lead/importar', component: <LeadImportar /> },
  { path: '/lead/novo', component: <CriarLead /> },
  { path: '/dashboards', component: <Dashboards /> },
  { path: '/workflow', component: <WorkflowList /> },
  { path: '/workflow/ww', component: <WorkflowConstructor /> },
  { path: '/admin', component: <Admin /> },
  {
    path: '/admin/tenants/:tenantId/boards/:boardId/steps/:stepId',
    component: <EditStep />,
  },
  { path: '/ajuda', component: <Ajuda /> },
  { path: '/profile', component: <UserProfile /> },
  { path: '/', exact: true, component: <Navigate to="/inicio" /> },
]

const publicRoutes = [
  { path: '/logout', component: <Logout /> },
  { path: '/login', component: <Login /> },
  { path: '/forgot-password', component: <ForgetPwd /> },
]

export { authProtectedRoutes, publicRoutes }
