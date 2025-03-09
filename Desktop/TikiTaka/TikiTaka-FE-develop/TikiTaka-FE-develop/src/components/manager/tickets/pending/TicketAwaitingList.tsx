import {useState} from 'react';
import {AlertIcon, DownIcon} from '../../../common/Icon';
import {AnimatePresence} from 'framer-motion';
import {useQuery} from '@tanstack/react-query';
import {getPendingApprovalCount} from '../../../../api/service/tickets';
import PendingTicketFilter from './PendingTicketFilter';
import PendingTicketList from './PendingTicketList';
import {useUserStore} from '../../../../store/store';

export default function TicketAwaitingList() {
  const [isListVisible, setIsListVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'전체' | '나의 티켓'>('전체');

  const toggleListVisibility = () => {
    setIsListVisible((prev) => !prev);
  };

  const {userId} = useUserStore();

  //티켓 수 조회
  const {data: pendingApprovalCount} = useQuery({
    queryKey: ['pendingTicketCount', userId],
    queryFn: () => getPendingApprovalCount(userId),
    refetchInterval: 3000,
    enabled: !!userId,
  });

  return (
    <div>
      <button
        onClick={toggleListVisibility}
        className="flex items-center justify-between w-full h-15 bg-gray-1 border border-gray-2 rounded py-4 px-[30px] my-6"
      >
        <div className="flex items-center gap-2">
          <h1 className="text-title-bold">승인 대기</h1>
          {pendingApprovalCount && (
            <div className={`px-4 h-[16px] flex place-items-center rounded-full bg-gray-9 text-white `}>
              <div className="text-caption-bold">{pendingApprovalCount?.allPendingTicket}</div>
            </div>
          )}
          {pendingApprovalCount && (
            <div className={`px-4 h-[16px] flex place-items-center gap-1 rounded-full bg-error text-white `}>
              <AlertIcon />
              <div className="text-caption-bold">{pendingApprovalCount?.urgentPendingTicket}</div>
            </div>
          )}
        </div>
        <div className={`transform ${isListVisible ? 'rotate-180' : 'rotate-0'} transition-transform duration-300 ease-in-out`}>
          <DownIcon />
        </div>
      </button>

      <AnimatePresence>
        {isListVisible && (
          <div>
            <PendingTicketFilter selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
            <PendingTicketList selectedFilter={selectedFilter} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
