import AuthGuard from '../../components/common/AuthGuard';
import UserHomeContainer from '../../components/user/home/UserHomeContainer';
import {useTokenStore, useUserStore} from '../../store/store';

export default function UserHome() {
  const {isAuthenticated} = useTokenStore();
  const {role} = useUserStore();

  return (
    <AuthGuard isAuthenticated={isAuthenticated} userRole={role}>
      <UserHomeContainer />
    </AuthGuard>
  );
}
