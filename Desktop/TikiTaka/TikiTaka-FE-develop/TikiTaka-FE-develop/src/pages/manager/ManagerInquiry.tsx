import AuthGuard from '../../components/common/AuthGuard';
import InquiryContainer from '../../components/user/InquiryContainer';
import {useTokenStore, useUserStore} from '../../store/store';

export default function ManagerInquiry() {
  const {isAuthenticated} = useTokenStore();
  const {role} = useUserStore();

  return (
    <AuthGuard isAuthenticated={isAuthenticated} userRole={role}>
      <InquiryContainer />
    </AuthGuard>
  );
}
