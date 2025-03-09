// AttachmentList.tsx
import React from 'react';
import AttachmentItem from './AttachmentItem';

interface AttachmentListProps {
  attachments: Attachment[];
  onDeleteAttachment: (fileId: number) => void;
  isOwn: boolean;
}

const AttachmentList: React.FC<AttachmentListProps> = ({attachments, onDeleteAttachment, isOwn}) => {
  return (
    <div className="flex flex-wrap">
      {attachments.map((attachment) => (
        <AttachmentItem key={attachment.attachmentId} attachment={attachment} onDelete={onDeleteAttachment} isOwn={isOwn} />
      ))}
    </div>
  );
};

export default AttachmentList;
