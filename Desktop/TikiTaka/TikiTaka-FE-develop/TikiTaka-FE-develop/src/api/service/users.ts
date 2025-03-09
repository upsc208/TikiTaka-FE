import instance from '../axiosInstance';

export async function patchUserPassword(passwordData: PasswordChangeData, userId: number) {
  try {
    const response = await instance.patch(`/users/${userId}/password`, passwordData, {});
    const {data} = response;
    return data;
  } catch (error) {
    console.error('비밀번호 변경 실패:', error);
    throw error;
  }
}

export async function patchDeleteUser(userId: number) {
  try {
    const {data} = await instance.delete(`/users/${userId}`);
    return data;
  } catch (error) {
    console.error('계정 삭제 실패:', error);
    throw error;
  }
}

export async function getUserCount(token: string) {
  try {
    const {data} = await instance.get<{message: string; data: UserCountResponse}>('/users/count', {
      headers: {Authorization: `Bearer ${token}`},
    });
    return data.data;
  } catch (error) {
    console.error('사용자 수 조회 실패:', error);
    throw error;
  }
}

export async function getManagerList() {
  try {
    const {data} = await instance.get<{message: string; data: UserListResponse}>('/users?role=MANAGER', {});
    return data.data;
  } catch (error) {
    console.error('사용자 목록 조회 실패:', error);
    throw error;
  }
}

export async function getUserList() {
  try {
    const {data} = await instance.get<{message: string; data: UserListResponse}>('/users', {});
    return data.data;
  } catch (error) {
    console.error('사용자 목록 조회 실패:', error);
    throw error;
  }
}

export async function getUserDetail(userId: number) {
  try {
    const {data} = await instance.get<{message: string; data: UserDetailResponse}>(`/users/${userId}`);
    return data.data;
  } catch (error) {
    console.error('사용자 상세 정보 조회 실패:', error);
    throw error;
  }
}

export async function getUserInfo() {
  try {
    const {data} = await instance.get<{message: string; data: UserDetailResponse}>(`/users/me`);
    return data.data;
  } catch (error) {
    console.error('사용자 상세 정보 조회 실패:', error);
    throw error;
  }
}

export async function patchUserRole(userId: number, roleData: RoleChangeData) {
  try {
    const {data} = await instance.patch(`/users/${userId}/role`, roleData);
    return data;
  } catch (error) {
    console.error('사용자 역할 변경 실패:', error);
    throw error;
  }
}

export async function patchUserProfileImage(userId: number, image: File) {
  const formData = new FormData();
  formData.append('image', image);

  try {
    const {data} = await instance.put(`/users/${userId}/profile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    console.error('프로필 이미지 업로드 실패:', error);
    throw error;
  }
}
