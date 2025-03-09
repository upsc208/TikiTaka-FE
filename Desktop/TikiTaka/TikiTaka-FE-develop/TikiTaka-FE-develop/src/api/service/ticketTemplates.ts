import instance from '../axiosInstance';

export async function createTicketTemplate(params: CreateTemplateParams): Promise<{id: number}> {
  try {
    const {data} = await instance.post('/ticket/templates', params, {});
    return data.data.templateId;
  } catch (error) {
    console.error('템플릿 저장 실패:', error);
    throw error;
  }
}

export async function getTicketTemplate(templateId: number) {
  try {
    const {data} = await instance.get<{message: string; data: TemplateDetail}>(`/ticket/templates/${templateId}`, {});
    return data.data;
  } catch (error) {
    console.error('템플릿 조회 실패:', error);
    throw error;
  }
}

export async function getTicketTemplatesList() {
  try {
    const {data} = await instance.get<{message: string; data: TemplateListItem[]}>('/ticket/templates', {});
    return data.data;
  } catch (error) {
    console.error('템플릿 목록 조회 실패:', error);
    throw error;
  }
}

export async function updateTicketTemplate(templateId: number, params: UpdateTemplateParams) {
  try {
    const {data} = await instance.patch(`/ticket/templates/${templateId}`, params);
    return data;
  } catch (error) {
    console.error('템플릿 수정 실패:', error);
    throw error;
  }
}

export async function deleteTicketTemplate(templateId: number) {
  try {
    const {data} = await instance.delete(`/ticket/templates/${templateId}`);
    return data;
  } catch (error) {
    console.error('템플릿 삭제 실패:', error);
    throw error;
  }
}
