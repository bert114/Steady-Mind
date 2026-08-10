import { useState } from "react";
import { validateInput } from "./helpers";
import { buildPayload } from "./utils";
import { submit } from "./service";
import { id } from "../../test/id";

export const useHook = (currentUserId) => {
  const [energy, setEnergy] = useState(65);
  const [selectedMood, setSelectedMood] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

    const validationError = validateInput(energy, selectedMood);
    if (validationError) {
      setError(validationError);
      return;
    }

    // need to change pa
    const payload = buildPayload(id, energy, selectedMood);

    try {
      setIsSubmitting(true);
      setError("");
      await submit(payload);

      setIsSubmitted(true);
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
