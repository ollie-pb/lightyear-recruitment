import React from 'react'
import Link from 'next/link'

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  onClick?: () => void
  loading?: boolean
  fullWidth?: boolean
  href?: string
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  'aria-label'?: string
  'data-testid'?: string
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  loading = false,
  fullWidth = false,
  href,
  children,
  className = '',
  type = 'button',
  ...props
}) => {
  const isDisabled = disabled || loading

  const baseClasses = `
    inline-flex items-center justify-center 
    font-medium rounded-md transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    relative overflow-hidden
  `

  const variantClasses = {
    primary: `
      bg-primary text-white 
      hover:bg-primary-dark 
      focus:ring-primary
      disabled:hover:bg-primary
    `,
    secondary: `
      bg-secondary text-white 
      hover:bg-secondary-dark 
      focus:ring-secondary
      disabled:hover:bg-secondary
    `,
    outline: `
      border-2 border-neutral-300 bg-transparent
      text-neutral-700 
      hover:bg-neutral-50 
      focus:ring-primary
      disabled:hover:bg-transparent
    `,
  }

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm min-h-[44px]',
    medium: 'px-4 py-2 text-base min-h-[44px]',
    large: 'px-6 py-3 text-lg min-h-[48px]',
  }

  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.replace(/\s+/g, ' ').trim()

  const content = (
    <>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            data-testid="loading-spinner"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}
      <span className={loading ? 'opacity-0' : ''}>{children}</span>
    </>
  )

  if (href && !isDisabled) {
    return (
      <Link
        href={href}
        className={combinedClasses}
        aria-disabled={isDisabled}
        {...props}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type={type}
      className={combinedClasses}
      disabled={isDisabled}
      onClick={onClick}
      aria-disabled={isDisabled}
      {...props}
    >
      {content}
    </button>
  )
}

export default Button