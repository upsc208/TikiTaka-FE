import {useOutsideClick} from '../../hooks/useOutsideClick';
import Portal from './Portal';
import {motion} from 'framer-motion';

interface ModalProps {
  title?: string;
  content?: string;
  warningContent?: string;
  backBtn?: string;
  onBackBtnClick: () => void;
  checkBtn?: string;
  onBtnClick?: () => void;
  children?: React.ReactNode; 
  blockOutsideClick?: boolean;
}

export default function Modal({title, content, warningContent, backBtn, onBackBtnClick, checkBtn, onBtnClick, children, blockOutsideClick}: ModalProps) {
  const ref = !blockOutsideClick ? useOutsideClick(onBackBtnClick) : null;

  return (
    <Portal>
      <motion.div className="overlay" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
        {/* <div className="absolute w-full h-full  flex-center"> */}
        <div ref={ref} className="w-full max-w-[500px] flex flex-col gap-6 bg-white p-10 rounded shadow-1 border border-gray-2">
          <div>
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="flex flex-col gap-2 text-center">
                <span className={`whitespace-pre-wrap text-black text-title-bold `}>{title}</span>
                <span className={`whitespace-pre-wrap text-error text-sm font-bold text-center`}>{warningContent}</span>
                <span className={`whitespace-pre-wrap text-sm text-main font-regular `}>{content}</span>
              </div>
            </div>
            {children}
          </div>
          <div className="flex gap-4">
            <button onClick={onBackBtnClick} className="btn-back w-full">
              {backBtn || '취소'}
            </button>
            {checkBtn && (
              <button onClick={onBtnClick} className="btn-check w-full">
                {checkBtn || '확인'}
              </button>
            )}
          </div>
        </div>
        {/* </div> */}
      </motion.div>
    </Portal>
  );
}
