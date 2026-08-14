export const getRiskTheme = (riskLevel) => {
  switch (riskLevel) {
    case "RED":
      return {
        bg: "bg-red-500/10",
        border: "border-red-500",
        text: "text-red-500",
        badge: "bg-red-500 text-white",
      };
    case "YELLOW":
      return {
        bg: "bg-amber-500/10",
        border: "border-amber-500",
        text: "text-amber-500",
        badge: "bg-amber-500 text-white",
      };
    case "GREEN":
    default:
      return {
        bg: "bg-emerald-500/10",
        border: "border-emerald-500",
        text: "text-emerald-500",
        badge: "bg-emerald-500 text-white",
      };
  }
};

export const formatTime = (isoString) => {
  if (!isoString) return "N/A";
  return new Date(isoString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};
