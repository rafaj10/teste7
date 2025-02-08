import { combineReducers } from 'redux'

// Front
import Layout from './layout/reducer'

// Authentication
import ForgetPassword from './auth/forgetpwd/reducer'
import Login from './auth/login/reducer'
import Profile from './auth/profile/reducer'
import Account from './auth/register/reducer'

// Tenants
import Tenants from './tenants/reducer'

// Peoples
import Peoples from './peoples/reducer'

// Leads
import Leads from './lead/reducer'

// Board
import Board from './board/reducer'

// Cep
import cepReducer from './cep/reducer'

import importarLeadsReducer from './importarLeads/reducer'

import workflows from './workflows/reducer'

import categoriesReducer from './categories/reducer'

//E-commerce
import ecommerce from './e-commerce/reducer'

//Calendar
import calendar from './calendar/reducer'

//chat
import chat from './chat/reducer'

//crypto
import crypto from './crypto/reducer'

//invoices
import invoices from './invoices/reducer'

//jobs
import JobReducer from './jobs/reducer'

//projects
import projects from './projects/reducer'

//tasks
import tasks from './tasks/reducer'

//contacts
import contacts from './contacts/reducer'

//mails
import mails from './mails/reducer'

//Dashboard
import Dashboard from './dashboard/reducer'

//Dasboard saas
import DashboardSaas from './dashboard-saas/reducer'

//Dasboard crypto
import DashboardCrypto from './dashboard-crypto/reducer'

//Dasboard blog
import DashboardBlog from './dashboard-blog/reducer'

//Dasboard job
import DashboardJob from './dashboard-jobs/reducer'

const rootReducer = combineReducers({
  // public
  Layout,
  Login,
  Peoples,
  Tenants,
  Leads,
  Board,
  Cep: cepReducer,
  ImportarLeads: importarLeadsReducer,
  Workflows: workflows,
  Categories: categoriesReducer,
  // defaults
  Account,
  ForgetPassword,
  Profile,
  ecommerce,
  calendar,
  chat,
  mails,
  crypto,
  invoices,
  JobReducer,
  projects,
  tasks,
  contacts,
  Dashboard,
  DashboardSaas,
  DashboardCrypto,
  DashboardBlog,
  DashboardJob,
})

export default rootReducer
