export const extractErrorSource = (stack) => {
  if (!stack) return "Unknown source";

  const lines = stack.split("\n");
  const targetLine =
    lines.find(
      (line) =>
        line.includes("file://") ||
        (line.includes("/") &&
          !line.includes("node_modules") &&
          !line.includes("internal")),
    ) ||
    lines[1] ||
    "";

  return targetLine.trim();
};
