import {useEffect, useRef, useState} from 'react';
import {useUserStore} from '../../../../store/store';
import {useQuery} from '@tanstack/react-query';
import {getPendingApprovalCount} from '../../../../api/service/tickets';

// 개별 필터 아이템 컴포넌트
function FilterItem({type, count, isSelected, onClick}: {type: string; count: number; isSelected: boolean; onClick: () => void}) {
  // 텍스트 색상
  const textColor = isSelected
    ? 'text-black text-title-bold' // 선택된 상태는 검은색 텍스트
    : 'text-gray-6 text-title-bold'; // 선택되지 않은 상태는 흐린 회색 텍스트

  // 배경색
  const bgColor = isSelected
    ? 'bg-gray-9' // 선택된 상태는 진한 회색 배경
    : 'bg-gray-6'; // 선택되지 않은 상태는 흐린 회색 배경

  return (
    <div className={`flex items-center gap-2 cursor-pointer`} onClick={onClick}>
      {/* 텍스트 */}
      <span className={textColor}>{type}</span>
      {/* Count */}
      <div className={`px-4 h-[16px] flex place-items-center rounded-full ${bgColor} text-white`}>
        <div className="text-caption-bold">{count}</div>
      </div>
    </div>
  );
}

interface PendingTicketFilterProps {
  selectedFilter: '전체' | '나의 티켓';
  onFilterChange: (filter: '전체' | '나의 티켓') => void;
}

// 전체 필터 컴포넌트
export default function PendingTicketFilter({selectedFilter, onFilterChange}: PendingTicketFilterProps) {
  const [selectedType, setSelectedType] = useState('전체');
  const [indicatorStyle, setIndicatorStyle] = useState({left: 0, width: 0});
  const containerRef = useRef<HTMLDivElement>(null);

  const {userId} = useUserStore();

  //티켓 수 조회
  const {data: pendingApprovalCount} = useQuery({
    queryKey: ['pendingTicketCount', userId],
    queryFn: () => getPendingApprovalCount(userId),
    refetchInterval: 60000, // 1분마다 자동으로 데이터 갱신 (필요에 따라 조정)
  });

  // 티켓 데이터 상태
  const [ticketData, setTicketData] = useState([
    {type: '전체', count: 0},
    {type: '나의 티켓', count: 0},
  ]);

  // pendingTicketCount 데이터가 변경될 때마다 ticketData 업데이트
  useEffect(() => {
    if (pendingApprovalCount) {
      setTicketData([
        {type: '전체', count: pendingApprovalCount?.allPendingTicket},
        {type: '나의 티켓', count: pendingApprovalCount?.myPendingTicket},
      ]);
    }
  }, [pendingApprovalCount]);

  useEffect(() => {
    if (containerRef.current) {
      const items = containerRef.current.querySelectorAll<HTMLDivElement>('.filter-item');
      const selectedIndex = ticketData.findIndex((item) => item.type === selectedType);
      if (items[selectedIndex]) {
        const selectedItem = items[selectedIndex];
        setIndicatorStyle({
          left: selectedItem.offsetLeft,
          width: selectedItem.clientWidth,
        });
      }
    }
  }, [selectedType]);

  return (
    <div className="w-full mt-10 relative flex items-center justify-between">
      <div>
        {/* 필터 리스트 */}
        <div className="flex w-full h-6 px-4 gap-6" ref={containerRef}>
          {ticketData.map((item) => (
            <div key={item.type} className="filter-item">
              <FilterItem
                type={item.type}
                count={item.count}
                isSelected={item.type === selectedFilter}
                onClick={() => {
                  setSelectedType(item.type as '전체' | '나의 티켓');
                  onFilterChange(item.type as '전체' | '나의 티켓');
                }}
              />
            </div>
          ))}
        </div>
        {/* 이동하는 하단 Border */}
        <div
          className="absolute bottom-0 h-0.5 bg-gray-7 transition-all duration-300"
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
          }}
        />
      </div>
    </div>
  );
}
