import {useEffect, useMemo, useRef, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {TicketViewType} from '../../../interfaces/ticket';
import {getTicketStatusCount} from '../../../api/service/tickets';
import { useUserStore } from '../../../store/store';

function FilterItem({type, count, isSelected, onClick}: {type: TicketViewType; count: number; isSelected: boolean; onClick: () => void}) {
  const textColor =
    type === '긴급'
      ? isSelected
        ? 'text-error text-title-bold'
        : 'text-error/85 text-title-bold'
      : isSelected
        ? 'text-black text-title-bold'
        : 'text-gray-6 text-title-bold';

  const bgColor = type === '긴급' ? (isSelected ? 'bg-error' : 'bg-error/85') : isSelected ? 'bg-gray-9' : 'bg-gray-6';

  return (
    <div className="flex gap-2 cursor-pointer" onClick={onClick}>
      <span className={textColor}>{type}</span>
      <div className={`px-4 h-[16px] flex place-items-center rounded-full ${bgColor} text-white`}>
        <div className="text-caption-bold h-full flex items-center">{count}</div>
      </div>
    </div>
  );
}

interface TicketFilterProps {
  onFilterChange: (type: TicketViewType) => void;
}

export default function UserTicketFilter({onFilterChange}: TicketFilterProps) {
  const [selectedType, setSelectedType] = useState<TicketViewType>('전체');
  const userId = useUserStore((state) => state.userId);
  const [indicatorStyle, setIndicatorStyle] = useState({left: 0, width: 0});
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: ticketCounts } = useQuery({
    queryKey: ["ticketStatusCounts", userId],
    queryFn: () => getTicketStatusCount(userId), 
    staleTime: 1000 * 60,
  });

  const filteredTicketData = useMemo(() => {
    if (!ticketCounts) return [];
    return [
      {type: '전체' as TicketViewType, count: ticketCounts.total || 0},
      {type: '대기중' as TicketViewType, count: ticketCounts.pending || 0},
      {type: '진행중' as TicketViewType, count: ticketCounts.inProgress || 0},
      {type: '검토 요청' as TicketViewType, count: ticketCounts.reviewing || 0},
      {type: '완료' as TicketViewType, count: ticketCounts.completed || 0},
      {type: '긴급' as TicketViewType, count: ticketCounts.urgent || 0},
    ].filter((item) => ['전체', '대기중', '진행중','검토 요청', '완료', '긴급'].includes(item.type));
  }, [ticketCounts]);

  useEffect(() => {
    if (containerRef.current) {
      const items = containerRef.current.querySelectorAll<HTMLDivElement>('.filter-item');
      const selectedIndex = filteredTicketData.findIndex((item) => item.type === selectedType);
      if (selectedIndex !== -1 && items[selectedIndex]) {
        const selectedItem = items[selectedIndex];
        setIndicatorStyle({
          left: selectedItem.offsetLeft,
          width: selectedItem.clientWidth,
        });
      }
    }
  }, [selectedType, filteredTicketData]);

  return (
    <div className="w-full mt-10 relative">
      <div className="flex w-full h-6 gap-6" ref={containerRef}>
        {filteredTicketData.map((item) => (
          <div key={item.type} className="filter-item">
            <FilterItem
              type={item.type}
              count={item.count}
              isSelected={item.type === selectedType}
              onClick={() => {
                setSelectedType(item.type);
                onFilterChange(item.type);
              }}
            />
          </div>
        ))}
      </div>
      <div
        className="absolute bottom-0 h-0.5 bg-gray-7 transition-all duration-300"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
        }}
      />
    </div>
  );
}
