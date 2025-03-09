declare interface RegistrationListParams {
  page?: number;
  size?: number;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

declare interface RegistrationUpdateParams {
  registrationId: number;
  status: 'APPROVED' | 'REJECTED';
  role: 'ADMIN' | 'MANAGER' | 'USER';
  reason?: string;
}
