import {useState, useEffect} from 'react';

interface UseLimitedInputProps {
  maxLength: number;
  initialValue?: string;
  onLimitExceed?: () => void;
  onChange?: (value: string) => void;
}

export function useLimitedInput({maxLength, initialValue = '', onLimitExceed, onChange}: UseLimitedInputProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (newValue: string) => {
    if (newValue.length > maxLength) {
      onLimitExceed?.();
      const trimmedValue = newValue.slice(0, maxLength);
      setValue(trimmedValue);
      onChange?.(trimmedValue);
    } else {
      setValue(newValue);
      onChange?.(newValue);
    }
  };

  return {value, setValue: handleChange};
}
