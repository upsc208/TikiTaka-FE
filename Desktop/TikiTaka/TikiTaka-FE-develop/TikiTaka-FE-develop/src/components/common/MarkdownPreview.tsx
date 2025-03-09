import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

export default function MarkdownPreview({ content }: { content: string }) {
  const [sanitizedHTML, setSanitizedHTML] = useState('');

  useEffect(() => {
    async function convertMarkdown() {
      marked.setOptions({
        breaks: true,
      });

      const html = await marked(content);
      const sanitized = DOMPurify.sanitize(html);
      setSanitizedHTML(sanitized);
    }

    convertMarkdown();
  }, [content]);

  return <div className="prose" dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
}