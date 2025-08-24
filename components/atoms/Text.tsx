import React, { forwardRef } from 'react'

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'p' | 'span' | 'div' | 'label'
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  color?: 'default' | 'muted' | 'accent' | 'success' | 'warning' | 'error' | 'inverse'
  align?: 'left' | 'center' | 'right' | 'justify'
  display?: 'inline' | 'block'
  truncate?: boolean
  required?: boolean
  error?: boolean
  children: React.ReactNode
  className?: string
  onClick?: () => void
  'aria-label'?: string
  'data-testid'?: string
}

const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      as = 'p',
      size = 'base',
      weight = 'normal',
      color = 'default',
      align = 'left',
      display = 'block',
      truncate = false,
      required = false,
      error = false,
      children,
      className = '',
      onClick,
      ...props
    },
    ref
  ) => {
    const tagName = as

    const sizeClasses = {
      xs: 'text-xs leading-4',
      sm: 'text-sm leading-5',
      base: 'text-base leading-6',
      lg: 'text-lg leading-7',
      xl: 'text-xl leading-8',
    }

    const weightClasses = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    }

    const colorClasses = {
      default: 'text-neutral-900',
      muted: 'text-neutral-600',
      accent: 'text-primary',
      success: 'text-green-600',
      warning: 'text-yellow-600',
      error: 'text-red-600',
      inverse: 'text-white',
    }

    const alignClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    }

    const displayClasses = {
      inline: 'inline',
      block: 'block',
    }

    const baseClasses = `
      ${sizeClasses[size]}
      ${weightClasses[weight]}
      ${error ? colorClasses.error : colorClasses[color]}
      ${alignClasses[align]}
      ${displayClasses[display]}
      ${truncate ? 'truncate' : ''}
      ${onClick ? 'cursor-pointer min-h-[44px] flex items-center' : ''}
      ${className}
    `.replace(/\s+/g, ' ').trim()

    return React.createElement(
      tagName,
      {
        ref: ref as React.Ref<HTMLElement>,
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

Text.displayName = 'Text'

export default Text