import React from "react";

interface FormContainerProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  onSubmit: (e: React.FormEvent) => void;
}

export const FormContainer: React.FC<FormContainerProps> = ({
  children,
  title,
  subtitle,
  onSubmit,
}) => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-center text-sm text-gray-600">{subtitle}</p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={onSubmit}>
            {children}
          </form>
        </div>
      </div>
    </div>
  );
};
