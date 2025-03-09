// 담당자 - 담당자 본인 요청 티켓 관리

import {useState} from 'react';
import TopMenu from '../../common/TopMenu';
import UserTicketFilter from '../../user/home/UserTicketFilter';
import UserTicketList from '../../user/home/UserTicketList';
import {TicketViewType} from '../../../interfaces/ticket';
export default function ManagerTicketsContainer() {
  const [selectedFilter, setSelectedFilter] = useState<TicketViewType>('전체');

  return (
    <div className="top-container">
      <div className="flex flex-col max-w-1200 mb-20">
        <TopMenu boldGrayText="내가 생성한 티켓" />

        <UserTicketFilter onFilterChange={setSelectedFilter} />
        <UserTicketList selectedFilter={selectedFilter} />
      </div>
    </div>
  );
}
