import { useCallback, useEffect, useState } from "react";
import { recoveryService } from "./recovery.service";
import { useRecoveryStore } from "./useRecoveryStore";
import { refreshDashboard } from "../Dashboard/dashboard.service";
import { handleToast } from "../toast/toast.util";

export function useRecoveryHook(option) {
  const [recoveries, setRecovery] = useState([]);
  const [error, setError] = useState();
  const { addObject, payload } = useRecoveryStore();

  useEffect(() => {
    if (!error) return;
    handleToast(error?.message, "error");
  }, [error]);

  const saveRecovery = async (e) => {
    try {
      e.preventDefault();

      const res = await recoveryService.saveRecoveryActivity(payload);

      console.log(res);

      if (res.success) {
        refreshDashboard();

        handleToast(res.message);
      }
    } catch (error) {
      console.log(error.response.data.errors);
      setError(error.response.data.errors);
    }
  };

  return {
    setRecovery,
    recoveries,
    payload,
    error,
    addObject,

    saveRecovery,
  };
}
