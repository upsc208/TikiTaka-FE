import {Navigate, Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import {Suspense, lazy} from 'react';
import './global.css';
import LoadingStatus from './components/common/LoadingStatus';

const ManagerHome = lazy(() => import('./pages/manager/ManagerHome'));
const UserHome = lazy(() => import('./pages/user/UserHome'));
const ManagerTickets = lazy(() => import('./pages/manager/ManagerTickets'));
const ManagerStatistics = lazy(() => import('./pages/manager/ManagerStatistics'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ManagerPwdChange = lazy(() => import('./pages/manager/ManagerPwdChange'));
const UserNewTicket = lazy(() => import('./pages/user/UserNewTicket'));
const SignIn = lazy(() => import('./pages/common/signin/SignIn'));
const SignUp = lazy(() => import('./pages/common/signin/SignUp'));
const ManagerTicketDetail = lazy(() => import('./pages/manager/ManagerTicketDetail'));
const AdminAccounts = lazy(() => import('./pages/admin/AdminAccounts'));
const AdminCategory = lazy(() => import('./pages/admin/AdminCategory'));
const AdminInquiry = lazy(() => import('./pages/admin/AdminInquiry'));
const ManagerHistories = lazy(() => import('./pages/manager/ManagerHistories'));
const UserPwdChange = lazy(() => import('./pages/user/UserPwdChange'));
const ManagerNewTicket = lazy(() => import('./pages/manager/ManagerNewTicket'));
const UserTicketDetail = lazy(() => import('./pages/user/UserTicketDetail'));
const Layout = lazy(() => import('./Layout'));
const ManagerManageTickets = lazy(() => import('./pages/manager/ManagerManageTickets'));
const UserInquiry = lazy(() => import('./pages/user/UserInquiry'));
const ManagerInquiry = lazy(() => import('./pages/manager/ManagerInquiry'));
const AdminPwdChange = lazy(() => import('./pages/admin/AdminPwdChange'));

function App() {
  const managerRoutes = [
    {path: '', element: <ManagerHome />},
    {path: 'statistics', element: <ManagerStatistics />},
    {path: 'tickets', element: <ManagerManageTickets />},

    {path: 'newticket', element: <ManagerNewTicket />},
    {path: 'newtickets', element: <ManagerTickets />},

    {path: 'histories', element: <ManagerHistories />},
    {path: 'detail/:id', element: <ManagerTicketDetail />},
    {path: 'inquiry', element: <ManagerInquiry />},
    {path: 'pwdChange', element: <ManagerPwdChange />},
  ];

  const userRoutes = [
    {path: '', element: <UserHome />},
    {path: 'newTicket', element: <UserNewTicket />},
    {path: 'detail/:id', element: <UserTicketDetail />},
    {path: 'inquiry', element: <UserInquiry />},
    {path: 'pwdChange', element: <UserPwdChange />},
  ];

  const adminRoutes = [
    {path: '', element: <Navigate to="accounts" replace />},
    {path: 'accounts', element: <AdminAccounts />},
    {path: 'categories', element: <AdminCategory />},
    {path: 'inquiries', element: <AdminInquiry />},
    {path: 'pwdChange', element: <AdminPwdChange />},
  ];

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />

          {/* 레이아웃 있음 */}
          <Route
            element={
              <Suspense
                fallback={
                  <div>
                    <LoadingStatus />
                  </div>
                }
              >
                <Layout />
              </Suspense>
            }
          >
            {/* 담당자 */}
            <Route path="/manager">
              {managerRoutes.map(({path, element}) => (
                <Route key={path} path={path} element={element} />
              ))}
            </Route>
            {/* 사용자 */}
            <Route path="/user">
              {userRoutes.map(({path, element}) => (
                <Route key={path} path={path} element={element} />
              ))}
            </Route>
            {/* 관리자 */}
            <Route path="/admin">
              {adminRoutes.map(({path, element}) => (
                <Route key={path} path={path} element={element} />
              ))}
            </Route>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
