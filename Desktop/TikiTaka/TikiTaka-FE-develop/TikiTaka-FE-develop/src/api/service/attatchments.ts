import instance from '../axiosInstance';

export async function getPresignedUrl(token: string, type: string, typeId: number, fileData: PresignedUrlRequest) {
  try {
    const {data} = await instance.post<{message: string; data: PresignedUrlResponse}>(`/attachments/${type}/${typeId}`, fileData, {
      headers: {Authorization: `Bearer ${token}`},
    });
    return data.data;
  } catch (error) {
    console.error('프리사인드 URL 발급 실패:', error);
    throw error;
  }
}

export async function addAttachmentMetadata(token: string, type: string, typeId: number, metadata: AttachmentMetadata) {
  try {
    const {data} = await instance.post(`/attachments/${type}/${typeId}`, metadata, {headers: {Authorization: `Bearer ${token}`}});
    return data;
  } catch (error) {
    console.error('첨부파일 메타데이터 추가 실패:', error);
    throw error;
  }
}

export async function getAttachments(token: string, type: string, typeId: number) {
  try {
    const {data} = await instance.get<{message: string; data: AttachmentItem[]}>(`/attachments/${type}/${typeId}`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    return data.data;
  } catch (error) {
    console.error('첨부파일 조회 실패:', error);
    throw error;
  }
}

export async function deleteAttachment(fileId: number) {
  try {
    const {data} = await instance.delete(`/file/${fileId}`);
    return data;
  } catch (error) {
    console.error('첨부파일 삭제 실패:', error);
    throw error;
  }
}
