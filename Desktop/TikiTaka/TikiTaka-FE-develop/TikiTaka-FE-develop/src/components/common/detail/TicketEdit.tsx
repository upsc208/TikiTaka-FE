import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useNewTicketFormStore, useNewTicketStore} from '../../../store/store';
import {ReferredIcon, RequiredIcon} from '../Icon';
import TicketOptions from '../ticket/TicketOptions';
import {updateTicket} from '../../../api/service/tickets';
import {useEffect, useState} from 'react';
import Modal from '../Modal';
import NewTicketContent from '../ticket/NewTicketContent';

interface TicketEditProps {
  ticketData: TicketDetails;
}

export default function TicketEdit({ticketData}: TicketEditProps) {
  const queryClient = useQueryClient();

  const newData = useNewTicketStore();
  const {mustDescription} = useNewTicketFormStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasChanges) {
        event.returnValue = '변경 사항이 저장되지 않았습니다. 계속 진행하시겠습니까?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasChanges]);

  useEffect(() => {
    if (newData) {
      setHasChanges(true);
    }
  }, [newData]);

  // 기존 데이터를 상태에 설정
  useState(() => {
    newData.setTitle(ticketData.title);
    newData.setContent(ticketData.description);
    newData.setIsUrgent(ticketData.urgent);
    newData.setFirstCategoryId(ticketData.firstCategoryId);
    newData.setSecondCategoryId(ticketData.secondCategoryId);
    newData.setTicketType({typeId: ticketData.typeId, typeName: ticketData.typeName});
    newData.setDueDate(ticketData.deadline.split(' ')[0]);
    newData.setDueTime(ticketData.deadline.split(' ')[1]);
    newData.setManagerId(-1);
  });

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert('마감기한은 오늘 이후 날짜를 선택해주세요.');
      newData.setDueDate('');
    } else {
      newData.setDueDate(e.target.value);
    }
  };

  const mutation = useMutation({
    mutationFn: async (updateData: UpdateTicketParams) => updateTicket(ticketData.ticketId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['ticketDetails', ticketData.ticketId]});

      newData.setTitle('');
      newData.setContent('');
      newData.setIsUrgent(false);
      newData.setFirstCategoryId(0);
      newData.setSecondCategoryId(0);
      newData.setFirstCategory(null);
      newData.setSecondCategory(null);
      newData.setTicketType({typeId: 0, typeName: ''});
      newData.setDueDate('');
      newData.setDueTime('');
      newData.setManagerId(0);
      newData.setManager(null);
      setHasChanges(false);

      setModalMessage('티켓이 수정되었습니다.');
      setIsModalOpen(true);
    },
  });

  // 저장 버튼 클릭 시 실행되는 함수
  const handleSubmit = () => {
    console.log(newData.secondCategory?.id);
    const updatedTicket: UpdateTicketParams = {
      title: newData.title,
      description: newData.content,
      urgent: newData.isUrgent,
      ticketTypeId: newData.ticketType?.typeId,
      firstCategoryId: newData.firstCategory?.id,
      secondCategoryId: newData.secondCategory?.id || 0,
      deadline: `${newData.dueDate} ${newData.dueTime}`,
    };

    mutation.mutate(updatedTicket);
  };

  return (
    <div className="flex flex-col gap-6 w-full px-10">
      <div className="flex flex-col bg-bg-1 p-20 pt-10 gap-8 min-w-[600px]">
        <TicketOptions />
        {newData.firstCategory && newData.secondCategory && mustDescription && (
          <div className="flex items-center text-body-regular gap-3">
            <ReferredIcon />
            필수 입력 사항:
            <div className="text-error ">{mustDescription}</div>
          </div>
        )}
        <div className="flex flex-col gap-3 text-body-bold whitespace-nowrap">
          <div className="flex gap-10 items-center">
            <div className="flex items-center gap-1">
              마감 기한 <RequiredIcon />
            </div>
            <div className={`flex items-center gap-5 p-2 px-8 bg-white border border-gray-2`}>
              <input
                type="date"
                value={newData.dueDate}
                onChange={handleDueDateChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-28 text-gray-6 text-body-regular"
              />
              <input
                type="time"
                value={newData.dueTime}
                onChange={(e) => newData.setDueTime(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-24 text-gray-6 text-body-regular"
              />
            </div>
          </div>
          <NewTicketContent />
        </div>
      </div>
      <div className="flex w-full justify-center">
        <button onClick={handleSubmit} className="btn mb-4">
          티켓 수정
        </button>
      </div>
      {isModalOpen && (
        <Modal
          title="수정 완료"
          content={modalMessage}
          backBtn="닫기"
          onBackBtnClick={() => {
            setIsModalOpen(false);
            newData.setIsEditing(false);
          }}
        />
      )}
    </div>
  );
}
