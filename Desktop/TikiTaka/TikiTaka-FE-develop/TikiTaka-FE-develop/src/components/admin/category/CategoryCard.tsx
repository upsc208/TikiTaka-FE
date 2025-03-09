import {useState, useRef, useEffect} from 'react';
import {PlusCircle, VerticalDotIcon} from '../../common/Icon';
import DeleteConfirmModal from '../common/DeleteConfirmModal';

interface CategoryCardProps {
  id: number;
  name: string;
  onEdit: (categoryId: number, newName: string) => void;
  onDelete: (categoryId: number) => void;
  onAddSubCategory: (categoryId: number, name: string) => void;
}

export default function CategoryCard({id, name, onEdit, onDelete, onAddSubCategory}: CategoryCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [subCategoryName, setSubCategoryName] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState(name);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!isEditing) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsEditing(false);
        setSubCategoryName('');
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isEditing]);

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === 'Enter' && subCategoryName.trim()) {
      onAddSubCategory(id, subCategoryName);
      setSubCategoryName('');
      setIsEditing(false);
    }
  };

  return (
    <div className="flex flex-col border border-gray-2 bg-white rounded text-subtitle-regular relative mb-2">
      <div className="flex justify-between px-4 py-3 items-center">
        <div className="flex items-center gap-2">
          <span className="border border-gray-3 text-[10px] px-2 h-[19px] font-semibold rounded-full flex items-center justify-center">
            1차
          </span>
          <span className="text-subtitle-regular">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setIsEditing(true)}>
            <PlusCircle />
          </button>
          <button type="button" onClick={() => setIsMenuOpen((prev) => !prev)}>
            <VerticalDotIcon />
          </button>
          {isMenuOpen && (
            <div ref={menuRef} className="absolute top-[32px] right-[16px] bg-white border border-gray-300 shadow-md rounded-md z-10">
              <button type="button" className="w-full px-4 py-2 text-body-bold hover:bg-gray-100" onClick={() => setIsEditModalOpen(true)}>
                수정
              </button>
              <button
                type="button"
                className="w-full px-4 py-2 text-body-bold text-error hover:bg-gray-100"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="px-4 pb-3">
          <input
            ref={inputRef}
            type="text"
            className="border border-gray-3 rounded px-2 py-1 w-full text-body-regular"
            placeholder="2차 카테고리 입력"
            value={subCategoryName}
            onChange={(e) => setSubCategoryName(e.target.value)}
            onKeyDown={handleSubmit}
            autoFocus
          />
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">카테고리 수정</h2>
            <input
              type="text"
              className="border border-gray-3 rounded px-2 py-1 w-full text-body-regular"
              placeholder={name}
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <div className="flex justify-end mt-4 gap-2">
              <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={() => setIsEditModalOpen(false)}>
                취소
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-main text-white rounded"
                onClick={() => {
                  onEdit(id, newCategoryName);
                  setIsEditModalOpen(false);
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => onDelete(id)}
        categoryName={name}
        isPrimary={true}
      />
    </div>
  );
}
