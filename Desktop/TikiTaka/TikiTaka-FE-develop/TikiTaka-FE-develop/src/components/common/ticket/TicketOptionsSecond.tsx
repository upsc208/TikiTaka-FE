import {useQuery} from '@tanstack/react-query';
import {useNewTicketStore} from '../../../store/store';
import DropDown from '../Dropdown';
import {QuestionIcon, RequiredIcon} from '../Icon';
import {getTicketTypes} from '../../../api/service/tickets';
import {useEffect, useState} from 'react';
import {getManagerList} from '../../../api/service/users';
import {getTicketTemplate, getTicketTemplatesList} from '../../../api/service/ticketTemplates';
import Modal from '../Modal';
import {typeNameMapping} from '../../../constants/constants';

export default function TicketOpstionsSecond() {
  const {
    manager,
    ticketType,
    template,
    templateId,
    managerId,
    setManager,
    setManagerId,
    setTicketType,
    setTemplate,
    setTitle,
    setContent,
    setIsUrgent,
    setFirstCategoryId,
    setSecondCategoryId,
  } = useNewTicketStore();
  const [ticketTypes, setTicketTypes] = useState<{typeId: number; typeName: string}[]>([]);
  const [templates, setTemplates] = useState<TemplateListItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const {data: userData} = useQuery({
    queryKey: ['managers'],
    queryFn: getManagerList,
    select: (data) => data.users,
  });

  const {data: ticketData} = useQuery({
    queryKey: ['types'],
    queryFn: getTicketTypes,
  });

  const {data: templateData} = useQuery({
    queryKey: ['ticketTemplates'],
    queryFn: getTicketTemplatesList,
  });

  useEffect(() => {
    if (userData && managerId) {
      const selectedUser = userData.find((user) => user.userId === managerId);
      if (selectedUser) {
        setManager(selectedUser);
      }
    }
  }, [managerId, userData]);

  useEffect(() => {
    if (ticketData) {
      setTicketTypes(ticketData);
    }
  }, [ticketData]);

  useEffect(() => {
    if (templateData) {
      setTemplates(templateData);
    }
  }, [templateData]);

  useEffect(() => {
    if (!selectedTemplateId) return;

    const fetchTemplate = async () => {
      const fetchedTemplate = await getTicketTemplate(selectedTemplateId);
      setTemplate(fetchedTemplate);
    };

    fetchTemplate();
  }, [selectedTemplateId]);

  useEffect(() => {
    if (templateId && templates.length > 0) {
      const selected = templates.find((t) => Number(t.templateId) === Number(templateId));
      if (selected) {
        setTemplate(selected);
      }
    }
  }, [templateId, templates]);

  useEffect(() => {
    setTemplate(null);
    setSelectedTemplateId(0);
  }, [location.pathname]);

  const onTemplateSelect = (value: string) => {
    const selected = templates.find((t) => t.templateTitle === value);
    if (selected) {
      setSelectedTemplateId(Number(selected.templateId));
      setIsModalOpen(true);
    }
  };

  const confirmApply = () => {
    if (!template) return;

    setTitle(template.title);
    setContent(template.description);
    setIsUrgent(false);
    setTicketType({typeId: template.typeId, typeName: template.typeName ?? ''});
    setFirstCategoryId(Number(template.firstCategoryId));
    setSecondCategoryId(Number(template.secondCategoryId));
    setManagerId(Number(template.managerId));

    setIsModalOpen(false);
  };

  const onCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="selection">
        <p className="w-12">담당자</p>
        {managerId === -1 ? (
          <div className="font-regular">담당자 수정 불가</div>
        ) : (
          <DropDown
            label="담당자"
            options={userData?.map((user) => user.username) || []}
            value={manager?.username}
            onSelect={(value) => {
              const selectedUser = userData?.find((user) => user.username === value);
              if (selectedUser) {
                setManager(selectedUser);
              }
            }}
          />
        )}
      </div>
      <div className="selection">
        <div className="flex items-center gap-1 w-12">
          유형 <RequiredIcon />
        </div>
        <DropDown
          label="유형"
          options={ticketTypes.map((t) => typeNameMapping[t.typeName] || t.typeName)}
          value={typeNameMapping[ticketType.typeName] || ticketType.typeName}
          onSelect={(selectedLabel) => {
            const selectedType = ticketTypes.find((t) => (typeNameMapping[t.typeName] || t.typeName) === selectedLabel);
            if (selectedType) {
              setTicketType(selectedType);
            }
          }}
        />
      </div>
      <div className="flex items-center gap-8 w-[340px];">
        <div className="flex items-center gap-1 whitespace-nowrap relative">
          템플릿
          <span className="relative cursor-help" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <QuestionIcon />
            {isHovered && (
              <div className="absolute left-0 mt-1 bg-gray-1 border border-gray-2 rounded-md py-1 px-3 text-xs text-gray-15 shadow-md">
                템플릿을 선택하면 사용자가 작성한 템플릿 내용이 자동으로 적용됩니다.
              </div>
            )}
          </span>
        </div>
        <DropDown
          label="템플릿"
          options={templates.map((t) => t.templateTitle)}
          value={template?.templateTitle || ''}
          onSelect={onTemplateSelect}
        />
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
