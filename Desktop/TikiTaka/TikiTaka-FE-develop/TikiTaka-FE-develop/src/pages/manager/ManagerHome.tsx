import ManagerHomeContainer from '../../components/manager/home/ManagerHomeContainer';
import AuthGuard from '../../components/common/AuthGuard';
import {useTokenStore, useUserStore} from '../../store/store';

export default function ManagerHome() {
  const {isAuthenticated} = useTokenStore();
  const {role} = useUserStore();

  return (
    <AuthGuard isAuthenticated={isAuthenticated} userRole={role}>
      <ManagerHomeContainer />
    </AuthGuard>
  );
}
