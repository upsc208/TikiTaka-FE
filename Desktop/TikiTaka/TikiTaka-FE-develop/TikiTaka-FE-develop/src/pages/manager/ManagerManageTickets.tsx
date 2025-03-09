import AuthGuard from '../../components/common/AuthGuard';
import ManagerManageContainer from '../../components/manager/ManagerManageContainer';
import {useTokenStore, useUserStore} from '../../store/store';

export default function ManagerManageTickets() {
  const {isAuthenticated} = useTokenStore();
  const {role} = useUserStore();

  return (
    <AuthGuard isAuthenticated={isAuthenticated} userRole={role}>
      <ManagerManageContainer />
    </AuthGuard>
  );
}
