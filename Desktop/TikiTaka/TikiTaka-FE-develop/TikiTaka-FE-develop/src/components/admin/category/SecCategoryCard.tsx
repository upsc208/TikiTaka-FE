import { useState, useRef, useEffect } from "react";
import { VerticalDotIcon } from "../../common/Icon";
import RegisterRequestForm from "./RegisterRequestForm";
import RequestFormDetail from "./RequestFormDetail";
import DeleteConfirmModal from "../common/DeleteConfirmModal";
import { getTicketForm } from "../../../api/service/tickets";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

interface SecCategoryCardProps {
  id: number; 
  parentId: number; 
  name: string;
  onDelete: (categoryId: number) => void;
  onUpdate: (categoryId: number, newName: string) => void;
}

export default function SecCategoryCard({ id, parentId, name, onDelete, onUpdate }: SecCategoryCardProps) {
  const [isReqFormOpen, setIsReqFormOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
  const [newCategoryName, setNewCategoryName] = useState(name); 
  const [requestForm, setRequestForm] = useState<{ mustDescription: string; description: string } | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

   const fetchRequestForm = async () => {
    try {
      const formData = await getTicketForm(parentId, id);
      setRequestForm(formData?.description || formData?.mustDescription ? formData : null);
    } catch (error) {
      setRequestForm(null);
    }
  };

  const handleRequestFormCreated = (newForm: { mustDescription: string; description: string }) => {
    setRequestForm(newForm);
    setIsReqFormOpen(true); 
  };

  useEffect(() => {
    fetchRequestForm();
  }, [id, parentId]);

  
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleUpdate = () => {
    if (!newCategoryName.trim()) {
      toast.error("카테고리 이름을 입력하세요.");
      return;
    }
    onUpdate(id, newCategoryName);
    setIsEditModalOpen(false);
  };

  const handleDelete = () => {
    onDelete(id);
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-end mb-2">
      <div className="w-[470px] h-[48px] flex border border-gray-2 px-4 bg-gray-1 rounded-md">
        <div className="flex items-center w-full text-subtitle-regular justify-between">
          <div className="flex items-center gap-2">
            <span className="border border-gray-3 text-[10px] px-2 h-[19px] font-semibold rounded-full flex items-center justify-center leading-none">
              2차
            </span>
            <span className="text-subtitle-regular leading-none">{name}</span>
          </div>
          <div className="flex gap-2 items-center relative">
          <button
              className={`px-4 py-1 text-body-regular rounded flex justify-center items-center leading-5 cursor-pointer 
              ${requestForm ? "border border-gray-3 text-gray-800 bg-white hover:bg-gray-100 " : "bg-main text-white"}`}
              onClick={() => setIsReqFormOpen(true)}
            >
              {isReqFormOpen ? (requestForm ? '조회 중' : '작성 중') : requestForm ? '상세' : '요청 양식'}
            </button>

            {isReqFormOpen &&
              (requestForm ? (
                <RequestFormDetail
                  firstCategoryId={parentId}
                  secondCategoryId={id}
                  mustDescription={requestForm.mustDescription}
                  description={requestForm.description}
                  onClose={() => setIsReqFormOpen(false)}
                  name={name}
                  refreshRequestForm={fetchRequestForm}
                />
              ) : (
                <RegisterRequestForm name={name} firstCategoryId={parentId} secondCategoryId={id} onClose={() => setIsReqFormOpen(false)} onRequestFormCreated={handleRequestFormCreated}/>
              ))}

            <button onClick={toggleMenu}>
              <VerticalDotIcon />
            </button>

            {isMenuOpen && (
              <div ref={menuRef} className="absolute top-[24px] right-0 mt-2 w-24 bg-white border border-gray-300 shadow-md rounded-md z-10">
                <button className="w-full px-4 py-2 text-body-bold text-center hover:bg-gray-100" onClick={() => setIsEditModalOpen(true)}>
                  수정
                </button>
                <button className="w-full px-4 py-2 text-body-bold text-center hover:bg-gray-100 text-error" onClick={() => setIsDeleteModalOpen(true)}>
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <motion.div className="overlay" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
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
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setIsEditModalOpen(false)}>
                취소
              </button>
              <button className="px-4 py-2 bg-main text-white rounded" onClick={handleUpdate}>
                확인
              </button>
            </div>
          </div>
        </div>
        </motion.div>
      )}

      <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} categoryName={name} isPrimary={false}/>
    </div>
  );
}
