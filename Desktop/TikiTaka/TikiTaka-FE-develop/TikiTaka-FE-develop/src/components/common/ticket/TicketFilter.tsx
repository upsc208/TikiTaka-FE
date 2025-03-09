import { useEffect, useMemo, useRef, useState } from "react";
import { TicketViewType } from "../../../interfaces/ticket"; // 외부에서 TicketViewType 가져오기

const ticketData: { type: TicketViewType; count: number }[] = [
  { type: "전체", count: 1000 },
  { type: "대기중", count: 140 },
  { type: "진행중", count: 166 },
  { type: "완료", count: 32 },
  { type: "검토 요청", count: 53 },
  { type: "긴급", count: 10 },
];

function FilterItem({
  type,
  count,
  isSelected,
  onClick,
}: {
  type: TicketViewType;
  count: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const textColor = type === "긴급"
    ? isSelected ? "text-error text-title-bold" : "text-error/85 text-title-bold"
    : isSelected ? "text-black text-title-bold" : "text-gray-6 text-title-bold";

  const bgColor = type === "긴급"
    ? isSelected ? "bg-error" : "bg-error/85"
    : isSelected ? "bg-gray-9" : "bg-gray-6";

  return (
    <div className="flex gap-2 cursor-pointer" onClick={onClick}>
      <span className={textColor}>{type}</span>
      <div className={`px-4 h-[16px] flex place-items-center rounded-full ${bgColor} text-white mb-0.5`}>
        <div className="text-caption-bold h-full flex items-center">{count}</div>
      </div>
    </div>
  );
}

interface TicketFilterProps {
  role: "manager" | "user" | "admin";
  onFilterChange: (type: TicketViewType) => void; // 부모에게 필터 변경 전달
}

export default function TicketFilter({ role, onFilterChange }: TicketFilterProps) {
  const [selectedType, setSelectedType] = useState<TicketViewType>("전체");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredTicketData = useMemo(
    () => (role === "user" ? ticketData.filter((item) => ["전체", "대기중", "진행중", "완료", "긴급"].includes(item.type)) : ticketData),
    [role]
  );

  useEffect(() => {
    if (containerRef.current) {
      const items = containerRef.current.querySelectorAll<HTMLDivElement>(".filter-item");
      const selectedIndex = filteredTicketData.findIndex((item) => item.type === selectedType);
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