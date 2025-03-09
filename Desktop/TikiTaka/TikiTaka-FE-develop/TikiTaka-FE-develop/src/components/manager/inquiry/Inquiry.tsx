import {useState} from 'react';
import {InquiryData} from '../../../interfaces/interfaces';
import {DownIcon} from '../../common/Icon';

interface InquiryProps {
  data: InquiryData;
}

export default function Inquiry({data}: InquiryProps) {
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);

  const toggleAnswerVisibility = () => {
    setIsAnswerVisible((prev) => !prev);
  };

  const getStatusText = (status: boolean) => (status ? '답변 완료' : '답변 대기');

  return (
    <div className="flex flex-col gap-2">
      <section className="flex w-full p-5 rounded bg-white border border-gray-2 text-subtitle-regular hover:bg-gray-1">
        <p className="mr-[59px]">{data.type === 'QUESTION' ? '질문' : '요청'}</p>
        <div>
          <p className="w-[450px]">{data.title}</p>
          <p className="w-[450px] text-gray-6 text-body-regular mt-1 mr-[120px]">{data.content}</p>
        </div>
        <p className="text-body-regular mr-[70px]">{data.createdAt.split(' ')[0]}</p>
        <div className="relative flex gap-2">
          <p>{getStatusText(data.status)}</p>

          {data.status && (
            <div
              className="absolute top-0 left-16"
              style={{
                color: 'black',
                transform: isAnswerVisible ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
              onClick={toggleAnswerVisibility}
            >
              <DownIcon />
            </div>
          )}
        </div>
      </section>

      {isAnswerVisible && data.answer && (
        <section className="flex w-full p-5 rounded bg-gray-1 border border-gray-2 text-subtitle-regular">
          <p className="mr-[30px]">문의 답변</p>
          <div>
            <p> Re: {data.title}</p>
            <p className="w-[600px] text-gray-6 text-body-regular mt-1 mr-[120px]">{data.answer}</p>
          </div>
        </section>
      )}
    </div>
  );
}
