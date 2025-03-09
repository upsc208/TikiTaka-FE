import {useRef, useState} from 'react';
import {motion} from 'framer-motion';
import {CloseIcon, ListIcon, PlusIcon} from '../Icon';
import TemplateListView from './TemplateListView';
import TemplateDetailView from './TemplateDetailView';
import TemplateCreateView from './TemplateCreateView';

interface TemplateContainerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TemplateContainer({isOpen, onClose}: TemplateContainerProps) {
  const [activeView, setActiveView] = useState<'list' | 'detail' | 'create'>('list');
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);

  const minWidth = 400;
  const maxWidth = 1000;
  const widthRef = useRef(700);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const startX = e.clientX;
    const startWidth = widthRef.current;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      requestAnimationFrame(() => {
        const newWidth = startWidth + (startX - moveEvent.clientX);
        if (newWidth >= minWidth && newWidth <= maxWidth) {
          widthRef.current = newWidth;
          document.getElementById('template-container')!.style.width = `${newWidth}px`;
        }
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDelete = () => {
    setActiveView('list');
    setSelectedTemplateId(null);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      id="template-container"
      className="fixed top-14 right-0 h-full bg-white shadow-lg"
      initial={{width: 0}}
      animate={{width: widthRef.current}}
      exit={{width: 0}}
      transition={{duration: 0.3, ease: 'easeInOut'}}
      style={{width: widthRef.current}}
    >
      <div className="w-full flex min-h-screen justify-center">
        <div className="flex flex-col max-w-1200 py-4 gap-4">
          {/* 상단 버튼 */}
          <div className="flex w-full gap-3">
            <button onClick={onClose}>
              <CloseIcon />
            </button>
            <button onClick={() => setActiveView('create')}>
              <PlusIcon />
            </button>
            {activeView !== 'list' && (
              <button onClick={() => setActiveView('list')}>
                <ListIcon />
              </button>
            )}
          </div>
          {/* 뷰 전환 */}
          {activeView === 'list' && (
            <TemplateListView
              onSelect={(templateId: number) => {
                setSelectedTemplateId(templateId);
                setActiveView('detail');
              }}
            />
          )}
          {activeView === 'detail' && selectedTemplateId && <TemplateDetailView templateId={selectedTemplateId} onDelete={handleDelete} />}
          {activeView === 'create' && <TemplateCreateView onCancel={() => setActiveView('list')} />}
        </div>
      </div>
      {/* 사이즈 조절 */}
      <div
        className="absolute top-0 left-0 w-2 h-full cursor-ew-resize bg-white border-l border-transparent border-gray-1 hover:border-gray-4 transition-colors duration-300"
        onMouseDown={handleMouseDown}
      />
    </motion.div>
  );
}
