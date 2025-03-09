import {useState} from 'react';
import TopMenu from '../../common/TopMenu';
import UserCountAnalytics from './UserCountAnalytics';
import {TicketViewType} from '../../../interfaces/ticket';
import UserTicketFilter from './UserTicketFilter';
import UserTicketList from './UserTicketList';

export default function UserHomeContainer() {
  const [selectedFilter, setSelectedFilter] = useState<TicketViewType>('전체');
  return (
    <div className="top-container">
      <div className="flex flex-col max-w-1200">
        <TopMenu boldBlackText="Dashboard" boldGrayText="티켓 관리 대시보드" rightText="티켓 생성 바로가기" linkTo="/user/newticket" />
        <div className="mt-5 flex gap-6">
          <UserCountAnalytics />
        </div>
        <UserTicketFilter onFilterChange={setSelectedFilter} />
        <UserTicketList selectedFilter={selectedFilter} />
      </div>
    </div>
  );
}
