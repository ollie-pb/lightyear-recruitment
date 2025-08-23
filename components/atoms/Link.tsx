import React, { forwardRef } from 'react'
import NextLink from 'next/link'

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  color?: 'default' | 'muted' | 'accent' | 'success' | 'warning' | 'error' | 'inverse'
  underline?: 'none' | 'hover' | 'always'
  external?: boolean
  disabled?: boolean
  iconBefore?: React.ReactNode
  iconAfter?: React.ReactNode
  children: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
  'aria-label'?: string
  'data-testid'?: string
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      href,
      size = 'base',
      color = 'default',
      underline = 'hover',
      external,
      disabled = false,
      iconBefore,
      iconAfter,
      children,
      className = '',
      onClick,
      target,
      rel,
      ...props
    },
    ref
  ) => {
    const isExternalUrl = external || /^(https?:\/\/|\/\/)/i.test(href)
    
    const sizeClasses = {
      xs: 'text-xs leading-4 min-h-[44px]',
      sm: 'text-sm leading-5 min-h-[44px]',
      base: 'text-base leading-6 min-h-[44px]',
      lg: 'text-lg leading-7 min-h-[44px]',
      xl: 'text-xl leading-8 min-h-[44px]',
    }

    const colorClasses = {
      default: 'text-primary hover:text-primary-dark focus:text-primary-dark',
      muted: 'text-neutral-600 hover:text-neutral-800 focus:text-neutral-800',
      accent: 'text-secondary hover:text-secondary-dark focus:text-secondary-dark',
      success: 'text-green-600 hover:text-green-700 focus:text-green-700',
      warning: 'text-yellow-600 hover:text-yellow-700 focus:text-yellow-700',
      error: 'text-red-600 hover:text-red-700 focus:text-red-700',
      inverse: 'text-white hover:text-neutral-200 focus:text-neutral-200',
    }

    const underlineClasses = {
      none: 'no-underline',
      hover: 'no-underline hover:underline',
      always: 'underline',
    }

    const focusRingClasses = {
      default: 'focus:ring-primary/20',
      muted: 'focus:ring-neutral-500/20',
      accent: 'focus:ring-secondary/20',
      success: 'focus:ring-green-600/20',
      warning: 'focus:ring-yellow-600/20',
      error: 'focus:ring-red-600/20',
      inverse: 'focus:ring-white/20',
    }

    const baseClasses = `
      inline-flex
      items-center
      gap-1
      transition-colors
      duration-200
      rounded-sm
      focus:outline-none
      focus:ring-2
      focus:ring-offset-2
      ${sizeClasses[size]}
      ${disabled ? 'text-neutral-400 cursor-not-allowed' : colorClasses[color]}
      ${underlineClasses[underline]}
      ${disabled ? '' : focusRingClasses[color]}
      ${className}
    `.replace(/\s+/g, ' ').trim()

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (disabled) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
      onClick?.(e)
    }

    const linkProps = {
      ref,
      className: baseClasses,
      onClick: handleClick,
      tabIndex: disabled ? -1 : undefined,
      'aria-disabled': disabled ? 'true' : undefined,
      target: isExternalUrl && !disabled ? target || '_blank' : target,
      rel: isExternalUrl && !disabled ? rel || 'noopener noreferrer' : rel,
      ...props,
    }

    const content = (
      <>
        {iconBefore}
        {children}
        {iconAfter}
      </>
    )

    if (disabled) {
      return (
        <span {...linkProps} role="link" aria-disabled="true">
          {content}
        </span>
      )
    }

    if (isExternalUrl) {
      return (
        <a href={href} {...linkProps}>
          {content}
        </a>
      )
    }

    return (
      <NextLink href={href} passHref legacyBehavior>
        <a {...linkProps}>
          {content}
        </a>
      </NextLink>
    )
  }
)

Link.displayName = 'Link'

export default Link