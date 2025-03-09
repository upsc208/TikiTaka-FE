import instance from '../axiosInstance';

export interface Inquiry {
  inquiryId: number;
  requesterId: number;
  requesterName: string;
  type: 'QUESTION' | 'REQUEST';
  title: string;
  content: string;
  answer: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InquiriesResponse {
  message: string;
  data: Inquiry[];
}

export const getInquiries = async (page: number = 0, size: number = 20): Promise<Inquiry[]> => {
  try {
    const response = await instance.get<{message: string; data: {content: Inquiry[]}}>('/inquiries', {
      params: {page, size},
    });

    if (!response.data || !response.data.data || !Array.isArray(response.data.data.content)) {
      console.error('API 응답 형식이 올바르지 않습니다:', response.data);
      return [];
    }

    return response.data.data.content;
  } catch (error) {
    console.error('문의사항 목록 조회 실패:', error);
    return [];
  }
};

interface ApiResponse {
  message: string;
  data: null;
}

export const submitAnswer = async (inquiryId: number, answer: string): Promise<ApiResponse> => {
  try {
    const response = await instance.patch<ApiResponse>(`/inquiries/${inquiryId}/answer`, {answer});

    return response.data;
  } catch (error) {
    console.error('문의사항 답변 작성 실패:', error);
    throw error;
  }
};

interface CreateInquiryRequest {
  title: string;
  content: string;
  type: 'QUESTION' | 'REQUEST';
}

interface ApiResponse {
  message: string;
  data: null;
}

export const createInquiry = async (inquiryData: CreateInquiryRequest): Promise<ApiResponse> => {
  try {
    const response = await instance.post<ApiResponse>('/inquiries', inquiryData);

    return response.data;
  } catch (error) {
    console.error('문의사항 작성 실패:', error);
    throw error;
  }
};
