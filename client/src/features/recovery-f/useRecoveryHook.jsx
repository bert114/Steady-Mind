import { useEffect, useState } from "react";

export function useRecoveryHook() {
  const [recoveries, setRecovery] = useState([]);
  const [payload, setPayload] = useState({});

  useEffect(() => {
    console.log(payload);
  }, [payload]);

  const addObject = (newObject) => {
    setPayload((state) => ({ ...state, ...newObject }));
  };

  return {
    setRecovery,
    recoveries,
    payload,

    addObject,
  };
}
