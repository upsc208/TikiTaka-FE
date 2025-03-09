import { motion } from 'framer-motion';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  backBtn?: string;
  onBackBtnClick: () => void;
  checkBtn?: string;
  onBtnClick?: () => void;
}

export default function ConfirmModal({ isOpen,  message, backBtn, onBackBtnClick, checkBtn, onBtnClick, }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div className="overlay" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
      <div className="w-full max-w-[500px] flex flex-col gap-6 bg-white p-10 rounded shadow-1 border border-gray-2">
        <p className="text-lg font-semibold text-gray-800">{message}</p>
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
    </motion.div>
  );
}
