import React from 'react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  characterLimit?: number;
  currentLength?: number;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, required, helperText, characterLimit, currentLength, className = '', ...props }, ref) => {
    const textareaId = props.id || props.name;

    return (
      <div className="w-full">
        <label
          htmlFor={textareaId}
          className="block text-sm font-semibold text-azul mb-2"
        >
          {label}
          {required && <span className="text-naranja ml-1">*</span>}
        </label>
        <textarea
          ref={ref}
          id={textareaId}
          rows={4}
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-naranja/50 resize-none
            ${error 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:border-naranja'
            }
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
          {...props}
        />
        {characterLimit && (
          <div className="mt-1 text-xs text-gray-500 text-right">
            {currentLength || 0} / {characterLimit} characters
          </div>
        )}
        {error && (
          <p id={`${textareaId}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${textareaId}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';
