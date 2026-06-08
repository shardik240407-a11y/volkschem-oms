import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    label,
    type = 'text',
    placeholder,
    error,
    helperText,
    options,  // for select
    rows = 3, // for textarea
    className = '',
    id,
    ...props
  },
  ref
) {
  const inputId = id || `input-${label?.replace(/\s+/g, '-').toLowerCase()}`;

  const baseClasses = `
    w-full px-3 py-2 bg-white border rounded-lg text-sm text-text-primary
    placeholder:text-text-muted
    focus:outline-none focus:ring-2 focus:ring-primary-lighter/40 focus:border-primary-lighter
    transition-colors duration-200
    disabled:bg-surface-alt disabled:cursor-not-allowed
    ${error ? 'border-error focus:ring-error/40 focus:border-error' : 'border-border hover:border-border-dark'}
    ${className}
  `;

  const renderInput = () => {
    if (type === 'select') {
      return (
        <select ref={ref} id={inputId} className={baseClasses} {...props}>
          {placeholder && <option value="">{placeholder}</option>}
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }
    if (type === 'textarea') {
      return (
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          placeholder={placeholder}
          className={`${baseClasses} resize-none`}
          {...props}
        />
      );
    }
    return (
      <input
        ref={ref}
        id={inputId}
        type={type}
        placeholder={placeholder}
        className={baseClasses}
        {...props}
      />
    );
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
          {label}
          {props.required && <span className="text-error ml-0.5">*</span>}
        </label>
      )}
      {renderInput()}
      {error && <p className="text-xs text-error">{error}</p>}
      {helperText && !error && <p className="text-xs text-text-muted">{helperText}</p>}
    </div>
  );
});

export default Input;
