import React from 'react';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label: string;
  name: string;
  options: RadioOption[];
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  helperText?: string;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
  required,
  helperText,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      <label className="block text-sm font-semibold text-azul mb-3">
        {label}
        {required && <span className="text-naranja ml-1">*</span>}
      </label>
      <div className="space-y-2" role="radiogroup" aria-labelledby={`${name}-label`}>
        {options.map((option) => (
          <label
            key={option.value}
            htmlFor={`${name}-${option.value}`}
            className={`
              flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
              ${value === option.value
                ? 'border-naranja bg-naranja/5'
                : 'border-gray-300 hover:border-naranja/50 hover:bg-gray-50'
              }
            `}
          >
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 text-naranja focus:ring-naranja focus:ring-2"
              aria-invalid={error ? 'true' : 'false'}
            />
            <span className="ml-3 text-gray-700 font-medium">{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};
