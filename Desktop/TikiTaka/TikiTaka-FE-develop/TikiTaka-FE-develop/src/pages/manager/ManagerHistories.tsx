import AuthGuard from '../../components/common/AuthGuard';
import ManagerHistoriesContainer from '../../components/manager/ManagerHistoriesContainer';
import {useTokenStore, useUserStore} from '../../store/store';

export default function ManagerHistories() {
  const {isAuthenticated} = useTokenStore();
  const {role} = useUserStore();

  return (
    <AuthGuard isAuthenticated={isAuthenticated} userRole={role}>
      <ManagerHistoriesContainer />
    </AuthGuard>
  );
}
