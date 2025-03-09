import AuthGuard from '../../components/common/AuthGuard';
import PwdChangeContainer from '../../components/common/PwdChangeContainer';
import {useTokenStore, useUserStore} from '../../store/store';

export default function ManagerPwdChange() {
  const {isAuthenticated} = useTokenStore();
  const {role} = useUserStore();

  return (
    <AuthGuard isAuthenticated={isAuthenticated} userRole={role}>
      <PwdChangeContainer />
    </AuthGuard>
  );
}
