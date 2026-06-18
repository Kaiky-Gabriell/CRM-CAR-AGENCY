import React, { type InputHTMLAttributes, forwardRef } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || Math.random().toString(36).substring(7);

    return (
      <div className={`input-wrapper ${className}`}>
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
          </label>
        )}
        <div className="input-container">
          {leftIcon && <div className="input-icon-left">{leftIcon}</div>}
          <input
            ref={ref}
            id={inputId}
            className={`input-field ${error ? 'input-error' : ''} ${leftIcon ? 'has-left-icon' : ''
              } ${rightIcon ? 'has-right-icon' : ''}`}
            {...props}
          />
          {rightIcon && <div className="input-icon-right">{rightIcon}</div>}
        </div>
        {(error || helperText) && (
          <div className={`input-message ${error ? 'error-text' : 'helper-text'}`}>
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
