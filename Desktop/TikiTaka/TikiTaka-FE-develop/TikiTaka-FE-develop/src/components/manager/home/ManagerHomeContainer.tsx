import {useEffect, useState} from 'react';
import {TicketViewType} from '../../../interfaces/ticket';
import ManagerTicketList from '../common/ManagerTicketList';
import DashTicketFilter from '../common/DashTicketFilter';
import TopMenu from '../../common/TopMenu';

export default function ManagerHomeContainer() {
  const [selectedFilter, setSelectedFilter] = useState<TicketViewType>('전체');
  const [ticketCounts, setTicketCounts] = useState<TicketStatusCount | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="top-container">
      <div className="flex flex-col max-w-1200 mb-20">
        <TopMenu
          boldBlackText="Dashboard"
          boldGrayText="티켓 관리 대시보드"
          rightText="나의 티켓 관리 바로가기"
          linkTo="/manager/tickets"
        />
        <DashTicketFilter
          onFilterChange={(type) => setSelectedFilter(type as TicketViewType)}
          onCountUpdate={(counts) => setTicketCounts(counts)}
        />
        <ManagerTicketList selectedFilter={selectedFilter} ticketCounts={ticketCounts} />
      </div>
    </div>
  );
}
