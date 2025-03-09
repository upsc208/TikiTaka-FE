import {useMemo} from 'react';

export default function useLimitByteLength(text: string, maxBytes: number) {
  return useMemo(() => {
    let bytes = 0;
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const char = text.charAt(i);
      const charBytes = char.charCodeAt(0) > 127 ? 2 : 1;
      if (bytes + charBytes > maxBytes) break;
      bytes += charBytes;
      result += char;
    }
    return result;
  }, [text, maxBytes]);
}
