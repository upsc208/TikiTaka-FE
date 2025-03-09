import AuthGuard from '../../components/common/AuthGuard';
import NewTicketContainer from '../../components/common/ticket/NewTicketContainer';
import {useTokenStore, useUserStore} from '../../store/store';

export default function ManagerNewTicket() {
  const {isAuthenticated} = useTokenStore();
  const {role} = useUserStore();

  return (
    <AuthGuard isAuthenticated={isAuthenticated} userRole={role}>
      <NewTicketContainer />
    </AuthGuard>
  );
}
