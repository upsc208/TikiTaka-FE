import {motion, AnimatePresence} from 'framer-motion';
import {useState} from 'react';
import {RightArrowIcon} from '../../common/Icon';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {deleteTicketForm, updateTicketForm} from '../../../api/service/tickets';
import {toast} from 'react-toastify';
import Modal from '../../common/Modal';
import DOMPurify from 'dompurify';
import {useLimitedInput} from '../../../hooks/useInputLimit';

interface RequestFormDetailProps {
  mustDescription: string;
  description: string;
  firstCategoryId: number;
  secondCategoryId: number;
  onClose: () => void;
  name: string;
  refreshRequestForm: () => void;
}

export default function RequestFormDetail({
  firstCategoryId,
  secondCategoryId,
  mustDescription,
  description,
  onClose,
  name,
  refreshRequestForm,
}: RequestFormDetailProps) {
  const queryClient = useQueryClient();
  const [isClosing, setIsClosing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newMustDescription, setNewMustDescription] = useState(mustDescription);
  const [newDescription, setNewDescription] = useState(description);

  const mustInput = useLimitedInput({
    maxLength: 150,
    initialValue: mustDescription,
    onLimitExceed: () => alert('필수 입력 사항은 최대 150자까지 입력할 수 있습니다.'),
    onChange: (value) => setNewMustDescription(value),
  });

  const descriptionInput = useLimitedInput({
    maxLength: 1000,
    initialValue: description,
    onLimitExceed: () => alert('내용은 최대 1000자까지 입력할 수 있습니다.'),
    onChange: (value) => setNewDescription(value),
  });

  const editMutation = useMutation({
    mutationFn: () =>
      updateTicketForm(firstCategoryId, secondCategoryId, {
        mustDescription: newMustDescription,
        description: newDescription,
      }),
    onSuccess: () => {
      toast.success('티켓 양식이 수정되었습니다.');
      refreshRequestForm();
      setIsEditing(false);
    },
    onError: () => {
      toast.error('티켓 양식 수정에 실패했습니다.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTicketForm(firstCategoryId, secondCategoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['ticketForms']});
      toast.success('티켓 양식이 삭제되었습니다.');
      setShowDeleteModal(false);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    },
    onError: () => {
      toast.error('티켓 양식 삭제에 실패했습니다.');
    },
  });

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <AnimatePresence>
      {!isClosing && (
        <motion.div
          initial={{x: '100%'}}
          animate={{x: 0}}
          exit={{x: '100%'}}
          transition={{duration: 0.3, ease: 'easeInOut'}}
          className="fixed top-0 right-0 w-[820px] h-full bg-white shadow-lg z-50 p-6 flex flex-col"
        >
          <button className="text-gray-600 text-lg mb-4 flex justify-start" onClick={handleClose}>
            <RightArrowIcon />
          </button>
          <div className="flex justify-between items-center">
            <div className="text-title-bold text-gray-800 ">{name}</div>
            <div className="flex justify-start gap-4">
              {!isEditing ? (
                <button className="px-6 py-1 bg-main text-white text-body-bold rounded" onClick={() => setIsEditing(true)}>
                  요청양식 수정
                </button>
              ) : (
                <button className="px-6 py-1 bg-gray-8 text-white text-body-bold rounded" onClick={() => setIsEditing(false)}>
                  취소
                </button>
              )}
              <button className="px-6 py-1 bg-main text-white text-body-bold rounded" onClick={() => setShowDeleteModal(true)}>
                요청양식 삭제
              </button>
            </div>
          </div>
          {isEditing ? (
            <div className="w-[780px] h-[550px] bg-gray-18 mt-4 px-4 mx-auto shadow-[0px_1px_3px_1px_rgba(0,0,0,0.15)]">
              <div className="mt-4">
                <label className="block text-gray-700 font-semibold mb-2">필수 입력 사항</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded mt-1 text-body-regular"
                  placeholder="필수 입력 사항을 입력해주세요"
                  value={mustInput.value}
                  onChange={(e) => {
                    const sanitizedValue = DOMPurify.sanitize(e.target.value);
                    mustInput.setValue(sanitizedValue);
                    setNewMustDescription(sanitizedValue);
                  }}
                />
              </div>
              <div className="mt-6">
                <label className="block text-gray-700 font-semibold mb-2">요청 내용</label>
                <textarea
                  rows={5}
                  placeholder="요청 내용을 입력해주세요"
                  style={{resize: 'none', outline: 'none'}}
                  className="w-full h-[280px] px-3 py-2 border border-gray-300 rounded mt-1 text-body-regular resize-none"
                  value={descriptionInput.value}
                  onChange={(e) => {
                    const sanitizedValue = DOMPurify.sanitize(e.target.value);
                    descriptionInput.setValue(sanitizedValue);
                    setNewDescription(sanitizedValue);
                  }}
                />
              </div>
              <div className="mt-6 flex justify-center">
                <button className="px-5 py-1 main-btn bg-main text-white text-body-bold rounded" onClick={() => editMutation.mutate()}>
                  요청 양식 수정
                </button>
              </div>
            </div>
          ) : (
            <div className="w-[780px] max-h-[550px] bg-gray-18 mt-4 px-4 mx-auto shadow-[0px_1px_3px_1px_rgba(0,0,0,0.15)] overflow-y-auto">
              <div className="mt-4">
                <div className="block text-gray-700 font-semibold mb-2">필수 입력 사항</div>
                <div className="text-gray-600 text-body-regular">{mustDescription}</div>
              </div>
              <div className="mt-6 mb-6">
                <div className="block text-gray-700 font-semibold mb-2">요청 내용</div>
                <div className="text-gray-600 text-body-regular whitespace-pre-wrap ">{description}</div>
              </div>
            </div>
          )}
          {showDeleteModal && (
            <Modal
              title="요청 양식 삭제"
              content={`정말로 "${name}" 요청 양식을 삭제하시겠습니까?`}
              backBtn="취소"
              onBackBtnClick={() => setShowDeleteModal(false)}
              checkBtn="삭제"
              onBtnClick={() => deleteMutation.mutate()}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
