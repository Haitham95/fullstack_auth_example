import React from "react";
import { FieldError } from "react-hook-form";

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: FieldError;
  register: any;
  required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type = "text",
  placeholder = "",
  error,
  register,
  required = false,
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`appearance-none block w-full px-3 py-2 border ${
            error ? "border-red-300" : "border-gray-300"
          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          {...register}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${id}-error`}>
          {error.message}
        </p>
      )}
    </div>
  );
};
