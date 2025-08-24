import React, { forwardRef } from 'react'

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
  color?: 'default' | 'muted' | 'accent' | 'success' | 'warning' | 'error'
  required?: boolean
  error?: boolean
  children: React.ReactNode
  className?: string
  onClick?: () => void
  'aria-label'?: string
  'data-testid'?: string
}

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      level = 1,
      size = 'base',
      color = 'default',
      required = false,
      error = false,
      children,
      className = '',
      onClick,
      ...props
    },
    ref
  ) => {
    const tagName = `h${level}`

    const sizeClasses = {
      xs: 'text-xs leading-4',
      sm: 'text-sm leading-5',
      base: 'text-base leading-6',
      lg: 'text-lg leading-7',
      xl: 'text-xl leading-8',
      '2xl': 'text-2xl leading-9',
      '3xl': 'text-3xl leading-10',
      '4xl': 'text-4xl leading-none',
      '5xl': 'text-5xl leading-none',
    }

    const colorClasses = {
      default: 'text-neutral-900',
      muted: 'text-neutral-600',
      accent: 'text-primary',
      success: 'text-green-600',
      warning: 'text-yellow-600',
      error: 'text-red-600',
    }

    const baseClasses = `
      font-semibold 
      ${sizeClasses[size]}
      ${error ? colorClasses.error : colorClasses[color]}
      ${onClick ? 'cursor-pointer min-h-[44px] flex items-center' : ''}
      ${className}
    `.replace(/\s+/g, ' ').trim()

    return React.createElement(
      tagName,
      {
        ref,
        className: baseClasses,
        onClick,
        role: onClick ? 'button' : undefined,
        tabIndex: onClick ? 0 : undefined,
        onKeyDown: onClick
          ? (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined,
        ...props
      },
      children,
      required && (
        React.createElement('span', {
          className: 'ml-1 text-red-500',
          'aria-label': 'required'
        }, '*')
      )
    )
  }
)

Heading.displayName = 'Heading'

export default Heading