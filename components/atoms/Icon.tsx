import React, { forwardRef, useState, useCallback } from 'react'
import Image from 'next/image'

export interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
  src?: string | React.ComponentType<React.SVGProps<SVGSVGElement>>
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  color?: 'default' | 'muted' | 'accent' | 'success' | 'warning' | 'error' | 'inverse' | 'current'
  rotation?: 0 | 90 | 180 | 270
  flipHorizontal?: boolean
  flipVertical?: boolean
  loading?: boolean
  disabled?: boolean
  interactive?: boolean
  viewBox?: string
  preserveAspectRatio?: string
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  'data-testid'?: string
}

const Icon = forwardRef<HTMLDivElement, IconProps>(
  (
    {
      name,
      src,
      size = 'base',
      color = 'current',
      rotation = 0,
      flipHorizontal = false,
      flipVertical = false,
      loading = false,
      disabled = false,
      interactive = false,
      viewBox = '0 0 24 24',
      preserveAspectRatio = 'xMidYMid meet',
      className = '',
      onClick,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false)

    const sizeClasses = {
      xs: 'w-4 h-4', // 16px
      sm: 'w-5 h-5', // 20px
      base: 'w-6 h-6', // 24px
      lg: 'w-8 h-8', // 32px
      xl: 'w-10 h-10', // 40px
    }

    const colorClasses = {
      default: 'text-neutral-900',
      muted: 'text-neutral-600',
      accent: 'text-primary',
      success: 'text-green-600',
      warning: 'text-yellow-600',
      error: 'text-red-600',
      inverse: 'text-white',
      current: 'text-current',
    }

    const interactiveClasses = {
      default: 'hover:text-neutral-700 focus:text-neutral-700',
      muted: 'hover:text-neutral-800 focus:text-neutral-800',
      accent: 'hover:text-primary-dark focus:text-primary-dark',
      success: 'hover:text-green-700 focus:text-green-700',
      warning: 'hover:text-yellow-700 focus:text-yellow-700',
      error: 'hover:text-red-700 focus:text-red-700',
      inverse: 'hover:text-neutral-200 focus:text-neutral-200',
      current: '',
    }

    const focusRingClasses = {
      default: 'focus:ring-neutral-900/20',
      muted: 'focus:ring-neutral-600/20',
      accent: 'focus:ring-primary/20',
      success: 'focus:ring-green-600/20',
      warning: 'focus:ring-yellow-600/20',
      error: 'focus:ring-red-600/20',
      inverse: 'focus:ring-white/20',
      current: 'focus:ring-current/20',
    }

    // Calculate touch target padding for interactive icons
    const touchTargetPadding = interactive ? {
      xs: 'p-3.5', // 14px padding for 16px icon = 44px total
      sm: 'p-3', // 12px padding for 20px icon = 44px total
      base: 'p-2.5', // 10px padding for 24px icon = 44px total
      lg: 'p-1.5', // 6px padding for 32px icon = 44px total
      xl: 'p-0.5', // 2px padding for 40px icon = 44px total
    }[size] : ''

    const transforms = []
    if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`)
    if (flipHorizontal) transforms.push('scaleX(-1)')
    if (flipVertical) transforms.push('scaleY(-1)')
    const transformStyle = transforms.length > 0 ? { transform: transforms.join(' ') } : {}

    const baseClasses = `
      inline-flex
      items-center
      justify-center
      ${sizeClasses[size]}
      ${disabled ? 'text-neutral-400 cursor-not-allowed' : colorClasses[color]}
      ${interactive && !disabled ? `
        cursor-pointer
        transition-colors
        duration-200
        rounded-sm
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        ${interactiveClasses[color]}
        ${focusRingClasses[color]}
        ${touchTargetPadding}
      ` : ''}
      ${className}
    `.replace(/\s+/g, ' ').trim()

    const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || loading) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
      onClick?.(e)
    }, [disabled, loading, onClick])

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
      if (interactive && !disabled && !loading && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true })
        e.currentTarget.dispatchEvent(clickEvent)
      }
    }, [interactive, disabled, loading])

    const commonProps = {
      ref: ref as React.Ref<HTMLDivElement>,
      className: baseClasses,
      style: transformStyle,
      onClick: interactive ? handleClick : undefined,
      onKeyDown: interactive ? handleKeyDown : undefined,
      tabIndex: interactive && !disabled && !loading ? 0 : undefined,
      role: interactive ? 'button' : undefined,
      'aria-disabled': disabled ? true : undefined,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,
      'data-testid': props['data-testid'],
      ...props,
    }

    // Loading state
    if (loading) {
      return (
        <div {...commonProps} aria-hidden="true">
          <svg
            className="animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              className="opacity-25"
            />
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              className="opacity-75"
            />
          </svg>
        </div>
      )
    }

    // SVG Component source
    if (src && typeof src !== 'string') {
      const SvgComponent = src as React.ComponentType<React.SVGProps<SVGSVGElement>>
      return (
        <div {...commonProps}>
          <SvgComponent
            viewBox={viewBox}
            preserveAspectRatio={preserveAspectRatio}
            className="w-full h-full"
            aria-hidden={!ariaLabel && !ariaLabelledby ? 'true' : undefined}
          />
        </div>
      )
    }

    // String URL source (external image)
    if (src && typeof src === 'string' && !imageError) {
      return (
        <div {...commonProps}>
          <Image
            src={src}
            alt={ariaLabel || ''}
            width={24}
            height={24}
            className="w-full h-full object-contain"
            onError={() => {
              setImageError(true)
            }}
          />
        </div>
      )
    }

    // Icon name fallback (you would implement icon mapping here)
    if (name) {
      return (
        <div {...commonProps}>
          <svg
            viewBox={viewBox}
            preserveAspectRatio={preserveAspectRatio}
            className="w-full h-full"
            aria-hidden={!ariaLabel && !ariaLabelledby ? 'true' : undefined}
          >
            {/* This would be replaced with actual icon mapping */}
            <rect x="2" y="2" width="20" height="20" fill="currentColor" />
          </svg>
        </div>
      )
    }

    // Fallback empty state
    return (
      <div {...commonProps} aria-hidden="true">
        <svg
          viewBox={viewBox}
          preserveAspectRatio={preserveAspectRatio}
          className="w-full h-full text-neutral-300"
        >
          <rect
            x="2"
            y="2"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="2,2"
          />
        </svg>
      </div>
    )
  }
)

Icon.displayName = 'Icon'

export default Icon