import { useEffect, useState } from "react";
import { recoveryService } from "./recovery.service";
import { useRecoveryStore } from "./useRecoveryStore";

export function useRecoveryHook(option) {
  const [recoveries, setRecovery] = useState([]);

  const { addObject, payload } = useRecoveryStore();

  useEffect(() => {
    console.log(payload);
  }, [payload]);

  const saveRecovery = (e) => {
    e.preventDefault();

    recoveryService.saveRecoveryActivity(payload);
  };

  return {
    setRecovery,
    recoveries,
    payload,

    addObject,

    saveRecovery,
  };
}
