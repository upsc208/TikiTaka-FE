import React, {useState} from 'react';
import Modal from '../Modal';

interface Attachment {
  attachmentId: number;
  fileName: string;
  filePath: string;
}

interface AttachmentItemProps {
  attachment: Attachment;
  onDelete: (fileId: number) => void;
  isOwn: boolean;
}

const AttachmentItem: React.FC<AttachmentItemProps> = ({attachment, onDelete, isOwn}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isImage = attachment.filePath.match(/\.(jpeg|jpg|gif|png)$/i);

  const handleDelete = () => {
    onDelete(attachment.attachmentId);
    setShowDeleteModal(false);
  };

  return (
    <div className="relative m-2">
      {isImage ? (
        <div className="flex flex-col gap-1">
          <img
            src={attachment.filePath}
            alt={attachment.fileName}
            className="w-24 h-24 object-cover cursor-pointer rounded"
            onClick={() => window.open(attachment.filePath, '_blank')}
          />
          {isOwn && (
            <button onClick={() => setShowDeleteModal(true)} className="items-end text-red text-[10px] font-regular hover:font-bold">
              삭제
            </button>
          )}
        </div>
      ) : (
        <p>
          첨부된 파일입니다.{' '}
          <a href={attachment.filePath} target="_blank" rel="noopener noreferrer">
            다운로드
          </a>
        </p>
      )}

      {showDeleteModal && (
        <Modal
          title="이 첨부파일을 삭제하시겠습니까?"
          backBtn="취소"
          onBackBtnClick={() => setShowDeleteModal(false)}
          checkBtn="삭제"
          onBtnClick={handleDelete}
        />
      )}
    </div>
  );
};

export default AttachmentItem;
