import {AxiosResponse} from 'axios';
import instance from '../axiosInstance';
import {ITEMS_PER_PAGE} from '../../constants/constants';

export async function getChangeHistory(
  ticketId: number,
  page: number = 0,
  size: number = ITEMS_PER_PAGE,
  updatedById?: number,
  updatedType?: string
): Promise<ChangeHistoryResponse> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ticketId: ticketId.toString(),
    });

    if (updatedById) params.append('updatedById', updatedById.toString());
    if (updatedType) params.append('updatedType', updatedType);

    const {data}: AxiosResponse<ApiResponse> = await instance.get(`/history`, {
      params,
    });

    return data.data;
  } catch (error) {
    console.error('변경 이력 조회 실패:', error);
    throw error;
  }
}
