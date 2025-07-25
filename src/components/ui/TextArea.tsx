import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1\" htmlFor={props.id}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={clsx(
            "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm",
            "placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
            error && "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500",
            className
          )}
          rows={4}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;