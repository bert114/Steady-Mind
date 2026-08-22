const mapValidationErrors = (error) => {
  const errors = {};

  error.details.forEach((detail) => {
    const field = detail.path[0];

    errors[field] = detail.message.replace(/"/g, "");
  });

  return errors;
};

export { mapValidationErrors };
