import {useEffect, useRef, useState} from 'react';
import {useNewTicketFormStore, useNewTicketStore} from '../../../store/store';
import {RequiredIcon} from '../Icon';
import MarkdownPreview from '../MarkdownPreview';
import {getTicketForm} from '../../../api/service/tickets';
import Modal from '../Modal';
import DOMPurify from 'dompurify';
import {useLimitedInput} from '../../../hooks/useInputLimit';

export default function NewTicketContent() {
  const {title, content, firstCategory, secondCategory, setTitle, setContent} = useNewTicketStore();
  const {description, mustDescription, setDescription, setMustDescription} = useNewTicketFormStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const titleInput = useLimitedInput({
    maxLength: 150,
    initialValue: title,
    onLimitExceed: () => alert('제목은 최대 150자까지 입력할 수 있습니다.'),
    onChange: (value) => setTitle(value),
  });

  const contentInput = useLimitedInput({
    maxLength: 5000,
    initialValue: content,
    onLimitExceed: () => alert('내용은 최대 5000자까지 입력할 수 있습니다.'),
    onChange: (value) => setContent(value),
  });

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  useEffect(() => {
    if (firstCategory?.id && secondCategory?.id) {
      const fetchRequestForm = async () => {
        try {
          const formData = await getTicketForm(firstCategory.id, secondCategory.id);
          if (formData.mustDescription !== mustDescription) {
            setMustDescription(formData.mustDescription);
          }
          if (formData.description !== description) {
            setDescription(formData.description);
          }
        } catch (error) {
          console.error('티켓 폼 조회 실패:', error);
        }
      };
      fetchRequestForm();
    }
  }, [firstCategory?.id, secondCategory?.id]);

  const prevDescriptions = useRef({mustDescription, description});

  useEffect(() => {
    if (
      firstCategory?.id &&
      secondCategory?.id &&
      (prevDescriptions.current.mustDescription !== mustDescription || prevDescriptions.current.description !== description)
    ) {
      setIsModalOpen(true);
      prevDescriptions.current = {mustDescription, description};
    }
  }, [mustDescription, description]);

  const onOverwrite = () => {
    if (description) {
      setContent('');
      setContent(description);
    }
    setIsModalOpen(false);
  };

  const onCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex gap-10 items-center">
        <div className="flex items-center gap-1">
          요청 제목 <RequiredIcon />
        </div>
        <input
          type="text"
          value={titleInput.value}
          onChange={(e) => {
            const sanitizedValue = DOMPurify.sanitize(e.target.value);
            titleInput.setValue(sanitizedValue);
            setTitle(sanitizedValue);
          }}
          className={`w-[660px] text-subtitle-regular border bg-white py-2 px-4 border-gray-2 focus:border-main`}
          placeholder="요청 사항에 대한 제목을 입력해주세요"
        />
      </div>

      <div className="flex gap-10 items-center">
        <div className="flex items-center gap-1">
          요청 내용 <RequiredIcon />
        </div>
        <textarea
          rows={5}
          ref={textareaRef}
          value={contentInput.value}
          onChange={(e) => {
            const sanitizedValue = DOMPurify.sanitize(e.target.value);
            contentInput.setValue(sanitizedValue);
            setContent(sanitizedValue);
          }}
          className={`w-[800px] min-h-48 text-subtitle-regular border bg-white py-2 px-4 resize-none border-gray-2 focus:border-main`}
          placeholder={`요청 내용을 자세히 입력해주세요. \nMarkdown 문법을 지원합니다. \n 예: # 제목, **강조**, - 리스트, [링크](https://example.com)**`}
        />
      </div>

      {/* 마크다운 미리보기 */}
      <div className="flex w-[800px] ml-[97px] mt-4 p-4 border border-gray-3 bg-gray-1 overflow-x-auto">
        {content ? <MarkdownPreview content={content} /> : <div className="text-center text-gray-6">요청 내용 미리보기 화면</div>}{' '}
      </div>

      {isModalOpen && (
        <Modal
          title="요청 양식 제공"
          content={`2차 카테고리에 따른 요청 양식이 적용됩니다. \n 기존 내용에 덮어쓰시겠습니까?`}
          backBtn="취소"
          onBackBtnClick={onCancel}
          checkBtn="확인"
          onBtnClick={onOverwrite}
        />
      )}
    </>
  );
}
