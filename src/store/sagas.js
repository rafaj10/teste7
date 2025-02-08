import { all, fork } from 'redux-saga/effects'

//new
import LeadSaga from './lead/saga'
import PeoplesSaga from './peoples/saga'
import TenantsSaga from './tenants/saga'

//public
import ForgetSaga from './auth/forgetpwd/saga'
import AuthSaga from './auth/login/saga'
import ProfileSaga from './auth/profile/saga'
import AccountSaga from './auth/register/saga'
import BoardSaga from './board/saga'
import cepSaga from './cep/saga'
import importarLeadsSaga from './importarLeads/saga'
import categoriesSaga from './categories/saga'
import workflowsSaga from './workflows/saga'
import calendarSaga from './calendar/saga'
import chatSaga from './chat/saga'
import contactsSaga from './contacts/saga'
import cryptoSaga from './crypto/saga'
import dashboardBlogSaga from './dashboard-blog/saga'
import dashboardCryptoSaga from './dashboard-crypto/saga'
import dashboardJobSaga from './dashboard-jobs/saga'
import dashboardSaasSaga from './dashboard-saas/saga'
import dashboardSaga from './dashboard/saga'
import ecommerceSaga from './e-commerce/saga'
import invoiceSaga from './invoices/saga'
import jobsSaga from './jobs/saga'
import LayoutSaga from './layout/saga'
import mailsSaga from './mails/saga'
import projectsSaga from './projects/saga'
import tasksSaga from './tasks/saga'

export default function* rootSaga() {
  yield all([
    //new
    fork(TenantsSaga),
    fork(PeoplesSaga),
    fork(LeadSaga),
    fork(BoardSaga),
    fork(cepSaga),
    fork(importarLeadsSaga),
    fork(workflowsSaga),
    fork(categoriesSaga),
    //public
    fork(AccountSaga),
    fork(AuthSaga),
    fork(ForgetSaga),
    fork(ProfileSaga),
    fork(LayoutSaga),
    fork(ecommerceSaga),
    fork(calendarSaga),
    fork(chatSaga),
    fork(mailsSaga),
    fork(cryptoSaga),
    fork(invoiceSaga),
    fork(jobsSaga),
    fork(projectsSaga),
    fork(tasksSaga),
    fork(contactsSaga),
    fork(dashboardSaga),
    fork(dashboardSaasSaga),
    fork(dashboardCryptoSaga),
    fork(dashboardBlogSaga),
    fork(dashboardJobSaga),
  ])
}
