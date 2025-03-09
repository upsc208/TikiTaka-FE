import {useState} from 'react';
import CategoryCard from './CategoryCard';
import SecCategoryCard from './SecCategoryCard';
import {createCategory, deleteCategory, getCategoryList, updateCategory} from '../../../api/service/categories';
import RegCateModal from '../common/RegCateModal';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {toast} from 'react-toastify';

export default function CategoryList() {
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const {data: categories = []} = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const primaryCategories = await getCategoryList();
      const secondaryRequests = primaryCategories.map(async (primary) => {
        const secondaries = await getCategoryList(primary.id);
        return {primary, secondaries};
      });

      return Promise.all(secondaryRequests);
    },
    staleTime: 1000 * 60 * 5,
  });

  const createCategoryMutation = useMutation({
    mutationFn: (newCategory: {parentId: number | null; name: string}) => createCategory(newCategory.parentId, {name: newCategory.name}),
    onSuccess: () => {
      toast.success('카테고리가 성공적으로 등록되었습니다.');
      queryClient.invalidateQueries({queryKey: ['categories']});
    },
    onError: (error: any) => toast.error(error.message),
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({id, name}: {id: number; name: string}) => updateCategory(id, {name}),
    onSuccess: () => {
      toast.success('카테고리가 수정되었습니다.');
      queryClient.invalidateQueries({queryKey: ['categories']});
    },
    onError: () => toast.error('카테고리 수정에 실패했습니다.'),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      toast.success('카테고리가 삭제되었습니다.');
      queryClient.invalidateQueries({queryKey: ['categories']});
    },
    onError: () => toast.error('카테고리 삭제에 실패했습니다.'),
  });

  return (
    <div className="w-[550px] mt-[20px] relative mb-[100px] bg-slate-300">
      <div className="bg-gray-18 h-full flex flex-col justify-start p-4">
        <div className="flex justify-between gap-4 text-gray-700 text-title-bold mt-3 mb-5 px-4 items-center">
          <div className="w-[36%]">카테고리 조회</div>
          <button
            type="button"
            className="w-[110px] main-btn px-2 py-1 bg-main text-body-bold text-white rounded flex justify-center items-center leading-5 cursor-pointer"
            onClick={() => setIsRegModalOpen(true)}
          >
            1차 카테고리 등록
          </button>
        </div>
        {isRegModalOpen && (
          <RegCateModal
            onClose={() => setIsRegModalOpen(false)}
            onCreate={(categoryName) => createCategoryMutation.mutate({parentId: null, name: categoryName})}
          />
        )}
        {categories.map(({primary, secondaries}) => (
          <div key={primary.id}>
            <CategoryCard
              id={primary.id}
              name={primary.name}
              onEdit={(categoryId, newName) => updateCategoryMutation.mutate({id: categoryId, name: newName})}
              onDelete={() => deleteCategoryMutation.mutate(primary.id)}
              onAddSubCategory={(categoryId, name) => createCategoryMutation.mutate({parentId: categoryId, name})}
            />

            {secondaries.map((secondary) => (
              <SecCategoryCard
                key={secondary.id}
                id={secondary.id}
                parentId={primary.id}
                name={secondary.name}
                onUpdate={(categoryId, newName) => updateCategoryMutation.mutate({id: categoryId, name: newName})}
                onDelete={() => deleteCategoryMutation.mutate(secondary.id)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
