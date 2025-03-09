import LoadingAnimation from './LoadingAnimation';

export default function LoadingStatus({textColor}: {textColor?: 'black' | 'white' | 'main'}) {
  return (
    <div className="w-full h-full flex items-center justify-center flex-col gap-6">
      <LoadingAnimation />
      <span
        className={`${textColor === 'main' ? '!text-main' : textColor === 'white' ? '!text-white' : '!text-black'} text-sm font-semibold`}
      >
        잠시만 기다려 주세요!
      </span>
    </div>
  );
}
