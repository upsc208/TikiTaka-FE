import AdminCategoryContainer from '../../components/admin/category/AdminCategoryContainer';
import AuthGuard from '../../components/common/AuthGuard';
import {useTokenStore, useUserStore} from '../../store/store';

export default function AdminCategory() {
  const {isAuthenticated} = useTokenStore();
  const {role} = useUserStore();

  return (
    <AuthGuard isAuthenticated={isAuthenticated} userRole={role}>
      <AdminCategoryContainer />
    </AuthGuard>
  );
}
