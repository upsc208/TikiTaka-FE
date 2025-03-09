import {useEffect, useRef} from 'react';
import {useTemplateStore} from '../../../store/store';
import {RequiredIcon} from '../Icon';
import DOMPurify from 'dompurify';
import {useLimitedInput} from '../../../hooks/useInputLimit';

export default function TemplateContent() {
  const {title, content, setTitle, setContent} = useTemplateStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  return (
    <>
      <div className="flex gap-[63px] items-center px-3 whitespace-nowrap">
        <div className="flex items-center gap-1 text-body-bold">
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
          className={`w-[400px] max-w-[600px] text-subtitle-regular border bg-white py-2 px-4 border-gray-2 focus:border-main`}
          placeholder="요청 사항에 대한 제목을 입력해주세요"
        />
      </div>

      <div className="flex gap-[63px] items-center px-3 whitespace-nowrap">
        <div className="flex items-center gap-1 text-body-bold">
          요청 내용 <RequiredIcon />
        </div>
        <textarea
          ref={textareaRef}
          value={contentInput.value}
          onChange={(e) => {
            const sanitizedValue = DOMPurify.sanitize(e.target.value);
            contentInput.setValue(sanitizedValue);
            setContent(sanitizedValue);
          }}
          className={`w-[400px] max-w-[700px] min-h-[300px] max-h-[300px] text-subtitle-regular border bg-white py-2 px-4 resize-none border-gray-2 focus:border-main`}
          placeholder={`요청 내용을 자세히 입력해주세요. \nMarkdown 문법을 지원합니다. \n 예: # 제목, **강조**, - 리스트, [링크](https://example.com)**`}
        />
      </div>
    </>
  );
}
