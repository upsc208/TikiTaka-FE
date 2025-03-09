import {Link} from 'react-router-dom';
import {AlertIcon} from '../../common/Icon';
import {formatCreatedAt, removeHtmlTags, removeMarkdownTags} from '../../../utils/format';
import {typeNameMapping} from '../../../constants/constants';

interface UserTicketProps extends TicketListItem {
  detailLink: string;
  onAssigneeChange?: (newAssignee: string) => void;
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

  return 'border-error bg-white hover:bg-red/5 ';
};

export default function UserTicket({
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
}: UserTicketProps) {
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
      <Link to={detailLink} className="w-[18%] text-subtitle-regular">
        <span>{firstCategoryName || '1차 카테고리 미지정'}</span>
        <br />
        <span className="text-gray-6 text-body-regular">{secondCategoryName || '2차 카테고리 미지정'}</span>
      </Link>
      <Link to={detailLink} className="w-[40%]" style={{textAlign: 'left'}}>
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
      <Link to={detailLink} className="w-[18%] text-body-regular text-gray-15">
        <span className="text-gray-5">{formatCreatedAt(createdAt)}</span>
        <br />
        {deadline}
      </Link>
      <div className="w-[18%] text-body-regular">{managerName ? managerName : 'all'}</div>
    </div>
  );
}
