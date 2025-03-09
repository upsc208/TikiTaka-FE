import {ListIcon} from '../Icon';
import TemplateListItem from './TemplateListItem';
import {useQuery} from '@tanstack/react-query';
import {getTicketTemplatesList} from '../../../api/service/ticketTemplates';

interface TemplateListViewProps {
  onSelect: (templateId: number) => void;
}

export default function TemplateListView({onSelect}: TemplateListViewProps) {
  const {data: templates} = useQuery({
    queryKey: ['ticketTemplates'],
    queryFn: getTicketTemplatesList,
  });

  return (
    <div className="flex flex-col p-4 gap-6">
      <div className="flex gap-2 text-title-bold text-black">
        <ListIcon />
        템플릿 목록
      </div>
      {/* 목록 */}
      <div className="flex flex-col w-full min-h-[600px] bg-gray-18 p-6 gap-4">
        {/* 테이블 헤더 */}
        <div className="flex p-3 text-title-regular text-black justify-between whitespace-nowrap">
          <div className="w-48 pl-8">카테고리</div>
          <div className="w-72">템플릿</div>
          <div className="w-48">생성일자</div>
        </div>
        <ul className="w-full max-h-[530px] overflow-y-auto">
          {templates && templates.length > 0 ? (
            templates.map((template) => (
              <TemplateListItem key={template.templateId} template={template} onClick={() => onSelect(Number(template.templateId))} />
            ))
          ) : (
            <div className="flex justify-center items-center h-40 text-gray-5">등록된 템플릿이 없습니다.</div>
          )}
        </ul>
      </div>
    </div>
  );
}
