import {useState} from 'react';
import ManagerItem from './ManagerItem';
import {useQuery} from '@tanstack/react-query';
import {getMonthlyManagerTicketSummary} from '../../../../api/service/statistics';
import LoadingStatus from '../../../common/LoadingStatus';

interface ManagerData {
  userId: number;
  userName: string;
  userEmail: string;
  userProfile: string;
  totalManagingCreatedTicket: number;
}

export default function ManagerTicketPeriodStatus() {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  // 현재 날짜 가져오기
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const {
    data: managerData,
    isLoading,
    error,
  } = useQuery<ManagerData[], Error>({
    queryKey: ['monthlyManagerTicketSummary', currentYear, currentMonth],
    queryFn: () => getMonthlyManagerTicketSummary(currentYear, currentMonth),
  });

  if (isLoading) return <LoadingStatus/>;
  if (error) return <div>에러가 발생했습니다.</div>;

  const totalPages = Math.ceil((managerData?.length || 0) / itemsPerPage);

  const goToPage = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  return (
    <div className="flex flex-col w-full h-[430px] bg-gray-18 p-5 ">
      <h1 className="text-title-bold">담당자별 티켓 처리 현황</h1>
      <div className="h-full relative flex flex-col items-center bg-white rounded border border-gray-2 py-10 mt-4 overflow-hidden">
        <div className="w-full overflow-hidden mt-10">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              width: `${totalPages * 100}%`,
              transform: `translateX(-${(currentPage / totalPages) * 100}%)`,
            }}
          >
            {Array.from({length: totalPages}).map((_, pageIndex) => (
              <div key={pageIndex} className="flex w-full justify-start mx-4">
                {managerData &&
                  managerData.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage).map((manager) => (
                    <div key={manager.userId} className="w-1/3 px-1">
                      <ManagerItem
                        profile={manager.userProfile}
                        name={manager.userName}
                        email={manager.userEmail}
                        totalTickets={manager?.totalManagingCreatedTicket}
                      />
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>

        {/* 캐러셀 인디케이터 */}
        <div className="flex gap-2 mt-4">
          {Array.from({length: totalPages}).map((_, pageIndex) => (
            <button
              key={pageIndex}
              className={`w-2 h-2 rounded-full ${currentPage === pageIndex ? 'bg-main' : 'bg-gray-400'}`}
              onClick={() => goToPage(pageIndex)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
