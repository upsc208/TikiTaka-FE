import {useEffect, useState} from 'react';
import {TicketDataProps} from '../../../interfaces/ticket';
import Dropdown from '../Dropdown';
import {AlertIcon} from '../Icon';
import {Link} from 'react-router-dom';
import {useUserStore} from '../../../store/store';
import ManagerSelector from '../selector/ManagerSelector';
import {useCreateMutation} from '../../../api/hooks/useCreateMutation';
import {updateTicketManager} from '../../../api/service/tickets';
import {typeNameMapping} from '../../../constants/constants';
import {formatCreatedAt} from '../../../utils/format';

interface TicketProps extends TicketDataProps {
  onApprove?: () => void;
  onReject?: () => void;
}

// 담당자 목록 (managerName이 null이 아니면 포함)
const assigneeOptions = ['all'];

const getTicketClass = (urgent: boolean, status: string) => {
  if (!urgent) return 'border-gray-2 bg-white hover:bg-gray-1';

  const activeStatuses = ['PENDING', 'IN_PROGRESS', 'REVIEW'];
  if (activeStatuses.includes(status)) {
    return 'border-error bg-red/5 hover:bg-red/10';
  }

  return 'border-error bg-white hover:bg-red/5';
};

export default function Ticket({
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
  onApprove,
  onReject,
}: TicketProps) {
  const [selectedAssignee, setSelectedAssignee] = useState(managerName);
  const [ticketStatus, setTicketStatus] = useState(status);

  const {role} = useUserStore();

  if (managerName && !assigneeOptions.includes(managerName)) {
    assigneeOptions.push(managerName);
  }

  useEffect(() => {
    setSelectedAssignee(managerName || 'all');
  }, [managerName]);

  const handleApprove = () => {
    setTicketStatus('IN_PROGRESS');
    if (onApprove) {
      onApprove();
    }
  };

  const handleReject = () => {
    setTicketStatus('REJECTED');
    if (onReject) {
      onReject();
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const updateManagerMutation = useCreateMutation(
    (managerId: number) => updateTicketManager(ticketId, managerId),
    '티켓 담당자 변경에 실패했습니다. 다시 시도해 주세요.',
    ticketId
  );

  const handleManagerSelect = (managerId: number) => {
    updateManagerMutation.mutate(managerId);
  };

  const ticketClass = getTicketClass(urgent, status);

  return (
    <Link className="group relative" to={role === 'USER' ? `/user/detail/${ticketId}` : `/manager/detail/${ticketId}`}>
      <div className={`flex gap-4 py-4 px-2 border items-center rounded cursor-pointer transition-all duration-200 ${ticketClass}`}>
        {/* 티켓 ID */}
        <div className="w-[6%] text-subtitle-regular text-gray-700 px-2">#{ticketId}</div>

        {/* 카테고리 */}
        <div className="w-[14%] text-subtitle-regular">
          <span>{firstCategoryName || '1차 카테고리 미지정'}</span>
          <br />
          <span className="text-gray-6 text-body-regular">{secondCategoryName || '2차 카테고리 미지정'}</span>
        </div>

        {/* 요청 내용 */}
        <div className="w-[30%]" style={{textAlign: 'left'}}>
          <div className="flex items-center gap-1">
            {urgent && <AlertIcon className="text-error w-4 h-4" />}

            <div className={`text-subtitle-regular truncate ${urgent ? 'text-error' : 'text-gray-15'}`}>
              [{typeNameMapping[typeName ?? '']}] {title}
            </div>
          </div>
          <div className="text-gray-6 text-body-regular">{description.length > 40 ? `${description.slice(0, 40)}...` : description}</div>
        </div>

        {/* 기한 */}
        <div className="w-[12%] text-body-regular text-gray-15">
          <span className="text-gray-5">{formatCreatedAt(createdAt)}</span>
          <br />
          {deadline}
        </div>

        {/* 담당자 */}
        <div className="w-[14%]" onClick={handleClick}>
          <ManagerSelector selectedManagerName={selectedAssignee} onManagerSelect={handleManagerSelect} />
        </div>

        <div className="w-[15%] flex gap-2" onClick={handleClick}>
          {role !== 'USER' && ticketStatus === 'PENDING' && (
            <>
              <button
                className="px-6 h-[30px] text-[12px] leading-none border border-gray-6 rounded-md hover:bg-gray-8 hover:text-white"
                onClick={handleApprove}
              >
                승인
              </button>
              <button
                className="px-6 h-[30px] text-[12px] leading-none border border-gray-6 rounded-md hover:bg-error/80 hover:text-white"
                onClick={handleReject}
              >
                반려
              </button>
            </>
          )}
          {ticketStatus === 'IN_PROGRESS' && role !== 'USER' && (
            <Dropdown
              label="진행중"
              options={['진행중', '완료']}
              defaultSelected="진행중"
              onSelect={() => setTicketStatus('COMPLETED')}
              paddingX="px-5"
              border={true}
              textColor="text-gray-15"
            />
          )}
          {ticketStatus === 'COMPLETED' && (
            <div className="px-8 py-1.5 text-[12px] leading-none border text-blue border-gray-2 bg-gray-1 rounded-md">완료</div>
          )}
          {ticketStatus === 'REJECTED' && (
            <div className="px-8 py-1.5 text-[12px] leading-none border text-error border-error/50 bg-error/10 rounded-md">반려</div>
          )}
        </div>
      </div>
    </Link>
  );
}
