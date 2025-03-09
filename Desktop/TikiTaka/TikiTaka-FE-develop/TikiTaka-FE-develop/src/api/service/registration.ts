import {ITEMS_PER_PAGE} from '../../constants/constants';
import instance from '../axiosInstance';

export async function postRegistration(postData: {email: string; username: string}) {
  const data = await instance.post('/registrations', postData);
  return data;
}

export async function getRegistrationList(params: RegistrationListParams) {
  try {
    const {data} = await instance.get('/registrations/list', {
      params: {
        page: params.page || 0,
        size: params.size || ITEMS_PER_PAGE,
        status: params.status,
      },
    });
    return data;
  } catch (error) {
    console.error('신청 목록 조회 실패:', error);
    throw error;
  }
}

export async function updateRegistrationStatus(params: RegistrationUpdateParams) {
  try {
    const {data} = await instance.post(`/registrations/${params.registrationId}?status=${params.status}`, {
      role: params.role,
      reason: params.reason,
    });
    return data;
  } catch (error) {
    console.error('상태 업데이트 실패:', error);
    throw error;
  }
}
