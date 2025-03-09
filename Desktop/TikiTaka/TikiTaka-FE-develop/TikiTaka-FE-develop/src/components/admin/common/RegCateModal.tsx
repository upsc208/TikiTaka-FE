import Input from '../../common/Input';
import {XIcon} from '../../common/Icon';
import Portal from '../../common/Portal';
import {AnimatePresence, motion} from 'framer-motion';
import {useState} from 'react';
import { toast } from 'react-toastify';

interface ReqCateModalProps {
  onClose: () => void;
  onCreate: (categoryName: string) => void;
}

export default function ReqCateModal({onClose, onCreate}: ReqCateModalProps) {
  const [categoryName, setCategoryName] = useState(''); 
  const [loading, setLoading] = useState(false); 
  

  const onSubmit = async () => {
    if (!categoryName.trim()) {
      toast.error('카테고리 이름을 입력해주세요.');
      return;
    }
  
    try {
      setLoading(true);
      await onCreate(categoryName); 
      onClose(); 
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Portal>
      <AnimatePresence>
        <motion.div className="overlay" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
          <motion.div
            className="flex flex-col w-[460px] bg-white border border-gray-2 rounded px-5 py-5"
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{type: 'spring', damping: 25, stiffness: 500}}
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <h1 className="text-title-bold">카테고리 등록</h1>
                <p className="text-body-regular text-main mt-1">해당 부서의 카테고리를 추가합니다</p>
              </div>
              <button onClick={onClose}>
                <XIcon />
              </button>
            </div>
            <hr className="division my-[10px]" />
            <div className="w-full flex flex-col gap-[10px] mt-2">
              <Input
                label="1차 카테고리"
                element="input"
                size="sm"
                placeholder="1차 카테고리를 입력해주세요."
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>
            <div className="flex justify-center mt-5">
              <button className="w-fit main-btn" onClick={onSubmit} disabled={loading}>
                {loading ? '등록 중...' : '등록하기'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </Portal>
  );
}
