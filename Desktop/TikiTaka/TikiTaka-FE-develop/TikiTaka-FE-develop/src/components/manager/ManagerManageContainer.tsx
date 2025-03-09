import TopMenu from '../common/TopMenu';
import TicketAwaitingList from './tickets/pending/TicketAwaitingList';
import TicketAnalytics from './tickets/TicketAnalytics';
import TicketPersonalManageList from './tickets/TicketPersonalManageList';

export default function ManagerManageContainer() {
  return (
    <div className="top-container">
      <div className="flex flex-col max-w-1200 mb-20">
        <TopMenu boldGrayText="나의 티켓 관리" />
        <div className="mt-5 flex gap-6">
          <TicketAnalytics />
        </div>
        <TicketAwaitingList />
        <TicketPersonalManageList />
      </div>
    </div>
  );
}
