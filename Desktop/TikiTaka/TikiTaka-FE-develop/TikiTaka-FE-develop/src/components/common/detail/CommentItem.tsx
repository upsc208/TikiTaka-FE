import {useState} from 'react';
import Profile from '../Profile';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {deleteTicketComment, updateTicketComment} from '../../../api/service/tickets';
import {useParams} from 'react-router-dom';
import Modal from '../Modal';
import DOMPurify from 'dompurify';
import {useUserStore} from '../../../store/store';

interface CommentItemProps {
  commentId: number;
  authorId: number;
  name: string;
  content: string;
  files?: Attachment[];
  createdAt: string;
}

export default function CommentItem({commentId, authorId, name, content, files, createdAt}: CommentItemProps) {
  const {userId} = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hoveredFileIndex, setHoveredFileIndex] = useState<number | null>(null); // 각 파일에 대한 hover 상태 관리

  const {id} = useParams();
  const ticketId = Number(id);

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: () => updateTicketComment(ticketId, commentId, editedContent),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['ticketComments', ticketId]});
      setIsEditing(false);
    },
    onError: () => {
      alert('댓글 수정에 실패했습니다. 다시 시도해 주세요.');
      setIsEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTicketComment(ticketId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['ticketComments', ticketId]});
    },
    onError: () => {
      alert('댓글 삭제에 실패했습니다. 다시 시도해 주세요.');
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    updateMutation.mutate();
  };

  const handleCancel = () => {
    setEditedContent(content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate();
    setShowDeleteModal(false);
  };

  return (
    <div className="flex gap-3 mt-10">
      <Profile userId={authorId} size="md" />
      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <p className="text-gray-16 text-body-bold">{name}</p>
          <div className="w-full flex justify-between text-body-regular">
            <div className="flex gap-2 text-gray-8 ">
              {authorId === userId && (
                <>
                  {isEditing ? (
                    <>
                      <button className="hover:text-gray-15" onClick={handleSave}>
                        저장
                      </button>
                      <button className="hover:text-gray-15" onClick={handleCancel}>
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="hover:text-gray-15" onClick={handleEdit}>
                        수정
                      </button>
                      <button className="hover:text-gray-15" onClick={handleDelete}>
                        삭제
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
            <p className="text-caption-regular">{createdAt}</p>
          </div>
        </div>
        {isEditing ? (
          <textarea
            className="comment-textarea"
            value={editedContent}
            onChange={(e) => setEditedContent(DOMPurify.sanitize(e.target.value))}
          />
        ) : (
          <p className="text-subtitle-regular">{content}</p>
        )}
        {/* 첨부 파일 */}
        {files && files?.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => setHoveredFileIndex(index)}
                onMouseLeave={() => setHoveredFileIndex(null)}
              >
                {file.filePath.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                  <>
                    <img
                      src={file.filePath}
                      alt={file.fileName}
                      className="w-24 h-24 object-cover rounded cursor-pointer"
                      onClick={() => window.open(file.filePath, '_blank')}
                    />
                    {hoveredFileIndex === index && (
                      <div className="absolute left-0 top-full mt-2 tooltip w-max">첨부된 이미지를 클릭하여 다운로드 가능합니다.</div>
                    )}
                  </>
                ) : (
                  <a href={file.filePath} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {file.fileName}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {showDeleteModal && (
        <Modal
          title="해당 댓글을 삭제하시겠습니까?"
          backBtn="취소"
          onBackBtnClick={() => setShowDeleteModal(false)}
          checkBtn="삭제"
          onBtnClick={confirmDelete}
        />
      )}
    </div>
  );
}
