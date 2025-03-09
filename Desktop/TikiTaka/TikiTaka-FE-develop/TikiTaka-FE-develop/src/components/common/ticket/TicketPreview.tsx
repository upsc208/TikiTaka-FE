import {useState} from 'react';
import {useNewTicketStore} from '../../../store/store';
import {AlertIcon, DownIcon} from '../Icon';
import {motion} from 'framer-motion';
import {formatTimeLeft} from '../../../utils/format';

export default function TicketPreview() {
  const {isUrgent, firstCategory, secondCategory, title, content, manager, ticketType, dueDate, dueTime} = useNewTicketStore();
  const [isOpen, setIsOpen] = useState(true);

  const formattedDate = dueDate ? `${formatTimeLeft(dueDate, dueTime)}` : '';

  const typeNameMapping: Record<string, string> = {
    CREATE: '생성',
    DELETE: '삭제',
    UPDATE: '수정',
    ETC: '기타',
  };

  return (
    <div className="preview">
      <div className="flex justify-between ">
        <p className="text-subtitle text-gray-15">티켓 미리보기</p>
        <button onClick={() => setIsOpen(!isOpen)} className={`cursor-pointer transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <DownIcon />
        </button>
      </div>
      {isOpen && (
        <motion.div
          className={`w-full bg-gray-1 border rounded p-2 flex justify-between text-subtitle-regular ${isUrgent ? 'border-error' : 'border-gray-2'}`}
          initial={{opacity: 0}}
          animate={{opacity: isOpen ? 1 : 0}}
          transition={{duration: 0.2}}
          style={{overflow: 'hidden'}}
        >
          <div className="flex gap-8 items-center">
            <p className="text-main">#No.</p>
            <div className="flex flex-col w-32">
              <p className={`${firstCategory ? '' : 'text-gray-4'}`}>{firstCategory?.name || '1차 카테고리 미지정'}</p>
              <p className={`text-body-regular ${secondCategory ? 'text-gray-6' : 'text-gray-4'}`}>
                {secondCategory?.name || '2차 카테고리 미지정'}
              </p>
            </div>
            <div className="flex flex-col w-80">
              <div className="flex items-center gap-1">
                <p>{isUrgent && <AlertIcon className="text-error w-4 h-4" />}</p>
                <p className={`${ticketType.typeId !== 0 ? '' : 'text-blue'}`}>[{typeNameMapping[ticketType.typeName] || '유형'}]</p>
                <p className={`${title ? '' : 'text-blue'} truncate`}>{title || '제목을 작성해주세요'}</p>
              </div>
              <p className={`text-body-regular ${content ? 'text-gray-6' : 'text-blue'} truncate`}>{content || '내용을 작성해주세요'}</p>
            </div>
          </div>
          <div className="flex gap-8 items-center">
            <p className={`${formattedDate ? '' : 'text-blue'}`}>{formattedDate || '-'}</p>
            <div className="bg-white border border-gray-2 py-1 px-4 my-2 rounded items-center">{manager?.username || 'all'}</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
