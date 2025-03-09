import AuthGuard from '../../components/common/AuthGuard';
import ManagerStatisticsContainer from '../../components/manager/statistics/ManagerStatisticsContainer';
import {useTokenStore, useUserStore} from '../../store/store';

export default function ManagerStatistics() {
  const {isAuthenticated} = useTokenStore();
  const {role} = useUserStore();

  return (
    <AuthGuard isAuthenticated={isAuthenticated} userRole={role}>
      <ManagerStatisticsContainer />
    </AuthGuard>
  );
}
