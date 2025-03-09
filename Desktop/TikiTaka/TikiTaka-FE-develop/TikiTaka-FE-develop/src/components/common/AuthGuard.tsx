import {Navigate, useLocation} from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  userRole: 'MANAGER' | 'USER' | 'ADMIN' | 'DEFAULT';
}

const roleHomePaths: Record<string, string> = {
  MANAGER: '/manager',
  USER: '/user',
  ADMIN: '/admin',
};

const AuthGuard: React.FC<AuthGuardProps> = ({children, isAuthenticated, userRole}) => {
  const location = useLocation();

  if (!isAuthenticated) {
    alert('로그인 후 이용 가능합니다.');
    return <Navigate to="/" replace />;
  }

  const pathRole = location.pathname.split('/')[1].toUpperCase();

  if (userRole !== 'DEFAULT') {
    // 역할별 페이지 접근 제한
    if (pathRole in roleHomePaths && pathRole !== userRole) {
      alert('접근 권한이 없습니다.');
      return <Navigate to={roleHomePaths[userRole]} replace />;
    }
  }

  if (isAuthenticated && userRole !== 'DEFAULT' && pathRole in roleHomePaths && pathRole == userRole) {
    return <>{children}</>;
  }
  return null;
};

export default AuthGuard;
