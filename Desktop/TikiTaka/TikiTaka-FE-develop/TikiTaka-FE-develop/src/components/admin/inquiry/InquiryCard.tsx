interface InquiryCardProps {
  type: 'QUESTION' | 'REQUEST';
  title: string;
  content: string;
  createdAt: string;
  requesterName: string;
  status: boolean;
  onReplyClick: () => void;
}

export default function InquiryCard({type, title, content, createdAt, requesterName, status, onReplyClick}: InquiryCardProps) {
  return (
    <div className="flex gap-4 py-4 px-4 border border-gray-2 bg-white items-center rounded cursor-pointer hover:bg-gray-1">
      <div className="w-[10%] text-gray-700 text-subtitle-regular">{type === 'QUESTION' ? '질문' : '요청'}</div>
      <div className="w-[15%] text-gray-700 text-subtitle-regular truncate">{requesterName}</div>
      <div className="w-[35%] min-w-0 flex flex-col justify-center">
        <div className="text-gray-900 text-subtitle-regular ">{title}</div>
        <div className="text-gray-6 text-caption-regular ">{content}</div>
      </div>
      <div className="w-[20%] text-gray-15 text-body-regular">{createdAt.split(' ')[0]}</div>
      <div className="w-[20%]">
        <button
          className={`px-4 py-1 rounded text-white text-body-bold ${status ? 'bg-gray-400' : 'bg-main'} `}
          onClick={!status ? onReplyClick : undefined}
          disabled={status}
        >
          {status ? '답변 완료' : '답변 대기'}
        </button>
      </div>
    </div>
  );
}
