import {useEffect, useRef, useState} from 'react';

// 필터 항목 데이터 변경 (일별/월별로 변경, count 제거)
const filterData = [{type: '일별'}, {type: '월별'}];

// FilterItem 컴포넌트에서 count 관련 코드 제거
function FilterItem({type, isSelected, onClick}: {type: string; isSelected: boolean; onClick: () => void}) {
  const textColor = isSelected ? 'text-black text-title-bold' : 'text-gray-6 text-title-bold';

  return (
    <div className={`flex items-center gap-2 cursor-pointer`} onClick={onClick}>
      <span className={textColor}>{type}</span>
    </div>
  );
}

interface TicketFilterProps {
  onFilterChange: (type: string) => void;
}
export default function StatFilter({onFilterChange}: TicketFilterProps) {
  const [selectedType, setSelectedType] = useState('일별'); // 초기값 일별로 변경
  const [indicatorStyle, setIndicatorStyle] = useState({left: 0, width: 0});
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFilterChange = (type: string) => {
    setSelectedType(type);
    onFilterChange(type);
  };

  useEffect(() => {
    if (containerRef.current) {
      const items = containerRef.current.querySelectorAll<HTMLDivElement>('.filter-item');
      const selectedIndex = filterData.findIndex((item) => item.type === selectedType);
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
    <div className="w-full mt-10 relative">
      <div className="flex w-full h-6 px-4 gap-6" ref={containerRef}>
        {filterData.map((item) => (
          <div key={item.type} className="filter-item">
            <FilterItem type={item.type} isSelected={item.type === selectedType} onClick={() => handleFilterChange(item.type)} />
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
