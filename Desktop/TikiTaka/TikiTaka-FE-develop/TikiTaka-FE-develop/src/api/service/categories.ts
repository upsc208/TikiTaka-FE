import instance from '../axiosInstance';

export async function createCategory(parentId: number | null, categoryData: { name: string }) {
  try {
    const url = parentId !== null ? `/categories?parentId=${parentId}` : '/categories';
    const response = await instance.post(url, categoryData, {});
    return response.data;
  } catch (error: any) {
    console.error('카테고리 생성 실패:', error);
    
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    
    throw new Error('카테고리 생성 중 오류가 발생했습니다.');
  }
}


export async function getCategoryList(parentId?: number) {
  try {
    const url = parentId ? `/categories/list?parentId=${parentId}` : '/categories/list';
    const response = await instance.get<{message: string; data: Category[]}>(url, {});
    const {data} = response;
    return data.data;
  } catch (error) {
    console.error('카테고리 조회 실패:', error);
    throw error;
  }
}

export async function updateCategory(categoryId: number, categoryData: UpdateCategoryData) {
  try {
    const {data} = await instance.patch(`/categories/${categoryId}`, categoryData);
    return data;
  } catch (error) {
    console.error('카테고리 수정 실패:', error);
    throw error;
  }
}

export async function deleteCategory(categoryId: number) {
  try {
    const {data} = await instance.delete(`/categories/${categoryId}`, {});
    return data;
  } catch (error) {
    console.error('카테고리 삭제 실패:', error);
    throw error;
  }
}
