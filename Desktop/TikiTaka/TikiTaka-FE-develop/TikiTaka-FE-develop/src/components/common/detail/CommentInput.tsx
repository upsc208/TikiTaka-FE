import {useRef, useState} from 'react';
import Profile from '../Profile';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {createTicketComment} from '../../../api/service/tickets';
import {useParams} from 'react-router-dom';
import {useUserStore} from '../../../store/store';
import DOMPurify from 'dompurify';
import {MAX_FILE_SIZE, MAX_FILES} from '../../../constants/constants';
import {useLimitedInput} from '../../../hooks/useInputLimit';

export default function CommentInput() {
  const [content, setContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {userId} = useUserStore();

  const {id} = useParams();
  const ticketId = Number(id);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return createTicketComment(ticketId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['ticketComments', ticketId]});
      setContent(''); // 내용 초기화
      setFiles([]);
      setFileNames([]);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const jsonData = {content: content.slice(0, 1000)};
    const formData = new FormData();

    // JSON 데이터를 Blob으로 변환하여 추가
    const jsonBlob = new Blob([JSON.stringify(jsonData)], {type: 'application/json'});
    formData.append('request', jsonBlob);

    files.forEach((file) => {
      formData.append('files', file);
    });

    mutation.mutate(formData);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);

    const totalFiles = files.length + selectedFiles.length;
    if (totalFiles > MAX_FILES) {
      alert(`최대 ${MAX_FILES}개의 파일만 선택할 수 있습니다.`);
      return;
    }

    const validFiles = selectedFiles.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name} 파일 크기가 10MB를 초과했습니다.`);
        return false;
      }
      return true;
    });

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    setFileNames((prevFileNames) => [
      ...prevFileNames,
      ...validFiles.map((file) => `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`),
    ]);
  };

  const handleFileRemove = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setFileNames((prevFileNames) => prevFileNames.filter((_, i) => i !== index));
  };

  const contentInput = useLimitedInput({
    maxLength: 1000,
    initialValue: content,
    onLimitExceed: () => alert('내용은 최대 1000자까지 입력할 수 있습니다.'),
    onChange: (value) => setContent(value),
  });

  return (
    <form onSubmit={handleSubmit} className="mt-5">
      <div className="relative mt-3">
        <div className="flex gap-2 mb-2">
          <Profile userId={userId} size="md" />
          <textarea
            ref={textareaRef}
            className="comment-textarea"
            placeholder="댓글 추가"
            value={contentInput.value}
            onChange={(e) => {
              const sanitizedValue = DOMPurify.sanitize(e.target.value);
              contentInput.setValue(sanitizedValue);
              setContent(sanitizedValue);
            }}
            style={{resize: 'none'}}
          />
        </div>
        <button type="submit" className="absolute right-0 main-btn" disabled={mutation.isPending}>
          {mutation.isPending ? '저장 중...' : '저장'}
        </button>
        <div className="flex flex-col w-full gap-3 items-start">
          <div className="flex gap-4 items-center ml-8">
            <button
              type="button"
              className="rounded-md py-1 px-6 text-caption-regular border border-main hover:bg-main hover:text-white"
              onClick={() => fileInputRef.current?.click()}
            >
              댓글 첨부파일 첨부
            </button>
            {files.length > 4 && (
              <div className="bg-gray-1 border border-gray-2 rounded-md py-1 px-4 text-[10px] text-error shadow-md">
                최대 5개의 파일만 선택할 수 있습니다.
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 ml-8">
            {fileNames.map((name, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="border border-gray-2 text-caption-regular bg-white px-2 py-1 rounded w-[400px] truncate">{name}</span>
                <button
                  type="button"
                  className="text-error text-[10px] font-regular hover:font-bold"
                  onClick={() => handleFileRemove(index)}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            multiple
            ref={fileInputRef}
            style={{display: 'none'}}
            onChange={handleFileChange}
          />
        </div>
      </div>
    </form>
  );
}
