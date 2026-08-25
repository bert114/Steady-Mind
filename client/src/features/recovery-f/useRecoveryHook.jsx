import { useEffect, useState } from "react";
import { refreshDashboard } from "../Dashboard/dashboard.service";
import { handleToast } from "../toast/toast.util";
import { recoveryService } from "./recovery.service";
import { useRecoveryStore } from "./useRecoveryStore";

export function useRecoveryHook(option) {
  const [recoveries, setRecovery] = useState([]);
  const [error, setError] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addObject, payload } = useRecoveryStore();

  useEffect(() => {
    if (!error) return;
    handleToast(error?.message, "error");
  }, [error]);

  const saveRecovery = async (e) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);
      setError(undefined);

      const res = await recoveryService.saveRecoveryActivity(payload);

      console.log(res);

      if (res.success) {
        await refreshDashboard();

        handleToast(res.message);
      }
    } catch (error) {
      console.log(error.response.data.errors);
      setError(error.response.data.errors);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    setRecovery,
    recoveries,
    payload,
    error,
    isSubmitting,
    addObject,

    saveRecovery,
  };
}
