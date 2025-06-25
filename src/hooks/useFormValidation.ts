import { useState, useCallback } from "react";

export interface ValidationRule {
  required?: boolean;
  email?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | undefined;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string | undefined;
}

export const useFormValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = useCallback(
    (name: string, value: any): string | undefined => {
      const rule = rules[name];
      if (!rule) return undefined;

      // Required validation
      if (
        rule.required &&
        (!value || (typeof value === "string" && !value.trim()))
      ) {
        return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
      }

      // Email validation
      if (rule.email && value && !/\S+@\S+\.\S+/.test(value)) {
        return "Please enter a valid email address";
      }

      // Min length validation
      if (rule.minLength && value && value.length < rule.minLength) {
        return `Must be at least ${rule.minLength} characters long`;
      }

      // Max length validation
      if (rule.maxLength && value && value.length > rule.maxLength) {
        return `Must be no more than ${rule.maxLength} characters long`;
      }

      // Min value validation
      if (rule.min !== undefined && value && Number(value) < rule.min) {
        return `Must be at least ${rule.min}`;
      }

      // Max value validation
      if (rule.max !== undefined && value && Number(value) > rule.max) {
        return `Must be no more than ${rule.max}`;
      }

      // Pattern validation
      if (rule.pattern && value && !rule.pattern.test(value)) {
        return "Invalid format";
      }

      // Custom validation
      if (rule.custom && value) {
        return rule.custom(value);
      }

      return undefined;
    },
    [rules]
  );

  const validateForm = useCallback(
    (data: any): boolean => {
      const newErrors: ValidationErrors = {};
      let isValid = true;

      Object.keys(rules).forEach((fieldName) => {
        const error = validateField(fieldName, data[fieldName]);
        if (error) {
          newErrors[fieldName] = error;
          isValid = false;
        }
      });

      setErrors(newErrors);
      return isValid;
    },
    [rules, validateField]
  );

  const clearError = useCallback((fieldName: string) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: undefined,
    }));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateField,
    validateForm,
    clearError,
    clearAllErrors,
    setErrors,
  };
};
