import {ITEMS_PER_PAGE} from '../../constants/constants';
import instance from '../axiosInstance';

export async function createTicketForm(firstCategoryId: number, secondCategoryId: number, formData: CreateTicketFormData) {
  try {
    const {data} = await instance.post(`/tickets/forms/${firstCategoryId}/${secondCategoryId}`, formData, {});
    return data;
  } catch (error) {
    console.error('티켓 폼 생성 실패:', error);
    throw error;
  }
}

export async function getTicketForm(firstCategoryId: number, secondCategoryId: number) {
  try {
    const {data} = await instance.get(`/tickets/forms/${firstCategoryId}/${secondCategoryId}`);
    return data.data;
  } catch (error) {
    console.error('티켓 폼 조회 실패:', error);
    return null;
  }
}

export async function updateTicketForm(firstCategoryId: number, secondCategoryId: number, formData: UpdateTicketFormData) {
  try {
    const {data} = await instance.patch(`/tickets/forms/${firstCategoryId}/${secondCategoryId}`, formData);
    return data;
  } catch (error) {
    console.error('티켓 폼 수정 실패:', error);
    throw error;
  }
}

export async function deleteTicketForm(firstCategoryId: number, secondCategoryId: number) {
  try {
    const {data} = await instance.delete(`/tickets/forms/${firstCategoryId}/${secondCategoryId}`);
    return data;
  } catch (error) {
    console.error('티켓 폼 삭제 실패:', error);
    throw error;
  }
}

export async function createTicketType(token: string, typeData: CreateTicketTypeData) {
  try {
    const {data} = await instance.post('/tickets/types', typeData, {
      headers: {Authorization: `Bearer ${token}`},
    });
    return data;
  } catch (error) {
    console.error('티켓 유형 생성 실패:', error);
    throw error;
  }
}

export async function getTicketTypes() {
  try {
    const {data} = await instance.get('/tickets/types/list', {});
    return data.data;
  } catch (error) {
    console.error('티켓 유형 조회 실패:', error);
    throw error;
  }
}

export async function deleteTicketType(token: string, typeId: number) {
  try {
    const {data} = await instance.delete(`/tickets/types/${typeId}`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    return data;
  } catch (error) {
    console.error('티켓 유형 삭제 실패:', error);
    throw error;
  }
}

export async function createTicket(formData: FormData) {
  try {
    const {data} = await instance.post('/tickets', formData, {});
    return data;
  } catch (error) {
    console.error('티켓 생성 실패:', error);
    throw error;
  }
}

export async function getTicketStatusCount(requesterId?: number) {
  try {
    const params = requesterId ? {requesterId} : undefined;

    const {data} = await instance.get<{message: string; data: TicketStatusCount}>('/tickets/count', {params});

    return data.data;
  } catch (error) {
    console.error('티켓 상태 조회 실패:', error);
    throw error;
  }
}

export async function getTicketDetails(ticketId: number) {
  try {
    const {data} = await instance.get<{message: string; data: TicketDetails}>(`/tickets/${ticketId}`);
    return data.data;
  } catch (error) {
    console.error('티켓 상세 조회 실패:', error);
    throw error;
  }
}

export async function getPendingApprovalCount(managerId: number) {
  try {
    const {data} = await instance.get<{message: string; data: PendingApprovalCount}>(`/tickets/list/pending?managerId=${managerId}`);
    return data.data;
  } catch (error) {
    console.error('승인 대기 티켓 조회 실패:', error);
    throw error;
  }
}

export async function getPersonalTicketStatus(token: string) {
  try {
    const {data} = await instance.get<{message: string; data: PersonalTicketStatus}>('/tickets/list/personal', {
      headers: {Authorization: `Bearer ${token}`},
    });
    return data.data;
  } catch (error) {
    console.error('개인 티켓 현황 조회 실패:', error);
    throw error;
  }
}

export async function getTicketList(params: TicketListParams = {}) {
  try {
    const {data} = await instance.get<{message: string; data: TicketListResponse}>('/tickets/list', {
      params: {
        page: params.page || 0,
        size: params.size || ITEMS_PER_PAGE,
        status: params.status,
        firstCategoryId: params.firstCategoryId,
        secondCategoryId: params.secondCategoryId,
        ticketTypeId: params.ticketTypeId,
        managerId: params.managerId,
        requesterId: params.requesterId,
        createdAt: params.createdAt,
        urgent: params.urgent,
        sort: params.sort,
      },
    });
    return data.data;
  } catch (error) {
    console.error('티켓 목록 조회 실패:', error);
    throw error;
  }
}

export async function updateTicket(ticketId: number, params: UpdateTicketParams) {
  try {
    const {data} = await instance.patch(`/tickets/${ticketId}`, params);
    return data;
  } catch (error) {
    console.error('티켓 세부내용 수정 실패:', error);
    throw error;
  }
}

export async function updateTicketStatus(ticketId: number, status: string) {
  try {
    const {data} = await instance.patch(`/tickets/${ticketId}/status`, {status});
    return data;
  } catch (error) {
    console.error('티켓 상태 수정 실패:', error);
    throw error;
  }
}

export async function updateTicketPriority(ticketId: number, priority: string) {
  try {
    const {data} = await instance.patch(`/tickets/${ticketId}/priority`, {priority});
    return data;
  } catch (error) {
    console.error('티켓 우선순위 수정 실패:', error);
    throw error;
  }
}

export async function updateTicketManager(ticketId: number, managerId: number) {
  try {
    const {data} = await instance.patch(`/tickets/${ticketId}/manager`, {managerId});
    return data;
  } catch (error) {
    console.error('티켓 담당자 수정 실패:', error);
    throw error;
  }
}

export async function updateTicketCategory(ticketId: number, params: UpdateTicketCategoryParams) {
  try {
    const {data} = await instance.patch(`/tickets/${ticketId}/category`, params);
    return data;
  } catch (error) {
    console.error('티켓 카테고리 수정 실패:', error);
    throw error;
  }
}

export async function updateTicketType(ticketId: number, params: UpdateTicketTypeParams) {
  try {
    const {data} = await instance.patch(`/tickets/${ticketId}/type`, params);
    return data;
  } catch (error) {
    console.error('티켓 유형 수정 실패:', error);
    throw error;
  }
}

export async function updateTicketDeadline(ticketId: number, deadline: string) {
  try {
    const {data} = await instance.patch(`/tickets/${ticketId}/deadline`, {deadline});
    return data;
  } catch (error) {
    console.error('티켓 마감기한 수정 실패:', error);
    throw error;
  }
}

export async function deleteTicket(ticketId: number) {
  try {
    const {data} = await instance.delete(`/tickets/${ticketId}`);
    return data;
  } catch (error) {
    console.error('티켓 삭제 실패:', error);
    throw error;
  }
}

export async function reviewTicket(ticketId: number) {
  try {
    const {data} = await instance.post(`/tickets/${ticketId}/reviews`);
    return data;
  } catch (error) {
    console.error('티켓 검토 실패:', error);
    throw error;
  }
}

export async function getTicketReviews(ticketId: number) {
  try {
    const {data} = await instance.get(`/tickets/${ticketId}/reviews`, {});
    return data;
  } catch (error) {
    console.error('티켓 검토 내역 조회 실패:', error);
    throw error;
  }
}

export async function createTicketComment(ticketId: number, formData: FormData) {
  try {
    const {data} = await instance.post(`/tickets/${ticketId}/comments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    console.error('티켓 댓글 작성 실패:', error);
    throw error;
  }
}

export async function getTicketComments(ticketId: number) {
  try {
    const {data} = await instance.get(`/tickets/${ticketId}/comments`);
    return data;
  } catch (error) {
    console.error('티켓 댓글 조회 실패:', error);
    throw error;
  }
}

export async function updateTicketComment(ticketId: number, commentId: number, content: string) {
  try {
    const {data} = await instance.patch(`/tickets/${ticketId}/comments/${commentId}`, {content});
    return data;
  } catch (error) {
    console.error('티켓 댓글 수정 실패:', error);
    throw error;
  }
}

export async function deleteTicketComment(ticketId: number, commentId: number) {
  try {
    const {data} = await instance.delete(`/tickets/${ticketId}/comments/${commentId}`);
    return data;
  } catch (error) {
    console.error('티켓 댓글 삭제 실패:', error);
    throw error;
  }
}

export async function approveTicket(ticketId: number) {
  try {
    const {data} = await instance.patch(`/tickets/${ticketId}/approve`);
    return data;
  } catch (error) {
    console.error('티켓 승인 실패:', error);
    throw error;
  }
}

export async function rejectTicket(ticketId: number) {
  try {
    const {data} = await instance.patch(`/tickets/${ticketId}/reject`);
    return data;
  } catch (error) {
    console.error('티켓 반려 실패:', error);
    throw error;
  }
}

export async function updateTicketUrgent(ticketId: number, urgent: boolean): Promise<UpdateTicketUrgentResponse> {
  try {
    const {data} = await instance.patch<UpdateTicketUrgentResponse>(`/tickets/${ticketId}/urgent`, {urgent});
    return data;
  } catch (error) {
    console.error('티켓 긴급 상태 수정 실패:', error);
    throw error;
  }
}
