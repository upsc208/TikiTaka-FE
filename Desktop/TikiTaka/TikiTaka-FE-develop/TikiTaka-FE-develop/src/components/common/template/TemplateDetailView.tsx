import {useState} from 'react';
import {deleteTicketTemplate, getTicketTemplate} from '../../../api/service/ticketTemplates';
import {useNewTicketStore} from '../../../store/store';
import Modal from '../Modal';
import TemplateCreateView from './TemplateCreateView';
import {useQuery} from '@tanstack/react-query';
import LoadingStatus from '../LoadingStatus';

interface TemplateDetailViewProps {
  templateId: number;
  onDelete: () => void;
}

export default function TemplateDetailView({templateId, onDelete}: TemplateDetailViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {setTitle, setContent, setIsUrgent, setTicketType, setFirstCategoryId, setSecondCategoryId, setManagerId, setTemplateId} =
    useNewTicketStore();

  const {data: templates} = useQuery<TemplateListItem>({
    queryKey: ['ticketTemplate', templateId],
    queryFn: () => getTicketTemplate(templateId),
    enabled: !!templateId,
  });

  const onApplyClick = () => {
    setIsModalOpen(true);
  };

  const confirmApply = () => {
    if (!templates) return;

    setTitle(templates.title);
    setContent(templates.description);
    setIsUrgent(false);
    setTicketType({typeId: templates.typeId, typeName: templates.typeName ?? ''});
    setFirstCategoryId(Number(templates.firstCategoryId));
    setSecondCategoryId(Number(templates.secondCategoryId));
    setManagerId(Number(templates.managerId));
    setTemplateId(Number(templates.templateId));
    setIsModalOpen(false);
  };
  const onCancel = () => {
    setIsModalOpen(false);
  };

  const onEditClick = async () => {
    setIsEditing(true);
  };

  const onDeleteClick = async () => {
    if (!templates) return;

    const confirmDelete = window.confirm('이 템플릿을 삭제하시겠습니까?');
    if (confirmDelete) {
      try {
        await deleteTicketTemplate(templateId);
        alert('템플릿 삭제가 완료되었습니다.');
        onDelete();
      } catch (error) {
        alert('템플릿 삭제에 실패했습니다.');
      }
    }
  };

  const renderTemplateDetail = (label: string, value: string | undefined) => (
    <div className="flex flex-col w-full">
      <div className="text-body-bold w-24">{label}</div>
      <div className="w-full break-words">{value || '미지정'}</div>
    </div>
  );

  if (isEditing) {
    return <TemplateCreateView templateId={templateId} onCancel={() => setIsEditing(false)} />;
  }

  if (!templates) {
    return <LoadingStatus/>;
  }

  return (
    <div className="flex flex-col p-4 gap-6">
      <div className="flex text-title-bold text-black justify-between">
        <p className="text-title-bold w-[350px] break-words truncate">{templates.templateTitle}</p>
        <div className="flex gap-4 justify-center whitespace-nowrap">
          <button onClick={onEditClick} className="px-6 py-1 bg-main text-white text-body-bold rounded hover:bg-gray-8">
            템플릿 수정
          </button>
          <button onClick={onDeleteClick} className="px-6 py-1 bg-main text-white text-body-bold rounded hover:bg-gray-8">
            템플릿 삭제
          </button>
        </div>
      </div>
      {/* 내용 */}
      <div className="flex flex-col w-full h-[600px] bg-gray-18 p-7 gap-6 text-body-regular overflow-y-auto">
        {renderTemplateDetail('템플릿 제목', templates.templateTitle)}
        {renderTemplateDetail('1차 카테고리', templates.firstCategoryName)}
        {renderTemplateDetail('2차 카테고리', templates.secondCategoryName)}
        {renderTemplateDetail('담당자', templates.managerName)}
        {renderTemplateDetail('유형', templates.typeName)}
        {renderTemplateDetail('요청 제목', templates.title)}
        {renderTemplateDetail('요청 내용', templates.description)}
      </div>
      <div className="flex w-full justify-center">
        <button onClick={onApplyClick} className="btn mb-4">
          적용
        </button>
      </div>

      {isModalOpen && (
        <Modal
          title="템플릿 적용"
          content="현재 작성 중인 내용이 템플릿 내용으로 덮어씌워집니다. 계속하시겠습니까?"
          backBtn="취소"
          onBackBtnClick={onCancel}
          checkBtn="확인"
          onBtnClick={confirmApply}
        />
      )}
    </div>
  );
}
