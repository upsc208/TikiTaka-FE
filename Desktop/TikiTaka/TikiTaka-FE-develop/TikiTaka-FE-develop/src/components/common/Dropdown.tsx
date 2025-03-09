import {useEffect, useRef, useState} from 'react';
import {useOutsideClick} from '../../hooks/useOutsideClick';

interface DropdownProps {
  width?: string; // width 값 
  label: string; // 드롭다운 버튼에 표시될 텍스트
  options: string[]; // 드롭다운 메뉴 항목
  onSelect: (value: string) => void; // 선택 시 호출되는 함수
  value?: string; // 현재 선택된 값
  defaultSelected?: string; // 기본 선택된 값
  paddingX?: string; // 좌우 여백 
  border?: boolean; // 테두리 여부
  textColor?: string; // 텍스트 색상 
  backgroundColor?: string; // 배경 색상 
  disabled?: boolean; // 비활성화 여부
}

export default function DropDown({
  width,
  label,
  options,
  onSelect,
  value,
  defaultSelected = label,
  paddingX = 'px-4',
  border = true,
  backgroundColor = '',
  textColor = 'text-gray-900',
  disabled = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(value || defaultSelected);
  const [maxWidth, setMaxWidth] = useState(0);
  const optionsRef = useRef<HTMLDivElement[]>([]); // 타입 명시

  const dropdownRef = useOutsideClick(() => setIsOpen(false));

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect(value);
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      const widths = optionsRef.current.map((option) => option.getBoundingClientRect().width);
      setMaxWidth(Math.max(...widths));
    }
  }, [isOpen]);

  useEffect(() => {
    setSelected(value ?? defaultSelected);
  }, [value, defaultSelected]);

  return (
    <div className="relative inline-block " ref={dropdownRef}>
      {/* 드롭다운 버튼 */}
      <button
        className={`${border ? 'border border-gray-6' : 'border-none'} 
        ${width ? width : ''}
        ${value ? textColor : 'text-gray-6'} 
        ${backgroundColor}
        rounded-md py-0.5 ${paddingX} text-body-regular flex items-center gap-3 
        ${disabled ? 'bg-gray-1 text-gray-3 cursor-not-allowed' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className={`flex items-center truncate`}>{selected || label}</span>
        <svg
          className={`w-4 h-4 transform transition-transform ml-auto ${isOpen ? 'rotate-180' : 'rotate-0'}`}
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
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div style={{minWidth: maxWidth}} className="absolute mt-1 bg-white border border-gray-3 rounded-md shadow-lg z-10 ">
          {options.map((option, index) => (
            <div
              key={option}
              ref={(el) => {
                if (el) optionsRef.current[index] = el; // null 체크 추가
              }}
              className={`px-4 py-1.5 text-center cursor-pointer leading-none m-2 whitespace-nowrap
                ${
                  selected === option
                    ? 'bg-gray-1 text-caption-bold rounded-md mx-2 border border-gray-2 text-gray-9'
                    : 'text-gray-7 text-caption-regular hover:bg-gray-1 rounded-md'
                }`}
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
