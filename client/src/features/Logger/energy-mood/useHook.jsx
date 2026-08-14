import { useEffect, useState } from "react";
import { validateInput } from "./helpers";
import { buildPayload } from "./utils";
import { submit } from "./service";
import { id } from "../../test/id";
import { handleToast } from "../../toast/toast.util";
import { setBatteryData } from "../../battery/utils";
import { changeStatus } from "../../burnout/burnoutUtils";
import { refreshDashboard } from "../../Dashboard/dashboard.service";

export const useHook = (currentUserId) => {
  const [energy, setEnergy] = useState(65);
  const [selectedMood, setSelectedMood] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    if (!response) {
      return;
    }

    handleToast(response.message, "success");

    changeStatus(response.data.burnoutRisk);
    setBatteryData(response);
    setIsSubmitted(true);
  }, [response]);

  const handleEnergyChange = (e) => {
    const value = Number(e.target.value);
    setEnergy(value);
    if (value >= 0 && value <= 100) setError("");
  };

  const handleSelectMood = (mood) => {
    setSelectedMood(mood);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    1;
    const validationError = validateInput(energy, selectedMood);
    if (validationError) {
      setError(validationError);
      return;
    }

    // need to change pa
    const payload = buildPayload(id, energy, selectedMood);
    console.log(payload);

    try {
      setIsSubmitting(true);
      setError("");
      const res = await submit(payload);

      await refreshDashboard();
      setResponse(res);
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.message ||
          "Failed to log telemetry. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setEnergy(65);
    setSelectedMood("");
    setError("");
  };

  return {
    energy,
    selectedMood,
    error,
    isSubmitting,
    isSubmitted,
    handleEnergyChange,
    handleSelectMood,
    handleSubmit,
    resetForm,
  };
};
