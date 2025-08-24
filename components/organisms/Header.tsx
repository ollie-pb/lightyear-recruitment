import React, { forwardRef, useState } from 'react'
import Link from 'next/link'
import Heading from '../atoms/Heading'
import Text from '../atoms/Text'
import Button from '../atoms/Button'
import Icon from '../atoms/Icon'
import Navigation from '../molecules/Navigation'
import type { NavigationItem } from '../molecules/Navigation'

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  // Site branding
  siteName?: string
  logoUrl?: string
  logoText?: string
  homeUrl?: string
  
  // Header variants
  variant?: 'default' | 'minimal' | 'landing-page'
  sticky?: boolean
  transparent?: boolean
  
  // Navigation
  navigationItems?: NavigationItem[]
  hideNavigation?: boolean
  
  // Contact & CTA
  contactPhone?: string
  contactEmail?: string
  ctaButton?: {
    text: string
    href?: string
    onClick?: () => void
    variant?: 'primary' | 'secondary' | 'outline'
  }
  
  // Features
  showSearch?: boolean
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  
  socialLinks?: Array<{
    platform: 'facebook' | 'linkedin' | 'twitter' | 'instagram'
    url: string
    label?: string
  }>
  
  // Recruitment specific
  jobCount?: {
    total: number
    featured?: number
  }
  featuredBadge?: string
  
  className?: string
  'data-testid'?: string
}

const Header = forwardRef<HTMLElement, HeaderProps>(
  (
    {
      siteName = 'Lightyear Recruitment',
      logoUrl,
      logoText,
      homeUrl = '/',
      variant = 'default',
      sticky = true,
      transparent = false,
      navigationItems = [],
      hideNavigation = false,
      contactPhone,
      contactEmail,
      ctaButton,
      showSearch = false,
      searchPlaceholder = 'Search jobs...',
      onSearch,
      socialLinks = [],
      jobCount,
      featuredBadge,
      className = '',
      ...props
    },
    ref
  ) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault()
      if (searchQuery.trim() && onSearch) {
        onSearch(searchQuery.trim())
      }
    }

    const handleSearchMobile = () => {
      if (searchQuery.trim() && onSearch) {
        onSearch(searchQuery.trim())
        setMobileSearchOpen(false)
      }
    }

    const getSocialIcon = (platform: string) => {
      const icons = {
        facebook: 'facebook',
        linkedin: 'linkedin', 
        twitter: 'twitter',
        instagram: 'instagram',
      }
      return icons[platform as keyof typeof icons] || 'link'
    }

    const headerClasses = `
      ${sticky ? 'sticky top-0 z-50' : 'relative'}
      ${transparent ? 'bg-transparent' : 'bg-white'}
      border-b border-gray-200
      shadow-sm
      ${className}
    `.replace(/\s+/g, ' ').trim()

    if (variant === 'minimal') {
      return (
        <header
          ref={ref}
          className={headerClasses}
          role="banner"
          {...props}
        >
          {/* Skip to content link */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-primary text-white p-2 z-50"
            data-testid="skip-to-content"
          >
            Skip to main content
          </a>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href={homeUrl} className="flex items-center">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={siteName}
                    className="h-8 w-auto"
                    data-testid="header-logo-image"
                  />
                ) : (
                  <Heading
                    level={1}
                    size="lg"
                    className="text-primary font-bold"
                    data-testid="header-logo-text"
                  >
                    {logoText || siteName}
                  </Heading>
                )}
              </Link>

              {/* CTA Button */}
              {ctaButton && (
                <Button
                  variant={ctaButton.variant || 'primary'}
                  size="medium"
                  href={ctaButton.href}
                  onClick={ctaButton.onClick}
                  className="min-h-[44px]"
                  data-testid="header-cta"
                >
                  {ctaButton.text}
                </Button>
              )}
            </div>
          </div>
        </header>
      )
    }

    return (
      <header
        ref={ref}
        className={headerClasses}
        role="banner"
        {...props}
      >
        {/* Skip to content link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-primary text-white p-2 z-50"
          data-testid="skip-to-content"
        >
          Skip to main content
        </a>

        {/* Top bar with contact info and social links */}
        {variant === 'default' && (contactPhone || contactEmail || socialLinks.length > 0 || jobCount || featuredBadge) && (
          <div className="hidden md:block bg-gray-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-10 text-sm">
                {/* Contact info */}
                <div className="flex items-center gap-6" data-testid="header-contact-info">
                  {contactPhone && (
                    <a
                      href={`tel:${contactPhone}`}
                      className="flex items-center gap-1 text-gray-600 hover:text-primary"
                    >
                      <Icon name="phone" size="xs" />
                      <span>{contactPhone}</span>
                    </a>
                  )}
                  {contactEmail && (
                    <a
                      href={`mailto:${contactEmail}`}
                      className="flex items-center gap-1 text-gray-600 hover:text-primary"
                    >
                      <Icon name="email" size="xs" />
                      <span>{contactEmail}</span>
                    </a>
                  )}
                </div>

                {/* Right side info */}
                <div className="flex items-center gap-4">
                  {/* Job statistics */}
                  {jobCount && (
                    <div className="flex items-center gap-4" data-testid="header-job-count">
                      <Text size="sm" color="muted">
                        {jobCount.total} active jobs
                      </Text>
                      {jobCount.featured && (
                        <Text size="sm" className="text-secondary font-medium">
                          {jobCount.featured} featured
                        </Text>
                      )}
                    </div>
                  )}

                  {/* Featured badge */}
                  {featuredBadge && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                      {featuredBadge}
                    </span>
                  )}

                  {/* Social links */}
                  {socialLinks.length > 0 && (
                    <div className="flex items-center gap-3" data-testid="header-social-links">
                      {socialLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-primary"
                          aria-label={link.label || `Visit our ${link.platform} page`}
                        >
                          <Icon name={getSocialIcon(link.platform)} size="sm" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href={homeUrl} className="flex items-center">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={siteName}
                    className="h-8 w-auto"
                    data-testid="header-logo-image"
                  />
                ) : (
                  <Heading
                    level={1}
                    size="lg"
                    className="text-primary font-bold"
                    data-testid="header-logo-text"
                  >
                    {logoText || siteName}
                  </Heading>
                )}
              </Link>
            </div>

            {/* Desktop Navigation */}
            {!hideNavigation && navigationItems.length > 0 && (
              <div className="hidden md:block">
                <Navigation
                  items={navigationItems}
                  layout="horizontal"
                  type="primary"
                  data-testid="header-navigation"
                />
              </div>
            )}

            {/* Desktop Search */}
            {showSearch && (
              <div className="hidden md:block">
                <form onSubmit={handleSearch} className="relative" role="search">
                  <input
                    type="search"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    aria-label="Search"
                    data-testid="header-search-input"
                  />
                  <Icon
                    name="search"
                    size="sm"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </form>
              </div>
            )}

            {/* Right side - CTA and mobile controls */}
            <div className="flex items-center gap-4">
              {/* CTA Button */}
              {ctaButton && (
                <Button
                  variant={ctaButton.variant || 'primary'}
                  size="medium"
                  href={ctaButton.href}
                  onClick={ctaButton.onClick}
                  className={`min-h-[44px] ${variant === 'landing-page' ? 'animate-pulse' : ''}`}
                  data-testid="header-cta"
                >
                  {ctaButton.text}
                </Button>
              )}

              {/* Mobile controls */}
              <div className="flex items-center gap-2 md:hidden">
                {/* Mobile search toggle */}
                {showSearch && (
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                    aria-label="Toggle search"
                    className="min-h-[44px]"
                    data-testid="mobile-search-toggle"
                  >
                    <Icon name="search" size="base" />
                  </Button>
                )}

                {/* Mobile menu toggle */}
                {!hideNavigation && navigationItems.length > 0 && (
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-expanded={mobileMenuOpen}
                    aria-controls="mobile-navigation"
                    aria-label="Toggle navigation menu"
                    className="min-h-[44px]"
                    data-testid="mobile-menu-toggle"
                  >
                    <Icon name={mobileMenuOpen ? 'x' : 'menu'} size="base" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          {showSearch && mobileSearchOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="search"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary min-h-[44px]"
                    aria-label="Search"
                    data-testid="mobile-search-input"
                  />
                  <Icon
                    name="search"
                    size="sm"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
                <Button
                  variant="primary"
                  size="medium"
                  onClick={handleSearchMobile}
                  className="min-h-[44px]"
                  data-testid="mobile-search-submit"
                >
                  Search
                </Button>
              </div>
            </div>
          )}

          {/* Mobile Navigation */}
          {!hideNavigation && navigationItems.length > 0 && mobileMenuOpen && (
            <div
              id="mobile-navigation"
              className="md:hidden py-4 border-t border-gray-200"
              data-testid="mobile-navigation"
            >
              <Navigation
                items={navigationItems}
                layout="vertical"
                type="primary"
                mobileResponsive={false}
              />
            </div>
          )}
        </div>
      </header>
    )
  }
)

Header.displayName = 'Header'

export default Header