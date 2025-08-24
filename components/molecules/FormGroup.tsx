import React, { forwardRef, useId } from 'react'
import Input from '../atoms/Input'
import Text from '../atoms/Text'
import Icon from '../atoms/Icon'

export interface FormGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  // Core props
  label?: string
  name?: string
  type?: 'text' | 'email' | 'tel' | 'password' | 'textarea' | 'select' | 'file'
  placeholder?: string
  value?: string | number
  defaultValue?: string | number
  
  // Validation
  required?: boolean
  disabled?: boolean
  error?: string | boolean
  helpText?: string
  validationState?: 'valid' | 'invalid' | 'pending'
  
  // Styling
  size?: 'sm' | 'base' | 'lg'
  iconBefore?: React.ReactNode
  iconAfter?: React.ReactNode
  
  // Select options
  options?: Array<{ value: string | number; label: string; disabled?: boolean }>
  
  // File upload
  accept?: string
  multiple?: boolean
  
  // Textarea specific
  rows?: number
  
  // Event handlers
  onChange?: (value: string | number | File | File[]) => void
  onBlur?: (e: React.FocusEvent) => void
  onFocus?: (e: React.FocusEvent) => void
  
  // Accessibility
  'aria-label'?: string
  'aria-describedby'?: string
  'aria-labelledby'?: string
  
  className?: string
  'data-testid'?: string
}

const FormGroup = forwardRef<HTMLDivElement, FormGroupProps>(
  (
    {
      label,
      name,
      type = 'text',
      placeholder,
      value,
      defaultValue,
      required = false,
      disabled = false,
      error,
      helpText,
      validationState,
      size = 'base',
      iconBefore,
      iconAfter,
      options = [],
      accept,
      multiple = false,
      rows = 3,
      onChange,
      onBlur,
      onFocus,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,
      'aria-labelledby': ariaLabelledby,
      className = '',
      ...props
    },
    ref
  ) => {
    const fieldId = useId()
    const helpId = useId()
    const errorId = useId()
    
    const hasError = !!error || validationState === 'invalid'
    const isPending = validationState === 'pending'
    const isValid = validationState === 'valid' && !hasError

    const sizeClasses = {
      sm: 'space-y-1',
      base: 'space-y-2',
      lg: 'space-y-3',
    }

    const helpTextSizes = {
      sm: 'xs' as const,
      base: 'sm' as const,
      lg: 'base' as const,
    }

    const describedBy = [
      ariaDescribedby,
      helpText ? helpId : undefined,
      hasError ? errorId : undefined,
    ].filter(Boolean).join(' ') || undefined

    const handleInputChange = (inputValue: string | number | File | File[]) => {
      onChange?.(inputValue)
    }

    const renderInput = () => {
      const commonProps = {
        id: fieldId,
        name,
        placeholder,
        required,
        disabled: disabled || isPending,
        onBlur,
        onFocus,
        'aria-describedby': describedBy,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledby,
        'data-testid': props['data-testid'] ? `${props['data-testid']}-input` : undefined,
      }

      if (type === 'textarea') {
        return (
          <textarea
            {...commonProps}
            rows={rows}
            value={value as string}
            defaultValue={defaultValue as string}
            className={`
              block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset
              ${hasError ? 'ring-red-300 focus:ring-red-600' : isValid ? 'ring-green-300 focus:ring-green-600' : 'ring-gray-300 focus:ring-primary'}
              placeholder:text-gray-400 focus:ring-2 focus:ring-inset
              ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'}
              ${size === 'sm' ? 'text-sm py-1 px-2' : size === 'lg' ? 'text-lg py-2 px-4' : 'text-base py-1.5 px-3'}
              min-h-[44px] resize-vertical
            `}
            onChange={(e) => handleInputChange(e.target.value)}
          />
        )
      }

      if (type === 'select') {
        return (
          <select
            {...commonProps}
            value={value as string}
            defaultValue={defaultValue as string}
            className={`
              block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset
              ${hasError ? 'ring-red-300 focus:ring-red-600' : isValid ? 'ring-green-300 focus:ring-green-600' : 'ring-gray-300 focus:ring-primary'}
              focus:ring-2 focus:ring-inset bg-white
              ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
              ${size === 'sm' ? 'text-sm py-1 px-2' : size === 'lg' ? 'text-lg py-2 px-4' : 'text-base py-1.5 px-3'}
              min-h-[44px]
            `}
            onChange={(e) => handleInputChange(e.target.value)}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
        )
      }

      if (type === 'file') {
        return (
          <input
            {...commonProps}
            type="file"
            accept={accept}
            multiple={multiple}
            className={`
              block w-full text-sm text-gray-900
              file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
              file:text-sm file:font-medium file:bg-primary file:text-white
              file:hover:bg-primary-dark file:cursor-pointer
              ${disabled ? 'file:bg-gray-300 file:cursor-not-allowed cursor-not-allowed' : ''}
              ${size === 'sm' ? 'file:py-1 file:px-2 file:text-xs' : size === 'lg' ? 'file:py-3 file:px-6' : ''}
              min-h-[44px] flex items-center
            `}
            onChange={(e) => {
              const files = e.target.files
              if (files) {
                handleInputChange(multiple ? Array.from(files) : files[0])
              }
            }}
          />
        )
      }

      return (
        <Input
          {...commonProps}
          type={type}
          value={value as string}
          defaultValue={defaultValue as string}
          error={typeof error === 'string' ? error : undefined}
          leftIcon={iconBefore}
          rightIcon={iconAfter}
          onChange={(e) => handleInputChange(e.target.value)}
        />
      )
    }

    return (
      <div
        ref={ref}
        className={`${sizeClasses[size]} ${className}`}
        {...props}
      >
        {/* Label */}
        {label && (
          <label
            htmlFor={fieldId}
            className={`
              block font-medium text-neutral-900
              ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'}
            `}
            data-testid={props['data-testid'] ? `${props['data-testid']}-label` : undefined}
          >
            {label}
            {required && (
              <span className="ml-1 text-red-500" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        {/* Input Field */}
        <div className="relative">
          {renderInput()}
          
          {/* Pending/Loading Indicator */}
          {isPending && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Icon
                name="spinner"
                size="sm"
                className="animate-spin text-gray-400"
                aria-hidden="true"
              />
            </div>
          )}

          {/* Valid Indicator */}
          {isValid && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Icon
                name="check"
                size="sm"
                color="success"
                aria-hidden="true"
              />
            </div>
          )}
        </div>

        {/* Help Text */}
        {helpText && !hasError && (
          <Text
            id={helpId}
            size={helpTextSizes[size]}
            color="muted"
            data-testid={props['data-testid'] ? `${props['data-testid']}-help` : undefined}
          >
            {helpText}
          </Text>
        )}

        {/* Error Message */}
        {hasError && (
          <Text
            id={errorId}
            size={helpTextSizes[size]}
            color="error"
            role="alert"
            aria-live="polite"
            data-testid={props['data-testid'] ? `${props['data-testid']}-error` : undefined}
          >
            {typeof error === 'string' ? error : 'This field is invalid'}
          </Text>
        )}
      </div>
    )
  }
)

FormGroup.displayName = 'FormGroup'

export default FormGroup