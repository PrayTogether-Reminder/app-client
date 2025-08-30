import { useRef, useEffect, MutableRefObject, useCallback } from "react";
import { TextInput } from "react-native-paper";

interface UseKoreanInputProps {
  initialValue: string;
  visible: boolean;
}

interface UseKoreanInputReturn {
  textInputRef: MutableRefObject<TextInput | null>;
  currentValue: MutableRefObject<string>;
  handleChange: (text: string) => void;
  getValue: () => string;
  reset: () => void;
  setValue: (value: string) => void;
  clear: () => void;
}

// TextInput from react-native-paper has additional methods
interface ExtendedTextInput extends TextInput {
  setNativeProps?: (props: any) => void;
  clear?: () => void;
  focus?: () => void;
  blur?: () => void;
}

export function useKoreanInput({ 
  initialValue, 
  visible 
}: UseKoreanInputProps): UseKoreanInputReturn {
  const textInputRef = useRef<ExtendedTextInput | null>(null);
  const currentValue = useRef(initialValue);

  useEffect(() => {
    if (visible) {
      currentValue.current = initialValue;
      if (textInputRef.current?.setNativeProps) {
        textInputRef.current.setNativeProps({ text: initialValue });
      }
    }
  }, [initialValue, visible]);

  const handleChange = useCallback((text: string) => {
    currentValue.current = text;
  }, []);

  const getValue = useCallback(() => currentValue.current, []);
  
  const setValue = useCallback((value: string) => {
    currentValue.current = value;
    if (textInputRef.current?.setNativeProps) {
      textInputRef.current.setNativeProps({ text: value });
    }
  }, []);

  const reset = useCallback(() => {
    currentValue.current = initialValue;
    if (textInputRef.current?.setNativeProps) {
      textInputRef.current.setNativeProps({ text: initialValue });
    }
  }, [initialValue]);

  const clear = useCallback(() => {
    currentValue.current = "";
    if (textInputRef.current?.clear) {
      textInputRef.current.clear();
    }
  }, []);

  return {
    textInputRef: textInputRef as MutableRefObject<TextInput | null>,
    currentValue,
    handleChange,
    getValue,
    reset,
    setValue,
    clear,
  };
}