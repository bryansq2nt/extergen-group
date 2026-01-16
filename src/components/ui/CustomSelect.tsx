'use client';

import React, { useState, useRef, useEffect } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label: string;
  name: string;
  value?: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  error?: string;
  required?: boolean;
  helperText?: string;
  placeholder?: string;
  className?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required,
  helperText,
  placeholder = 'Select an option',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(value ? options.findIndex((opt) => opt.value === value) : 0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          onChange(options[focusedIndex].value);
          setIsOpen(false);
          setFocusedIndex(-1);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(options.length - 1);
        break;
    }
  };

  // Scroll focused option into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && listboxRef.current) {
      const focusedElement = listboxRef.current.children[focusedIndex] as HTMLElement;
      if (focusedElement) {
        focusedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [focusedIndex, isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const selectId = `select-${name}`;
  const errorId = error ? `${selectId}-error` : undefined;
  const helperId = helperText && !error ? `${selectId}-helper` : undefined;

  return (
    <div className={`w-full ${className}`} ref={selectRef}>
      <label
        htmlFor={selectId}
        className="block text-sm font-semibold text-azul mb-2"
      >
        {label}
        {required && <span className="text-naranja ml-1">*</span>}
      </label>

      {/* Hidden input for form compatibility */}
      <input
        type="hidden"
        name={name}
        value={value || ''}
        {...(error ? { 'aria-invalid': 'true' } : {})}
      />

      <div className="relative">
        <button
          type="button"
          id={selectId}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-naranja/50
            text-left flex items-center justify-between
            ${error
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-300 focus:border-naranja'
            }
            ${isOpen ? 'border-naranja' : ''}
            hover:border-naranja/50
          `}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : helperId}
        >
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 animate-dropdown">
            <ul
              ref={listboxRef}
              role="listbox"
              className="bg-blanco rounded-lg shadow-xl border border-gray-200 py-2 max-h-60 overflow-auto"
              aria-labelledby={selectId}
            >
              {options.map((option, index) => {
                const isSelected = option.value === value;
                const isFocused = index === focusedIndex;

                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option.value)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    className={`
                      px-4 py-3 cursor-pointer transition-colors duration-150
                      flex items-center justify-between
                      ${isSelected
                        ? 'bg-naranja/10 text-naranja font-medium'
                        : isFocused
                        ? 'bg-teal/10 text-azul'
                        : 'text-gray-700 hover:bg-naranja/5'
                      }
                    `}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <svg
                        className="w-5 h-5 text-naranja"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={helperId} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};
