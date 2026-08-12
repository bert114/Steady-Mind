const isValidNonEmptyString = (val) =>
  typeof val === "string" && val.trim().length > 0;

const isPositiveInteger = (val) => {
  const parsed =
    typeof val === "string" && val.trim() !== "" ? Number(val) : val;
  return Number.isInteger(parsed) && parsed > 0;
};

const isIntegerInRange = (val, min, max) => {
  const parsed =
    typeof val === "string" && val.trim() !== "" ? Number(val) : val;
  return Number.isInteger(parsed) && parsed >= min && parsed <= max;
};

const isValidIsoTimestamp = (val) =>
  typeof val === "string" && !isNaN(Date.parse(val));

const formatLogDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export {
  isValidNonEmptyString,
  isPositiveInteger,
  isIntegerInRange,
  isValidIsoTimestamp,
  formatLogDate,
};
