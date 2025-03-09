import {useState} from 'react';
import CategoryTicketStatus from '../../common/statistics/CategoryTicketStatus';
import TopMenu from '../../common/TopMenu';
import ManagerTicketStatus from './daily/ManagerTicketStatus';
import StatisticsFilter from './StatisticsFilter';
import TodayTicketStatus from './daily/TodayTicketStatus';
import ManagerTicketPeriodStatus from './monthly/ManagerTicketPeriodStatus';
import MonthlyTicketStatus from './monthly/MonthlyTicketStatus';
import MonthCategoryTicketStatus from '../../common/statistics/MonthCategoryTicketStatus';
import UserTypeAnalytics from '../../user/home/UserTypeAnalytics';

export default function ManagerStatisticsContainer() {
  const [selectedFilter, setSelectedFilter] = useState('일별');

  return (
    <div className="top-container">
      <div className="flex flex-col max-w-1200 px-[46px]">
        <TopMenu boldBlackText="통계 관리" rightText="티켓 관리 대시보드 바로가기" linkTo="/manager" />
        <StatisticsFilter onFilterChange={setSelectedFilter} />

        {selectedFilter === '일별' ? (
          <section className="flex bg-gray-18 p-6 mt-3 mb-[100px]">
            <div className="flex flex-col mb-[100px]">
              <div className="w-full grid grid-cols-2">
                <TodayTicketStatus />
                <UserTypeAnalytics />
              </div>

              <ManagerTicketStatus />
              <CategoryTicketStatus />
            </div>
          </section>
        ) : (
          <section className="flex bg-gray-18 p-6 mt-3 mb-[100px]">
            <div className="flex flex-col mb-[100px]">
              <div className="w-full grid grid-cols-2">
                <ManagerTicketPeriodStatus />
                <MonthlyTicketStatus />
              </div>
              <MonthCategoryTicketStatus />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
