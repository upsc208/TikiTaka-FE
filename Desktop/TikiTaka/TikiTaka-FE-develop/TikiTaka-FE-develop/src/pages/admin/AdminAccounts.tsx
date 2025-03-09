import AdminAccountContainer from '../../components/admin/account/AdminAccountContainer';
import AuthGuard from '../../components/common/AuthGuard';
import {useTokenStore, useUserStore} from '../../store/store';

export default function AdminAccounts() {
  const {isAuthenticated} = useTokenStore();
  const {role} = useUserStore();

  return (
    <AuthGuard isAuthenticated={isAuthenticated} userRole={role}>
      <AdminAccountContainer />
    </AuthGuard>
  );
}
