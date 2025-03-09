import {useEffect, useRef} from 'react';

export const useOutsideClick = (
  onClick: () => void,
  // hook 적용 예외 엘리먼트 지정
  targetRef?: React.RefObject<HTMLElement>
): React.RefObject<HTMLDivElement | null> => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node) && (!targetRef || !targetRef.current.contains(event.target as Node))) {
        onClick();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClick]);

  return ref;
};
