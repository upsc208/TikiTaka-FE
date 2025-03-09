import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getTicketStatusCount } from '../../../api/service/tickets';
import { useUserStore } from '../../../store/store';

interface TicketFilterProps {
  onFilterChange: (type: string) => void;
  onCountUpdate: (counts: TicketStatusCount) => void;
}

export default function DashTicketFilter({onFilterChange, onCountUpdate}: TicketFilterProps) {
  const role = useUserStore((state) => state.role);
  const [selectedType, setSelectedType] = useState<string>('전체');
  const [indicatorStyle, setIndicatorStyle] = useState({left: 0, width: 0});
  const containerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: ticketCounts } = useQuery({
    queryKey: ["ticketStatusCounts"],
    queryFn: () => getTicketStatusCount(), 
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (ticketCounts) {
      onCountUpdate(ticketCounts);
    }
  }, [ticketCounts, onCountUpdate]);

  const filteredTicketData = useMemo(() => {
    if (!ticketCounts) return [];

    const baseData = [
      {type: '전체', count: ticketCounts.total},
      {type: '대기중', count: ticketCounts.pending},
      {type: '진행중', count: ticketCounts.inProgress},
      {type: '검토 요청', count: ticketCounts.reviewing},
      {type: '완료', count: ticketCounts.completed},
      {type: '긴급', count: ticketCounts.urgent},
    ];

    return role === 'USER' ? baseData.filter((item) => ['전체', '대기중', '진행중', '완료', '긴급'].includes(item.type)) : baseData;
  }, [ticketCounts, role]);

  useEffect(() => {
    if (containerRef.current) {
      const items = containerRef.current.querySelectorAll<HTMLDivElement>('.filter-item');
      const selectedIndex = filteredTicketData.findIndex((item) => item.type === selectedType);
      if (items[selectedIndex]) {
        const selectedItem = items[selectedIndex];
        setIndicatorStyle({
          left: selectedItem.offsetLeft,
          width: selectedItem.clientWidth,
        });
      }
    }
  }, [selectedType, filteredTicketData]);

  const refreshTicketCounts = () => {
    queryClient.invalidateQueries({queryKey: ['ticketStatusCounts']});
  };

  return (
    <div className="w-full mt-10 relative">
      <div className="flex w-full h-8 gap-6 items-center" ref={containerRef}>
        {filteredTicketData.map((item) => (
          <div
            key={item.type}
            className={`filter-item cursor-pointer flex gap-2 items-center ${
              selectedType === item.type ? 'text-gray-900 font-bold' : 'text-gray-500'
            }`}
            onClick={() => {
              setSelectedType(item.type);
              onFilterChange(item.type);
              refreshTicketCounts();
            }}
          >
            <div
              className={`${
                item.type === '긴급'
                  ? selectedType === '긴급'
                    ? 'text-error text-title-bold '
                    : 'text-error/80 text-title-bold'
                  : selectedType === item.type
                    ? 'text-main text-title-bold'
                    : 'text-gray-7 text-title-bold'
              } flex items-center` }
            >
              {item.type}
            </div>
            <div
              className={`px-4 h-4 flex items-center rounded-full ${
                item.type === '긴급'
                  ? selectedType === '긴급'
                    ? 'bg-error'
                    : 'bg-error/80'
                  : selectedType === item.type
                    ? 'bg-main text-title-bold'
                    : 'bg-gray-500 text-title-bold'
              } text-white `}
            >
              <span className="text-caption-bold">{item.count}</span>
            </div>
          </div>
        ))}
      </div>
      <div
        className="absolute bottom-0 h-0.5 bg-main transition-all duration-300"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
        }}
      />
    </div>
  );
}
