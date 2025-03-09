import { useState } from "react";

interface DropdownProps {
  label: string;
  options: string[];
  onSelect: (value: string) => void;
  value?: string;
}

export default function DropDown({ label, options, onSelect, value }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(value || label);

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block w-[100px] whitespace-nowrap">
      <div
        className="text-gray-700 text-subtitle-regular flex items-center gap-x-2 cursor-pointer w-full py-1 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selected}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {isOpen && (
        <div className="absolute mt-1  bg-white border border-gray-3 rounded-md shadow-lg z-10 w-full">
          {options.map((option) => (
            <div
              key={option}
              className={`px-4 py-1.5 text-center cursor-pointer leading-none m-2 ${
                selected === option
                  ? 'bg-gray-1 text-caption-bold rounded-md mx-2 border border-gray-2 text-gray-15'
                  : 'text-gray-700 text-caption-regular hover:bg-gray-1 rounded-md'
              } `}
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
