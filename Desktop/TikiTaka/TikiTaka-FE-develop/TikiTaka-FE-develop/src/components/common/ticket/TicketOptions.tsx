import {useEffect, useState} from 'react';
import DropDown from '../../common/Dropdown';
import {QuestionIcon, RequiredIcon, WhiteCheckIcon} from '../../common/Icon';
import {useNewTicketStore} from '../../../store/store';
import {getCategoryList} from '../../../api/service/categories';
import {useQuery} from '@tanstack/react-query';
import TicketOpstionsSecond from './TicketOptionsSecond';
import LoadingStatus from '../LoadingStatus';

export default function TicketOptions() {
  const {isUrgent, firstCategory, secondCategory, firstCategoryId, secondCategoryId, setIsUrgent, setFirstCategory, setSecondCategory} =
    useNewTicketStore();

  const checkboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setIsUrgent(isChecked);
  };

  const [isHovered, setIsHovered] = useState(false);

  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const primaryCategories = await getCategoryList();
      const secondaryRequests = primaryCategories.map(async (primary) => {
        const secondaries = await getCategoryList(primary.id);
        return {primary, secondaries};
      });

      return Promise.all(secondaryRequests);
    },
  });

  useEffect(() => {
    if (!isLoading && categories.length > 0) {
      if (firstCategoryId) {
        const selectedFirstCategory = categories.find((cat) => cat.primary.id === firstCategoryId)?.primary;
        if (selectedFirstCategory) {
          setFirstCategory(selectedFirstCategory);
        }
      }

      if (firstCategoryId && secondCategoryId) {
        const secondaryOptions = categories.find((cat) => cat.primary.id === firstCategoryId)?.secondaries ?? [];
        const selectedSecondCategory = secondaryOptions.find((cat) => cat.id === secondCategoryId);
        if (selectedSecondCategory) {
          setSecondCategory(selectedSecondCategory);
        }
      }
      
    }
  }, [categories, firstCategoryId, secondCategoryId, isLoading, setFirstCategory, setSecondCategory]);

  if (isLoading) return <LoadingStatus />;
  if (error) return null;

  const secondaryCategoryOptions = firstCategory ? (categories.find((cat) => cat.primary.id === firstCategory.id)?.secondaries ?? []) : [];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-end text-blue text-xs pr-2">
        <RequiredIcon />
        &nbsp;는 필수 항목입니다.
      </div>
      <div className="flex gap-40 px-3 text-body-bold text-gray-15">
        <div className="flex flex-col gap-3">
          <div className="flex gap-9 items-center h-[26px]">
            <p className="w-[83px]">긴급 티켓</p>
            <div className="flex gap-3 items-center">
              <label
                className={`flex items-center justify-center w-4 h-4 border rounded-md cursor-pointer 
                    ${isUrgent ? 'bg-error border-error' : 'border-gray-2 hover:border-error'}`}
              >
                <input type="checkbox" checked={isUrgent} onChange={checkboxChange} className="hidden" />
                {isUrgent && <WhiteCheckIcon />}
              </label>
              <p className={` ${isUrgent ? 'text-error text-body-bold' : 'text-gray-6 text-body-regular'}`}>긴급</p>
            </div>
          </div>
          <div className="selection">
            <p className="w-[83px]">1차 카테고리</p>
            <DropDown
              label="1차 카테고리"
              options={categories.map((category) => category.primary.name)}
              value={firstCategory?.name}
              onSelect={(selectedName) => {
                const selectedCategory = categories.find((cat) => cat.primary.name === selectedName);
                setFirstCategory(selectedCategory?.primary ?? null);
                setSecondCategory(null);
              }}
            />
          </div>
          <div className="selection">
            <div className="flex items-center gap-1 whitespace-nowrap relative">
              2차 카테고리
              <span className="relative cursor-help" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                <QuestionIcon />
                {isHovered && (
                  <div className="absolute left-0 mt-1 bg-gray-1 border border-gray-2 rounded-md py-1 px-3 text-xs text-gray-15 shadow-md">
                    2차 카테고리 선택 시 해당 카테고리 이 적용됩니다.
                  </div>
                )}
              </span>
            </div>
            <DropDown
              label="2차 카테고리"
              options={secondaryCategoryOptions.map((category) => category.name)}
              value={secondCategory?.name || ''}
              onSelect={(selectedName) => {
                const selectedCategory = secondaryCategoryOptions.find((cat) => cat.name === selectedName);
                setSecondCategory(selectedCategory ?? null);
              }}
              disabled={!firstCategory || secondaryCategoryOptions.length === 0}
            />
          </div>
        </div>
        <TicketOpstionsSecond />
      </div>
    </div>
  );
}
