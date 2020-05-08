import { ValidationError } from 'yup';

interface ValidationErrorsDTO {
  [key: string]: string;
}

function getValidationErrors(errors: ValidationError): ValidationErrorsDTO {
  const validationErrors: ValidationErrorsDTO = {};

  errors.inner.forEach(error => {
    validationErrors[error.path] = error.message;
  });
  return validationErrors;
}

export default getValidationErrors;
