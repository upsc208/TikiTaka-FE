import {useEffect, useState} from 'react';
import DOMPurify from 'dompurify';
import {useTemplateStore} from '../../../store/store';
import {PlusCircle, RequiredIcon, SmRightIcon} from '../Icon';
import TemplateContent from './TemplateContent';
import TemplateOptions from './TemplateOptions';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import Modal from '../Modal';
import {createTicketTemplate, getTicketTemplate, updateTicketTemplate} from '../../../api/service/ticketTemplates';
import {useLimitedInput} from '../../../hooks/useInputLimit';

interface TemplateCreateViewProps {
  onCancel: () => void;
  templateId?: number;
}

export default function TemplateCreateView({onCancel, templateId}: TemplateCreateViewProps) {
  const {
    templateTitle,
    title,
    content,
    firstCategory,
    secondCategory,
    ticketType,
    manager,
    setTemplateTitle,
    setTitle,
    setContent,
    setFirstCategory,
    setSecondCategory,
    setManager,
    setTicketType,
    setFirstCategoryId,
    setSecondCategoryId,
    setManagerId,
  } = useTemplateStore();
  const [templates, setTemplates] = useState<TemplateListItem | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [hasChanges, setHasChanges] = useState(false);

  const templateTitleInput = useLimitedInput({
    maxLength: 100,
    initialValue: templateTitle,
    onLimitExceed: () => alert('제목은 최대 100자까지 입력할 수 있습니다.'),
    onChange: (value) => setTemplateTitle(value),
  });

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
    if (templateTitle || title || content || firstCategory || secondCategory || ticketType || manager) {
      setHasChanges(true);
    }
  }, [templateTitle, title, content, firstCategory, secondCategory, ticketType, manager]);

  useEffect(() => {
    if (!templateId) return;
    (async () => {
      const template = await getTicketTemplate(templateId);
      setTemplates(template);
    })();
  }, [templateId]);

  useEffect(() => {
    if (!templates) {
      setTemplateTitle('');
      setTitle('');
      setContent('');
      setFirstCategoryId(0);
      setSecondCategoryId(0);
      setTicketType({typeId: 0, typeName: ''});
      setManagerId(0);
      setFirstCategory(null);
      setSecondCategory(null);
      setManager(null);
    } else {
      setTemplateTitle(templates.templateTitle);
      setTitle(templates.title);
      setContent(templates.description);
      setTicketType({typeId: templates.typeId, typeName: templates.typeName ?? ''});
      setFirstCategoryId(Number(templates.firstCategoryId));
      setSecondCategoryId(Number(templates.secondCategoryId));
      setManagerId(Number(templates.managerId));
    }
  }, [templates]);

  const onClickBtn = () => {
    const missingFields = [];
    if (!templateTitle) missingFields.push('템플릿 제목');
    if (!title) missingFields.push('요청 제목');
    if (!content) missingFields.push('요청 내용');

    if (missingFields.length > 0) {
      setModalMessage(`다음 필수 항목을 입력해주세요:\n${missingFields.join(', ')}`);
      setIsModalOpen(true);
      return;
    }

    setModalMessage('템플릿을 저장하시겠습니까?');
    setIsModalOpen(true);
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (params: CreateTemplateParams) => {
      if (templateId) {
        return updateTicketTemplate(templateId, params);
      }
      return createTicketTemplate(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['templates']});
      queryClient.invalidateQueries({queryKey: ['ticketTemplates']});
      queryClient.invalidateQueries({queryKey: ['ticketTemplate']});

      setModalMessage(`템플릿이 저장되었습니다!`);
      setIsModalOpen(true);
    },
  });
  const confirmSubmit = async () => {
    try {
      const templateParams: CreateTemplateParams = {
        templateTitle: templateTitle.slice(0, 100),
        title: title.slice(0, 150),
        description: content.slice(0, 5000),
        typeId: ticketType.typeId,
        firstCategoryId: firstCategory?.id,
        secondCategoryId: secondCategory?.id,
        managerId: manager?.userId,
      };

      mutation.mutate(templateParams);

      setTemplateTitle('');
      setTitle('');
      setContent('');
      setFirstCategory(null);
      setSecondCategory(null);
      setTicketType({typeId: 0, typeName: ''});
      setManager(null);
      setIsModalOpen(false);

      onCancel();
    } catch (error) {
      setModalMessage('템플릿 저장에 실패했습니다. 다시 시도해주세요.');
      setIsModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col p-4 gap-4">
      <div className="flex w-full justify-between">
        <div className="flex gap-2 text-title-bold text-black">
          {!templateId && <PlusCircle />} {templateId ? '템플릿 수정' : '템플릿 생성'}
        </div>
        <div className="flex text-black text-xs gap-2 cursor-pointer pr-4" onClick={onCancel}>
          이전으로
          <SmRightIcon strokeColor="#222222" />
        </div>
      </div>
      <div className="flex flex-col w-full min-h-[550px] bg-gray-18 p-6 gap-6">
        <div className="flex gap-5 items-center">
          <div className="flex items-center gap-1 text-body-bold w-28 px-3">
            템플릿 제목 <RequiredIcon />
          </div>
          <input
            type="text"
            value={templateTitleInput.value}
            onChange={(e) => {
              const sanitizedValue = DOMPurify.sanitize(e.target.value);
              templateTitleInput.setValue(sanitizedValue);
              setTemplateTitle(sanitizedValue);
            }}
            className={`w-[400px] text-subtitle-regular border bg-white py-2 px-4 border-gray-2 focus:border-main`}
            placeholder="템플릿 제목을 입력해주세요."
          />
        </div>
        <TemplateOptions />
        <TemplateContent />
      </div>
      <div className="flex w-full justify-center">
        <button onClick={onClickBtn} className="btn mb-4">
          {templateId ? '수정 완료' : '템플릿 저장'}
        </button>
      </div>
      {isModalOpen && (
        <Modal
          title={modalMessage.includes('입력해주세요') ? '필수 입력 항목 누락' : '템플릿 저장'}
          content={modalMessage}
          backBtn="닫기"
          onBackBtnClick={() => {
            setIsModalOpen(false);
            onCancel();
          }}
          checkBtn={modalMessage.includes('입력해주세요') || modalMessage.includes('#') ? undefined : '확인'}
          onBtnClick={modalMessage.includes('입력해주세요') || modalMessage.includes('#') ? undefined : confirmSubmit}
        />
      )}
    </div>
  );
}
