declare interface LoginData {
  username: string;
  password: string;
}

declare interface LoginResponse {
  id: number;
  passwordChangeNeeded: boolean;
  role: 'MANAGER' | 'USER' | 'ADMIN' | 'DEFAULT';
}

declare interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

declare interface UserCountResponse {
  registrationCount: number;
  userCount: number;
}

declare interface UserListResponse {
  users: Array<{
    userId: number;
    username: string;
    email: string;
    role: string;
  }>;
  adminCount: number;
  managerCount: number;
  userCount: number;
}

declare interface UserDetailResponse {
  userId: number;
  username: string;
  email: string;
  role: 'MANAGER' | 'USER' | 'ADMIN' | 'DEFAULT';
  profileImageUrl: string;
  department?: string;
}

declare interface RoleChangeData {
  role: string;
}
