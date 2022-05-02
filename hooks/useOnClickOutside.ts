import { useEffect, MutableRefObject } from "react";

function useOnClickOutside(ref: MutableRefObject<any>, callback: any) {
  useEffect(() => {
    const listener = (event: any) => {
      // console.log(ref.current, event.target);
      if (event.target == ref.current || ref.current.contains(event.target)) {
        // console.log("KLIK 1");
      } else {
        // console.log("KLIK 2");
      }
    };
    document.addEventListener("click", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("click", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [callback, ref]);
}

export default useOnClickOutside;
