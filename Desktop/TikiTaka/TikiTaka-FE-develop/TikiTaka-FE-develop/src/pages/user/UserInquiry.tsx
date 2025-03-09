import InquiryContainer from '../../components/user/InquiryContainer';
import AuthGuard from '../../components/common/AuthGuard';
import {useTokenStore, useUserStore} from '../../store/store';

export default function UserInquiry() {
  const {isAuthenticated} = useTokenStore();
  const {role} = useUserStore();

  return (
    <AuthGuard isAuthenticated={isAuthenticated} userRole={role}>
      <InquiryContainer />
    </AuthGuard>
  );
}
