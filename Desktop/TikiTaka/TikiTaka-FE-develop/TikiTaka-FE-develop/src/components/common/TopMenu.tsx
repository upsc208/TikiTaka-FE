import {Link} from 'react-router-dom';
import {LinkIcon} from './Icon';
import useLimitByteLength from '../../hooks/useLimitByteLength';
export interface TopMenuProps {
  boldBlackText?: string; // 좌측 요소 (검정색 bold)
  boldGrayText?: string; // 좌측 요소 (gray-12 bold)
  boldSmText?: string; // 좌측 요소 (gray-12 10px bold)
  regularText?: string; // 좌측 요소 (gray-12 regular)
  btnText?: string; // 좌측 요소
  onBtnClick?: () => void;
  rightText?: string;
  linkTo?: string;
  onClick?: () => void;
}

export default function TopMenu({
  boldBlackText,
  boldGrayText,
  boldSmText,
  regularText,
  btnText,
  onBtnClick,
  rightText,
  linkTo,
  onClick,
}: TopMenuProps) {
  const limitedText = useLimitByteLength(regularText ?? '', 100);

  return (
    <div className="flex flex-col w-full gap-3 mt-6 whitespace-nowrap">
      <div className="flex justify-between w-full h-8 px-4 items-center ">
        {/* 메뉴 좌측 요소 */}
        <div className="flex gap-4 text-title-bold text-gray-12 items-center">
          {/* 볼드 폰트 요소 */}
          {boldBlackText && <p className=" text-black">{boldBlackText}</p>}
          {boldGrayText && <p>{boldGrayText}</p>}
          {boldSmText && <p className="text-[12px] font-bold leading-7">{boldSmText}</p>}

          {/* 레귤러 폰트 요소 */}
          {regularText && <p className="text-subtitle-regular w-[1100px] overflow-hidden">{limitedText}</p>}
          {/* 버튼 */}
          {btnText && onBtnClick && (
            <button onClick={onBtnClick} className="h-full btn">
              {btnText}
            </button>
          )}
        </div>

        {/* 메뉴 우측 요소 */}
        {linkTo && rightText && (
          <Link to={linkTo} className="flex items-center gap-2 text-title-bold text-gray-12">
            {rightText}
            <LinkIcon />
          </Link>
        )}
        {onClick && rightText && (
          <div className="flex items-center gap-2 text-title-bold text-gray-12 cursor-pointer" onClick={onClick}>
            {rightText}
            <LinkIcon />
          </div>
        )}
      </div>
      {/* 구분선 */}
      <hr className="division" />
    </div>
  );
}
