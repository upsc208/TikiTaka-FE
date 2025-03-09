import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useUserStore} from '../../../store/store';
import {AlertIcon} from '../../common/Icon';
import TicketDropdown from './TicketDropdown';
import ManagerSelector from '../../common/selector/ManagerSelector';
import {useCreateMutation} from '../../../api/hooks/useCreateMutation';
import {updateTicketManager} from '../../../api/service/tickets';
import {reverseStatusMapping, statusMapping, typeNameMapping} from '../../../constants/constants';
import {formatCreatedAt, removeHtmlTags, removeMarkdownTags} from '../../../utils/format';
import {useQueryClient} from '@tanstack/react-query';

interface DashTicketProps extends TicketListItem {
  detailLink: string;
  onApprove?: (ticketId: number) => void;
  onReject?: (ticketId: number) => void;
  onStatusChange: (ticketId: number, newStatus: string) => void;
}

const getTicketClass = (urgent: boolean, status: string) => {
  if (!urgent) return 'border-gray-2 bg-white hover:bg-gray-1';

  const activeStatuses = ['PENDING', 'IN_PROGRESS', 'REVIEW'];
  if (activeStatuses.includes(status)) {
    return 'border-error bg-red/5 hover:bg-red/10';
  }
  return 'border-error bg-white hover:bg-red/5';
};

export default function DashTicket({
  ticketId,
  title,
  typeName,
  description,
  firstCategoryName,
  secondCategoryName,
  managerName,
  status,
  urgent,
  deadline,
  createdAt,
  detailLink,
  onApprove,
  onReject,
  onStatusChange,
}: DashTicketProps) {
  const role = useUserStore((state) => state.role).toLowerCase();
  const queryClient = useQueryClient();
  const [selectedAssignee] = useState(managerName);

  const updateManagerMutation = useCreateMutation(
    (managerId: number) => updateTicketManager(ticketId, managerId),
    '티켓 담당자 변경에 실패했습니다. 다시 시도해 주세요.',
    ticketId
  );

  const handleManagerSelect = (managerId: number) => {
    updateManagerMutation.mutate(managerId);
    queryClient.invalidateQueries({queryKey: ['ticketStatusCounts']});
  };

  const ticketClass = getTicketClass(urgent, status);

  const sanitizeContent = (content: string) => {
    const withoutHtml = removeHtmlTags(content);
    return removeMarkdownTags(withoutHtml);
  };

  const cleanedDescription = sanitizeContent(description);

  return (
    <div className={`flex gap-4 py-3 px-2 border items-center rounded cursor-pointer transition-all duration-200 ${ticketClass}`}>
      <Link to={detailLink} className="w-[6%] text-subtitle-regular text-gray-700 px-2">
        #{ticketId}
      </Link>
      <Link to={detailLink} className="w-[14%] text-subtitle-regular">
        <span>{firstCategoryName || '1차 카테고리 미지정'}</span>
        <br />
        <span className="text-gray-6 text-body-regular">{secondCategoryName || '2차 카테고리 미지정'}</span>
      </Link>
      <Link to={detailLink} className={role === 'manager' ? 'w-[32%]' : 'w-[51%]'} style={{textAlign: 'left'}}>
        <div className="flex items-center gap-1">
          {urgent && <AlertIcon className="text-error w-4 h-4 flex-shrink-0" />}
          <div className={`flex text-subtitle-regular truncate ${urgent ? 'text-error' : 'text-gray-15'}`}>
            [{typeNameMapping[typeName] || '미정'}]<div className="ml-1">{title}</div>
          </div>
        </div>
        <div className="text-gray-6 text-body-regular">
          {cleanedDescription.length > 40 ? `${cleanedDescription.slice(0, 40)}...` : cleanedDescription}
        </div>
      </Link>
      <Link to={detailLink} className="w-[12%] text-body-regular text-gray-15">
        <span className="text-gray-5">{formatCreatedAt(createdAt)}</span>
        <br />
        {deadline}
      </Link>
      <div className="w-[12%]">
        <ManagerSelector selectedManagerName={selectedAssignee} onManagerSelect={handleManagerSelect} />
      </div>
      <div className="w-[15%] flex gap-2">
        {status === 'PENDING' ? (
          <>
            <button
              className="px-6 h-[30px] text-[12px] leading-none border border-gray-6 rounded-md hover:bg-gray-8 hover:text-white"
              onClick={() => onApprove && onApprove(ticketId)}
            >
              승인
            </button>
            <button
              className="px-6 h-[30px] text-[12px] leading-none border border-gray-6 rounded-md hover:bg-error/80 hover:text-white"
              onClick={() => onReject && onReject(ticketId)}
            >
              반려
            </button>
          </>
        ) : status === 'IN_PROGRESS' || status === 'REVIEW' ? (
          <TicketDropdown
            label={statusMapping[status]}
            options={['대기중', '진행중', '완료']}
            onSelect={(selectedStatus) => {
              const newStatus = reverseStatusMapping[selectedStatus];
              if (newStatus !== 'IN_PROGRESS') {
                onStatusChange(ticketId, newStatus);
              }
            }}
            paddingX="px-3"
            border={true}
            textColor="text-gray-15"
          />
        ) : (
          <div
            className={`px-10 h-[30px] text-[12px] leading-none border rounded-md flex items-center justify-center 
        ${status === 'DONE' ? 'bg-blue/15 text-body-regular ' : ''}
        ${status === 'REJECTED' ? 'bg-error/15 text-body-regular ' : ''}
        ${status !== 'DONE' && status !== 'REJECTED' ? 'bg-gray-1 text-gray-700 border-gray-6' : ''}
      `}
          >
            {statusMapping[status] || '상태 없음'}
          </div>
        )}
      </div>
    </div>
  );
}
