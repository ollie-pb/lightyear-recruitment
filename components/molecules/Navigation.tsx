import React, { forwardRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from '../atoms/Link'
import Button from '../atoms/Button'
import Icon from '../atoms/Icon'

export interface NavigationItem {
  label: string
  href?: string
  active?: boolean
  disabled?: boolean
  external?: boolean
  icon?: React.ReactNode
  children?: NavigationItem[]
  onClick?: () => void
}

export interface NavigationProps extends React.HTMLAttributes<HTMLElement> {
  items: NavigationItem[]
  layout?: 'horizontal' | 'vertical' | 'inline'
  type?: 'primary' | 'secondary' | 'breadcrumb' | 'pagination'
  showIcons?: boolean
  mobileResponsive?: boolean
  className?: string
  'aria-label'?: string
  'data-testid'?: string
}

const Navigation = forwardRef<HTMLElement, NavigationProps>(
  (
    {
      items = [],
      layout = 'horizontal',
      type = 'primary',
      showIcons = false,
      mobileResponsive = true,
      className = '',
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [dropdownStates, setDropdownStates] = useState<Record<string, boolean>>({})

    const getDefaultAriaLabel = () => {
      switch (type) {
        case 'primary': return 'Main navigation'
        case 'secondary': return 'Secondary navigation'
        case 'breadcrumb': return 'Breadcrumb navigation'
        case 'pagination': return 'Pagination navigation'
        default: return 'Navigation'
      }
    }

    const layoutClasses = {
      horizontal: 'flex flex-wrap items-center',
      vertical: 'flex flex-col',
      inline: 'inline-flex flex-wrap items-center',
    }

    const typeClasses = {
      primary: 'gap-1 md:gap-6',
      secondary: 'gap-1 md:gap-4', 
      breadcrumb: 'gap-2 text-sm',
      pagination: 'gap-1',
    }

    const baseClasses = `
      ${layoutClasses[layout]}
      ${typeClasses[type]}
      ${className}
    `.replace(/\s+/g, ' ').trim()

    const toggleDropdown = (itemLabel: string) => {
      setDropdownStates(prev => ({
        ...prev,
        [itemLabel]: !prev[itemLabel]
      }))
    }

    const handleKeyDown = (e: React.KeyboardEvent, item: NavigationItem) => {
      if (item.children && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        toggleDropdown(item.label)
      }
    }

    const isActive = (item: NavigationItem) => {
      if (item.active !== undefined) return item.active
      if (item.href && pathname) {
        return pathname === item.href
      }
      return false
    }

    const renderNavigationItem = (item: NavigationItem, index: number, isDropdownItem = false) => {
      const active = isActive(item)
      const hasDropdown = item.children && item.children.length > 0
      const isDropdownOpen = dropdownStates[item.label]

      const itemClasses = `
        flex items-center min-h-[44px] px-3 py-2 rounded-md text-sm font-medium transition-colors
        ${active ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}
        ${item.disabled ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer'}
        ${isDropdownItem ? 'w-full justify-start' : ''}
        ${type === 'breadcrumb' ? 'hover:underline' : ''}
      `

      const content = (
        <>
          {showIcons && item.icon && (
            <span className="mr-2 flex-shrink-0">
              {React.isValidElement(item.icon) ? item.icon : <Icon src={item.icon as string | React.ComponentType<React.SVGProps<SVGSVGElement>>} size="sm" />}
            </span>
          )}
          <span className="truncate">{item.label}</span>
          {item.external && (
            <Icon name="external-link" size="xs" className="ml-1 flex-shrink-0" />
          )}
          {hasDropdown && (
            <Icon 
              name="chevron-down" 
              size="xs" 
              className={`ml-1 flex-shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          )}
        </>
      )

      if (item.disabled) {
        return (
          <span
            key={`${item.label}-${index}`}
            className={itemClasses}
            aria-disabled="true"
            tabIndex={-1}
            role={type === 'primary' ? 'menuitem' : undefined}
          >
            {content}
          </span>
        )
      }

      if (hasDropdown) {
        return (
          <div key={`${item.label}-${index}`} className="relative">
            <button
              className={itemClasses}
              onClick={() => toggleDropdown(item.label)}
              onKeyDown={(e) => handleKeyDown(e, item)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="menu"
              role={type === 'primary' ? 'menuitem' : 'button'}
            >
              {content}
            </button>
            {isDropdownOpen && (
              <div 
                className="absolute top-full left-0 mt-1 py-1 bg-white rounded-md shadow-lg border border-gray-200 min-w-[180px] z-50"
                role="menu"
                aria-orientation="vertical"
              >
                {item.children!.map((child, childIndex) => 
                  renderNavigationItem(child, childIndex, true)
                )}
              </div>
            )}
          </div>
        )
      }

      if (item.onClick) {
        return (
          <button
            key={`${item.label}-${index}`}
            className={itemClasses}
            onClick={item.onClick}
            role={type === 'primary' ? 'menuitem' : 'button'}
          >
            {content}
          </button>
        )
      }

      if (item.href) {
        return (
          <Link
            key={`${item.label}-${index}`}
            href={item.href}
            external={item.external}
            className={itemClasses}
            aria-current={active ? 'page' : undefined}
            role={type === 'primary' ? 'menuitem' : undefined}
          >
            {content}
          </Link>
        )
      }

      return (
        <span
          key={`${item.label}-${index}`}
          className={itemClasses}
          role={type === 'primary' ? 'menuitem' : undefined}
        >
          {content}
        </span>
      )
    }

    // Mobile hamburger menu for horizontal primary navigation
    const showMobileToggle = mobileResponsive && layout === 'horizontal' && type === 'primary'

    if (items.length === 0) {
      return null
    }

    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label={ariaLabel || getDefaultAriaLabel()}
        className={`${showMobileToggle ? 'block' : baseClasses}`}
        {...props}
      >
        {showMobileToggle && (
          <>
            {/* Mobile toggle button */}
            <div className="flex items-center justify-between md:hidden">
              <Button
                variant="outline"
                size="small"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation-menu"
                aria-label="Toggle navigation menu"
                data-testid="mobile-nav-toggle"
                className="min-h-[44px]"
              >
                <Icon 
                  name={mobileMenuOpen ? 'x' : 'menu'} 
                  size="base" 
                  aria-hidden="true" 
                />
              </Button>
            </div>

            {/* Mobile menu */}
            <div 
              id="mobile-navigation-menu"
              className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden mt-4`}
              role="menu"
            >
              <div className="flex flex-col space-y-1">
                {items.map((item, index) => renderNavigationItem(item, index))}
              </div>
            </div>

            {/* Desktop menu */}
            <div 
              className="hidden md:flex md:items-center md:space-x-6"
              role={type === 'primary' ? 'menubar' : undefined}
            >
              {items.map((item, index) => renderNavigationItem(item, index))}
            </div>
          </>
        )}

        {!showMobileToggle && (
          <div 
            className={baseClasses}
            role={type === 'primary' ? 'menubar' : type === 'breadcrumb' ? 'list' : undefined}
          >
            {type === 'breadcrumb' ? (
              items.map((item, index) => (
                <React.Fragment key={`${item.label}-${index}`}>
                  {index > 0 && (
                    <Icon name="chevron-right" size="xs" className="text-gray-400 mx-1" />
                  )}
                  {renderNavigationItem(item, index)}
                </React.Fragment>
              ))
            ) : (
              items.map((item, index) => renderNavigationItem(item, index))
            )}
          </div>
        )}
      </nav>
    )
  }
)

Navigation.displayName = 'Navigation'

export default Navigation