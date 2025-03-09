import AdminInquiryContainer from '../../components/admin/inquiry/AdminInquiryContainer';
import AuthGuard from '../../components/common/AuthGuard';
import {useTokenStore, useUserStore} from '../../store/store';

export default function AdminInquiry() {
  const {isAuthenticated} = useTokenStore();
  const {role} = useUserStore();

  return (
    <AuthGuard isAuthenticated={isAuthenticated} userRole={role}>
      <AdminInquiryContainer />
    </AuthGuard>
  );
}
