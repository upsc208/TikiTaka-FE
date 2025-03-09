import {useState} from 'react';
import ManagerItem from './ManagerItem';

// 담당자 임시 데이터
const managerData = [
  {
    name: 'Alex',
    email: 'alex@gmail.com',
    processing: 1000,
    completed: 1000,
    duration: '12hour',
  },
  {
    name: 'Jojo',
    email: 'jojo@gmail.com',
    processing: 500,
    completed: 800,
    duration: '12hour',
  },
  {
    name: 'Hoho',
    email: 'hoho@gmail.com',
    processing: 500,
    completed: 800,
    duration: '12hour',
  },
  {
    name: 'Mimi',
    email: 'mimi@gmail.com',
    processing: 400,
    completed: 700,
    duration: '10hour',
  },
  {
    name: 'Nana',
    email: 'nana@gmail.com',
    processing: 200,
    completed: 300,
    duration: '8hour',
  },
  {
    name: 'Lulu',
    email: 'lulu@gmail.com',
    processing: 350,
    completed: 450,
    duration: '9hour',
  },
];

export default function ManagerTicketStatus() {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(managerData.length / itemsPerPage);

  const goToPage = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  return (
    <div className="flex flex-col w-full h-[430px] bg-gray-18 p-5">
      <h1 className="text-title-bold">담당자별 티켓 처리 현황</h1>
      <div className="h-full relative flex flex-col items-center bg-white rounded border border-gray-2 p-10 mt-4 overflow-hidden">
        <div className="w-full overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              width: `${totalPages * 100}%`,
              transform: `translateX(-${(currentPage / totalPages) * 100}%)`,
            }}
          >
            {Array.from({length: totalPages}).map((_, pageIndex) => (
              <div key={pageIndex} className="flex w-full justify-between">
                {managerData.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage).map((manager, index) => (
                  <div key={index} className="w-1/3 flex-shrink-0 px-1">
                    <ManagerItem {...manager} />
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
