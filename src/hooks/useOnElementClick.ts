import { useEffect, MutableRefObject } from "react";

function useOnElementClick(
  ref: MutableRefObject<any>,
  outsideCallback: any,
  insideCallback?: any
) {
  useEffect(() => {
    const listener = (event: any) => {
      if (event.target == ref.current || ref.current.contains(event.target)) {
        // clicked inside the element
        insideCallback && insideCallback();
      } else {
        // clicked outside of the element
        outsideCallback();
      }
    };
    document.addEventListener("pointerdown", listener);

    return () => {
      document.removeEventListener("pointerdown", listener);
    };
  }, [outsideCallback, insideCallback, ref]);
}

export default useOnElementClick;
