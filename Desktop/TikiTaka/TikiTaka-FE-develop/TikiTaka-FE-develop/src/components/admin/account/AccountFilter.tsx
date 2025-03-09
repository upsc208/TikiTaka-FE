import { useEffect, useRef, useState } from "react";

type AccountViewType = "승인 대기" | "계정 목록";

const statFilters: { type: AccountViewType }[] = [
  { type: "승인 대기" },
  { type: "계정 목록" },
];

export default function AccountFilter({ onFilterChange }: { onFilterChange: (type: AccountViewType) => void }) {
  const [selectedFilter, setSelectedFilter] = useState<AccountViewType>("승인 대기");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
     if (containerRef.current) {
       const items = containerRef.current.querySelectorAll<HTMLDivElement>(".filter-item");
       const selectedIndex = statFilters.findIndex((item) => item.type === selectedFilter);
       if (items[selectedIndex]) {
         const selectedItem = items[selectedIndex];
         setIndicatorStyle({
           left: selectedItem.offsetLeft,
           width: selectedItem.clientWidth,
         });
       }
     }
   }, [selectedFilter]);

  return (
    <div className="relative w-full mt-6">
      <div className="flex w-full h-6  gap-6 relative" ref={containerRef}>
        {statFilters.map((item) => (
          <div
            key={item.type}
            className="filter-item cursor-pointer text-title-bold relative"
            onClick={() => {
              setSelectedFilter(item.type);
              onFilterChange(item.type);
            }}
          >
            <span className={selectedFilter === item.type ? "text-main" : "text-gray-6"}>{item.type}</span>
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
