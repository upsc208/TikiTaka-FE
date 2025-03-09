import React, {useCallback} from 'react';

export const useEnterKeyHandler = (callback: () => void) => {
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        callback();
      }
    },
    [callback]
  );

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);
};
