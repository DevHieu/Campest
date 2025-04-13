import { useEffect, useRef } from "react";

export default function useDidMount(effect, deps) {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      return effect();
    } else {
      didMount.current = true;
    }
  }, deps);
}
