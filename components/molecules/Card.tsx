import React, { forwardRef } from 'react'
import Link from 'next/link'
import Heading from '../atoms/Heading'
import Text from '../atoms/Text'
import Button from '../atoms/Button'
import Icon from '../atoms/Icon'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'highlighted' | 'featured' | 'job-listing'
  size?: 'sm' | 'base' | 'lg'
  title?: string
  subtitle?: string
  icon?: React.ReactNode
  content?: React.ReactNode
  footer?: React.ReactNode
  href?: string
  clickable?: boolean
  
  // Job listing specific props
  company?: string
  location?: string
  salary?: string
  jobType?: string
  featured?: boolean
  urgent?: boolean
  
  // Interactive props
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void
  
  // Accessibility
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  
  children?: React.ReactNode
  className?: string
  'data-testid'?: string
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      size = 'base',
      title,
      subtitle,
      icon,
      content,
      footer,
      href,
      clickable = false,
      company,
      location,
      salary,
      jobType,
      featured = false,
      urgent = false,
      onClick,
      onKeyDown,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const isInteractive = clickable || onClick || href

    const variantClasses = {
      default: 'bg-white border-neutral-200 hover:border-neutral-300',
      highlighted: 'bg-white border-primary border-l-4 hover:border-primary-dark',
      featured: 'bg-white border-secondary border-l-4 hover:border-secondary-dark',
      'job-listing': 'bg-white border-neutral-200 hover:border-primary hover:shadow-md',
    }

    const sizeClasses = {
      sm: 'p-4 min-h-[120px] text-sm',
      base: 'p-6 min-h-[140px] text-base', 
      lg: 'p-8 min-h-[160px] text-lg',
    }

    const baseClasses = `
      border
      rounded-lg
      shadow-sm
      transition-all
      duration-200
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${isInteractive ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2' : ''}
      ${className}
    `.replace(/\s+/g, ' ').trim()

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isInteractive) return
      onClick?.(e)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true })
        e.currentTarget.dispatchEvent(clickEvent)
      }
      onKeyDown?.(e)
    }

    const cardContent = (
      <div
        ref={ref}
        className={baseClasses}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={isInteractive ? 0 : undefined}
        role={isInteractive ? 'button' : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        {...props}
      >
        {/* Header */}
        {(title || subtitle || icon || featured || urgent) && (
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {icon && (
                <div className="mb-3">
                  {React.isValidElement(icon) ? icon : <Icon src={icon as any} size="lg" />}
                </div>
              )}
              {title && (
                <Heading
                  level={variant === 'job-listing' ? 3 : 2}
                  size={size === 'sm' ? 'lg' : size === 'base' ? 'xl' : '2xl'}
                  className={`mb-2 ${variant === 'highlighted' ? 'text-primary' : variant === 'featured' ? 'text-secondary' : ''}`}
                >
                  {title}
                </Heading>
              )}
              {subtitle && (
                <Text
                  size={size === 'sm' ? 'sm' : 'base'}
                  color="muted"
                  className="mb-3"
                >
                  {subtitle}
                </Text>
              )}
            </div>
            
            {/* Badges */}
            <div className="flex flex-col gap-1 ml-4">
              {featured && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                  Featured
                </span>
              )}
              {urgent && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Urgent
                </span>
              )}
            </div>
          </div>
        )}

        {/* Job listing specific content */}
        {variant === 'job-listing' && (company || location || salary || jobType) && (
          <div className="mb-4 space-y-2">
            {company && (
              <Text size="sm" className="font-medium">
                {company}
              </Text>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
              {location && (
                <span className="flex items-center gap-1">
                  <Icon name="location" size="xs" color="muted" />
                  {location}
                </span>
              )}
              {salary && (
                <span className="flex items-center gap-1">
                  <Icon name="salary" size="xs" color="muted" />
                  {salary}
                </span>
              )}
              {jobType && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-neutral-100 text-neutral-800">
                  {jobType}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        {(content || children) && (
          <div className="flex-1 mb-4">
            {content}
            {children}
          </div>
        )}

        {/* Footer */}
        {footer && (
          <div className="mt-auto pt-4 border-t border-neutral-100">
            {footer}
          </div>
        )}
      </div>
    )

    if (href && !onClick) {
      return (
        <Link href={href} className="block">
          {cardContent}
        </Link>
      )
    }

    return cardContent
  }
)

Card.displayName = 'Card'

export default Card