import instance from '../axiosInstance';

export async function createSubtask(params: CreateSubtaskParams) {
  try {
    const {data} = await instance.post('/subtasks', params);
    return data;
  } catch (error) {
    console.error('하위태스크 생성 실패:', error);
    throw error;
  }
}

export async function getSubtasks(ticketId: number) {
  try {
    const {data} = await instance.get<{message: string; data: SubtaskItem[]}>(`/subtasks/${ticketId}`);
    return data.data;
  } catch (error) {
    console.error('하위태스크 조회 실패:', error);
    throw error;
  }
}

export async function updateSubtaskDescription(taskId: number, params: UpdateSubtaskParams) {
  try {
    const {data} = await instance.patch(`/subtasks/${taskId}`, params);
    return data;
  } catch (error) {
    console.error('하위태스크 수정 실패:', error);
    throw error;
  }
}

export async function deleteSubtask(ticketId: number, taskId: number) {
  try {
    const {data} = await instance.delete(`/subtasks/${ticketId}/${taskId}`);
    return data;
  } catch (error) {
    console.error('하위태스크 삭제 실패:', error);
    throw error;
  }
}

export async function updateSubtaskStatus(ticketId: number, taskId: number, checked: boolean) {
  try {
    const {data} = await instance.patch(`/subtasks/${ticketId}/${taskId}/${checked}`);
    return data;
  } catch (error) {
    console.error('하위태스크 상태 변경 실패:', error);
    throw error;
  }
}

export async function getTicketProgress(ticketId: number) {
  try {
    const {data} = await instance.get<{message: string; data: ProgressResponse}>(`/tickets/${ticketId}/progress`);
    return data.data.progress;
  } catch (error) {
    console.error('진행률 조회 실패:', error);
    throw error;
  }
}
