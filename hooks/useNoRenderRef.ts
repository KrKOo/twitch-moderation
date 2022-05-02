import { useRef } from "react";

export const useNoRenderRef = (currentValue: any) => {
  const ref = useRef(currentValue);
  ref.current = currentValue;
  return ref;
};
