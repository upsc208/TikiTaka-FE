import AuthGuard from '../../components/common/AuthGuard';
import ManagerTicketsContainer from '../../components/manager/tickets/ManagerTicketsContainer';
import {useTokenStore, useUserStore} from '../../store/store';

export default function ManagerTickets() {
  const {isAuthenticated} = useTokenStore();
  const {role} = useUserStore();

  return (
    <AuthGuard isAuthenticated={isAuthenticated} userRole={role}>
      <ManagerTicketsContainer />
    </AuthGuard>
  );
}
