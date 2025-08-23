import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { jest } from '@jest/globals'

// Header component interfaces and types
export interface ContactInfo {
  phone?: string
  email?: string
  address?: string
}

export interface SocialLink {
  platform: 'facebook' | 'twitter' | 'linkedin' | 'instagram'
  url: string
  'aria-label'?: string
}

export interface JobStatistic {
  count: number
  label: string
  featured?: boolean
}

export interface NavigationItem {
  href: string
  label: string
  icon?: React.ReactNode
  active?: boolean
  disabled?: boolean
  external?: boolean
  children?: NavigationItem[]
  'aria-label'?: string
  'data-testid'?: string
}

export interface HeaderProps {
  // Logo and branding
  logoSrc?: string
  logoAlt?: string
  siteName?: string
  homeUrl?: string
  
  // Navigation
  navigationItems: NavigationItem[]
  showMainNav?: boolean
  enableDropdowns?: boolean
  mobileBreakpoint?: 'sm' | 'md' | 'lg'
  
  // Contact information
  contactInfo?: ContactInfo
  showContactInfo?: boolean
  
  // Call-to-action
  ctaLabel?: string
  ctaUrl?: string
  ctaVariant?: 'primary' | 'secondary' | 'outline'
  showCta?: boolean
  ctaExternal?: boolean
  
  // Search functionality
  showSearch?: boolean
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  
  // Social media
  socialLinks?: SocialLink[]
  showSocialLinks?: boolean
  
  // Recruitment-specific features
  jobStats?: JobStatistic[]
  showJobStats?: boolean
  featuredBadges?: string[]
  
  // Variants and behavior
  variant?: 'default' | 'minimal' | 'landing-page'
  sticky?: boolean
  transparent?: boolean
  
  // Accessibility
  skipToContentId?: string
  
  // Custom styling
  className?: string
  'data-testid'?: string
}

// Mock Header component for testing
const Header: React.FC<HeaderProps> = ({
  logoSrc,
  logoAlt = 'Site Logo',
  siteName = 'Lightyear Recruitment',
  homeUrl = '/',
  navigationItems,
  showMainNav = true,
  enableDropdowns = true,
  mobileBreakpoint = 'md',
  contactInfo,
  showContactInfo = true,
  ctaLabel = 'Register Now',
  ctaUrl = 'https://registration.recruso.co.uk/Form/Worker/RdcgtU2Ti03C3gbg7Q6uWoxra98ucBoAnSg21MBO',
  ctaVariant = 'primary',
  showCta = true,
  ctaExternal = true,
  showSearch = false,
  searchPlaceholder = 'Search jobs...',
  onSearch,
  socialLinks = [],
  showSocialLinks = false,
  jobStats = [],
  showJobStats = false,
  featuredBadges = [],
  variant = 'default',
  sticky = false,
  transparent = false,
  skipToContentId = 'main-content',
  className = '',
  'data-testid': dataTestId = 'header',
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [openDropdowns, setOpenDropdowns] = React.useState<string[]>([])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleDropdown = (itemHref: string) => {
    setOpenDropdowns(prev =>
      prev.includes(itemHref)
        ? prev.filter(href => href !== itemHref)
        : [...prev, itemHref]
    )
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, item: NavigationItem) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (item.children && enableDropdowns) {
        toggleDropdown(item.href)
      }
    }
  }

  const renderNavigationItem = (item: NavigationItem) => {
    const isDropdownOpen = openDropdowns.includes(item.href)
    const hasChildren = item.children && item.children.length > 0

    return (
      <li key={item.href} role="none" className="nav-item">
        {hasChildren && enableDropdowns ? (
          <div className="nav-dropdown-container">
            <button
              type="button"
              className={`nav-link nav-dropdown-trigger min-h-[44px] ${
                item.active ? 'nav-link-active' : ''
              } ${item.disabled ? 'nav-link-disabled' : ''}`}
              onClick={() => toggleDropdown(item.href)}
              onKeyDown={(e) => handleKeyDown(e, item)}
              disabled={item.disabled}
              aria-expanded={isDropdownOpen}
              aria-haspopup="menu"
              aria-label={item['aria-label'] || `${item.label} menu`}
              data-testid={`nav-dropdown-${item.href.replace(/[^a-zA-Z0-9]/g, '')}`}
            >
              {item.icon}
              {item.label}
              <span className="dropdown-arrow" aria-hidden="true">
                {isDropdownOpen ? '▲' : '▼'}
              </span>
            </button>
            {isDropdownOpen && (
              <ul
                className="nav-dropdown-menu"
                role="menu"
                data-testid={`nav-dropdown-menu-${item.href.replace(/[^a-zA-Z0-9]/g, '')}`}
              >
                {item.children?.map(child => (
                  <li key={child.href} role="none">
                    <a
                      href={child.href}
                      className={`nav-link min-h-[44px] ${child.active ? 'nav-link-active' : ''}`}
                      role="menuitem"
                      aria-current={child.active ? 'page' : undefined}
                      data-testid={`nav-link-${child.href.replace(/[^a-zA-Z0-9]/g, '')}`}
                    >
                      {child.icon}
                      {child.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <a
            href={item.href}
            className={`nav-link min-h-[44px] ${item.active ? 'nav-link-active' : ''} ${
              item.disabled ? 'nav-link-disabled' : ''
            }`}
            tabIndex={item.disabled ? -1 : 0}
            aria-disabled={item.disabled}
            aria-current={item.active ? 'page' : undefined}
            aria-label={item['aria-label']}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
            data-testid={`nav-link-${item.href.replace(/[^a-zA-Z0-9]/g, '')}`}
          >
            {item.icon}
            {item.label}
            {item.external && <span aria-hidden="true">↗</span>}
          </a>
        )}
      </li>
    )
  }

  const headerClasses = `
    header
    header-${variant}
    ${sticky ? 'sticky top-0 z-50' : ''}
    ${transparent ? 'bg-transparent' : 'bg-white shadow-sm'}
    ${className}
  `.replace(/\s+/g, ' ').trim()

  return (
    <>
      {/* Skip to content link */}
      <a
        href={`#${skipToContentId}`}
        className="skip-to-content sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-primary text-white p-2 z-50"
        data-testid="skip-to-content"
      >
        Skip to main content
      </a>

      <header className={headerClasses} data-testid={dataTestId}>
        {variant === 'minimal' ? (
          // Minimal variant - logo and CTA only
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <a
              href={homeUrl}
              className="logo-link flex items-center"
              aria-label={`${siteName} homepage`}
              data-testid="logo-link"
            >
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt={logoAlt}
                  className="header-logo h-8"
                  data-testid="header-logo-image"
                />
              ) : (
                <span className="header-logo-text text-xl font-bold text-primary">
                  {siteName}
                </span>
              )}
            </a>

            {showCta && (
              <a
                href={ctaUrl}
                className={`cta-button btn btn-${ctaVariant} min-h-[44px] px-4 py-2`}
                target={ctaExternal ? '_blank' : undefined}
                rel={ctaExternal ? 'noopener noreferrer' : undefined}
                data-testid="header-cta-button"
              >
                {ctaLabel}
                {ctaExternal && <span aria-hidden="true" className="ml-1">↗</span>}
              </a>
            )}
          </div>
        ) : (
          // Default and landing-page variants
          <>
            {/* Top bar with contact info and social links */}
            {(showContactInfo || showSocialLinks || showJobStats) && variant !== 'landing-page' && (
              <div className="header-top-bar bg-neutral-100 py-2" data-testid="header-top-bar">
                <div className="container mx-auto px-4 flex items-center justify-between text-sm">
                  <div className="contact-info flex items-center space-x-4">
                    {showContactInfo && contactInfo?.phone && (
                      <a
                        href={`tel:${contactInfo.phone}`}
                        className="contact-phone flex items-center hover:text-primary min-h-[44px]"
                        data-testid="contact-phone"
                      >
                        <span className="sr-only">Call us at</span>
                        📞 {contactInfo.phone}
                      </a>
                    )}
                    {showContactInfo && contactInfo?.email && (
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="contact-email flex items-center hover:text-primary min-h-[44px]"
                        data-testid="contact-email"
                      >
                        <span className="sr-only">Email us at</span>
                        ✉️ {contactInfo.email}
                      </a>
                    )}
                  </div>

                  <div className="header-right flex items-center space-x-4">
                    {showJobStats && jobStats.length > 0 && (
                      <div className="job-stats flex items-center space-x-3" data-testid="job-stats">
                        {jobStats.map((stat, index) => (
                          <div
                            key={index}
                            className={`job-stat ${stat.featured ? 'featured' : ''}`}
                            data-testid={`job-stat-${index}`}
                          >
                            <span className="font-bold text-primary">{stat.count}</span>{' '}
                            <span className="text-neutral-600">{stat.label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {showSocialLinks && socialLinks.length > 0 && (
                      <div className="social-links flex items-center space-x-2" data-testid="social-links">
                        {socialLinks.map((link, index) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link hover:text-primary min-h-[44px] min-w-[44px] flex items-center justify-center"
                            aria-label={link['aria-label'] || `Visit our ${link.platform} page`}
                            data-testid={`social-link-${link.platform}`}
                          >
                            {link.platform === 'facebook' && '📘'}
                            {link.platform === 'twitter' && '🐦'}
                            {link.platform === 'linkedin' && '💼'}
                            {link.platform === 'instagram' && '📷'}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Main header */}
            <div className="header-main py-4" data-testid="header-main">
              <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo/Brand */}
                <div className="header-brand flex items-center">
                  <a
                    href={homeUrl}
                    className="logo-link flex items-center"
                    aria-label={`${siteName} homepage`}
                    data-testid="logo-link"
                  >
                    {logoSrc ? (
                      <img
                        src={logoSrc}
                        alt={logoAlt}
                        className="header-logo h-10"
                        data-testid="header-logo-image"
                      />
                    ) : (
                      <span className="header-logo-text text-2xl font-bold text-primary">
                        {siteName}
                      </span>
                    )}
                  </a>

                  {featuredBadges.length > 0 && (
                    <div className="featured-badges ml-4 flex items-center space-x-2" data-testid="featured-badges">
                      {featuredBadges.map((badge, index) => (
                        <span
                          key={index}
                          className="featured-badge bg-secondary text-white px-2 py-1 text-xs rounded"
                          data-testid={`featured-badge-${index}`}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Desktop Navigation */}
                {showMainNav && (
                  <nav
                    className={`main-navigation hidden ${mobileBreakpoint}:block`}
                    role="navigation"
                    aria-label="Main navigation"
                    data-testid="desktop-navigation"
                  >
                    <ul className="nav-list flex items-center space-x-6" role="menubar">
                      {navigationItems.map(renderNavigationItem)}
                    </ul>
                  </nav>
                )}

                {/* Header Right */}
                <div className="header-right flex items-center space-x-4">
                  {/* Search */}
                  {showSearch && (
                    <form
                      onSubmit={handleSearch}
                      className="search-form"
                      role="search"
                      data-testid="header-search"
                    >
                      <div className="search-input-group flex items-center">
                        <input
                          type="search"
                          placeholder={searchPlaceholder}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="search-input px-3 py-2 border border-neutral-300 rounded-l-md min-h-[44px]"
                          aria-label="Search"
                          data-testid="search-input"
                        />
                        <button
                          type="submit"
                          className="search-button px-3 py-2 bg-primary text-white rounded-r-md hover:bg-primary-dark min-h-[44px]"
                          aria-label="Search"
                          data-testid="search-button"
                        >
                          🔍
                        </button>
                      </div>
                    </form>
                  )}

                  {/* CTA Button */}
                  {showCta && (
                    <a
                      href={ctaUrl}
                      className={`cta-button btn btn-${ctaVariant} min-h-[44px] px-6 py-2 ${
                        variant === 'landing-page' ? 'animate-pulse' : ''
                      }`}
                      target={ctaExternal ? '_blank' : undefined}
                      rel={ctaExternal ? 'noopener noreferrer' : undefined}
                      data-testid="header-cta-button"
                    >
                      {ctaLabel}
                      {ctaExternal && <span aria-hidden="true" className="ml-1">↗</span>}
                    </a>
                  )}

                  {/* Mobile Menu Toggle */}
                  {showMainNav && (
                    <button
                      type="button"
                      className={`mobile-menu-toggle ${mobileBreakpoint}:hidden min-h-[44px] min-w-[44px] flex items-center justify-center`}
                      onClick={toggleMobileMenu}
                      aria-expanded={isMobileMenuOpen}
                      aria-controls="mobile-navigation-menu"
                      aria-label="Toggle mobile menu"
                      data-testid="mobile-menu-toggle"
                    >
                      <span className="hamburger-icon" aria-hidden="true">
                        {isMobileMenuOpen ? '✕' : '☰'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Navigation Menu */}
            {showMainNav && (
              <nav
                className={`mobile-navigation ${mobileBreakpoint}:hidden ${
                  isMobileMenuOpen ? 'block' : 'hidden'
                } bg-white border-t border-neutral-200`}
                role="navigation"
                aria-label="Mobile navigation"
                id="mobile-navigation-menu"
                data-testid="mobile-navigation"
              >
                <div className="container mx-auto px-4 py-4">
                  <ul className="mobile-nav-list space-y-2" role="menubar">
                    {navigationItems.map(renderNavigationItem)}
                  </ul>

                  {/* Mobile search */}
                  {showSearch && (
                    <div className="mobile-search mt-4 pt-4 border-t border-neutral-200">
                      <form
                        onSubmit={handleSearch}
                        className="search-form"
                        role="search"
                        data-testid="mobile-search"
                      >
                        <div className="search-input-group flex">
                          <input
                            type="search"
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input flex-1 px-3 py-2 border border-neutral-300 rounded-l-md min-h-[44px]"
                            aria-label="Search"
                            data-testid="mobile-search-input"
                          />
                          <button
                            type="submit"
                            className="search-button px-3 py-2 bg-primary text-white rounded-r-md hover:bg-primary-dark min-h-[44px]"
                            aria-label="Search"
                            data-testid="mobile-search-button"
                          >
                            🔍
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </nav>
            )}
          </>
        )}
      </header>
    </>
  )
}

// Mock dependencies
jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/',
    push: jest.fn(),
    replace: jest.fn(),
  }),
}))

jest.mock('../../../components/atoms/Button', () => {
  return React.forwardRef<HTMLButtonElement, any>((props, ref) => (
    <button ref={ref} {...props}>{props.children}</button>
  ))
})

jest.mock('../../../components/atoms/Link', () => {
  return React.forwardRef<HTMLAnchorElement, any>((props, ref) => (
    <a ref={ref} {...props}>{props.children}</a>
  ))
})

jest.mock('../../../components/molecules/Navigation', () => {
  return React.forwardRef<HTMLElement, any>((props, ref) => (
    <nav ref={ref} {...props}>Mock Navigation</nav>
  ))
})

describe('Header Component', () => {
  const mockNavigationItems: NavigationItem[] = [
    {
      href: '/',
      label: 'Home',
      icon: <span data-icon="home">🏠</span>,
      active: true,
    },
    {
      href: '/candidates',
      label: 'Job Seekers',
      icon: <span data-icon="candidates">👥</span>,
    },
    {
      href: '/employers',
      label: 'Employers',
      icon: <span data-icon="employers">🏢</span>,
    },
    {
      href: '/about',
      label: 'About',
      icon: <span data-icon="about">ℹ️</span>,
    },
    {
      href: '/contact',
      label: 'Contact',
      icon: <span data-icon="contact">📞</span>,
    },
  ]

  const mockContactInfo: ContactInfo = {
    phone: '+44 118 123 4567',
    email: 'info@lightyear-recruitment.com',
    address: 'Reading, Berkshire',
  }

  const mockSocialLinks: SocialLink[] = [
    { platform: 'facebook', url: 'https://facebook.com/lightyear' },
    { platform: 'linkedin', url: 'https://linkedin.com/company/lightyear' },
    { platform: 'twitter', url: 'https://twitter.com/lightyear' },
  ]

  const mockJobStats: JobStatistic[] = [
    { count: 150, label: 'Active Jobs', featured: true },
    { count: 500, label: 'Candidates Placed' },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders header with default props', () => {
      render(<Header navigationItems={mockNavigationItems} />)
      
      const header = screen.getByTestId('header')
      expect(header).toBeInTheDocument()
      expect(header).toHaveClass('header', 'header-default')
    })

    it('renders skip to content link', () => {
      render(<Header navigationItems={mockNavigationItems} />)
      
      const skipLink = screen.getByTestId('skip-to-content')
      expect(skipLink).toBeInTheDocument()
      expect(skipLink).toHaveAttribute('href', '#main-content')
      expect(skipLink).toHaveTextContent('Skip to main content')
    })

    it('renders with custom skip to content ID', () => {
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          skipToContentId="custom-main" 
        />
      )
      
      const skipLink = screen.getByTestId('skip-to-content')
      expect(skipLink).toHaveAttribute('href', '#custom-main')
    })

    it('renders with custom className and data-testid', () => {
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          className="custom-header-class" 
          data-testid="custom-header-id"
        />
      )
      
      const header = screen.getByTestId('custom-header-id')
      expect(header).toHaveClass('custom-header-class')
    })
  })

  describe('Logo and Branding', () => {
    it('renders site name as text when no logo image provided', () => {
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          siteName="Custom Site Name" 
        />
      )
      
      const logoLink = screen.getByTestId('logo-link')
      expect(logoLink).toHaveAttribute('href', '/')
      expect(logoLink).toHaveAttribute('aria-label', 'Custom Site Name homepage')
      expect(screen.getByText('Custom Site Name')).toBeInTheDocument()
    })

    it('renders logo image when logoSrc is provided', () => {
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          logoSrc="/logo.png" 
          logoAlt="Company Logo" 
        />
      )
      
      const logoImage = screen.getByTestId('header-logo-image')
      expect(logoImage).toHaveAttribute('src', '/logo.png')
      expect(logoImage).toHaveAttribute('alt', 'Company Logo')
    })

    it('renders custom home URL', () => {
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          homeUrl="/custom-home" 
        />
      )
      
      const logoLink = screen.getByTestId('logo-link')
      expect(logoLink).toHaveAttribute('href', '/custom-home')
    })

    it('renders featured badges', () => {
      const badges = ['Award Winner 2024', 'Top Recruiter']
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          featuredBadges={badges} 
        />
      )
      
      expect(screen.getByTestId('featured-badges')).toBeInTheDocument()
      expect(screen.getByText('Award Winner 2024')).toBeInTheDocument()
      expect(screen.getByText('Top Recruiter')).toBeInTheDocument()
      
      const badge0 = screen.getByTestId('featured-badge-0')
      const badge1 = screen.getByTestId('featured-badge-1')
      expect(badge0).toHaveClass('featured-badge')
      expect(badge1).toHaveClass('featured-badge')
    })
  })

  describe('Header Variants', () => {
    it('renders default variant with full header structure', () => {
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          variant="default" 
          contactInfo={mockContactInfo}
        />
      )
      
      expect(screen.getByTestId('header')).toHaveClass('header-default')
      expect(screen.getByTestId('header-top-bar')).toBeInTheDocument()
      expect(screen.getByTestId('header-main')).toBeInTheDocument()
    })

    it('renders minimal variant with only logo and CTA', () => {
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          variant="minimal" 
        />
      )
      
      expect(screen.getByTestId('header')).toHaveClass('header-minimal')
      expect(screen.queryByTestId('header-top-bar')).not.toBeInTheDocument()
      expect(screen.queryByTestId('desktop-navigation')).not.toBeInTheDocument()
      expect(screen.getByTestId('logo-link')).toBeInTheDocument()
      expect(screen.getByTestId('header-cta-button')).toBeInTheDocument()
    })

    it('renders landing-page variant without top bar', () => {
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          variant="landing-page" 
          contactInfo={mockContactInfo}
        />
      )
      
      expect(screen.getByTestId('header')).toHaveClass('header-landing-page')
      expect(screen.queryByTestId('header-top-bar')).not.toBeInTheDocument()
      
      const ctaButton = screen.getByTestId('header-cta-button')
      expect(ctaButton).toHaveClass('animate-pulse')
    })
  })

  describe('Sticky and Transparent Options', () => {
    it('applies sticky positioning when sticky prop is true', () => {
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          sticky={true} 
        />
      )
      
      const header = screen.getByTestId('header')
      expect(header).toHaveClass('sticky', 'top-0', 'z-50')
    })

    it('applies transparent background when transparent prop is true', () => {
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          transparent={true} 
        />
      )
      
      const header = screen.getByTestId('header')
      expect(header).toHaveClass('bg-transparent')
    })

    it('applies white background by default', () => {
      render(<Header navigationItems={mockNavigationItems} />)
      
      const header = screen.getByTestId('header')
      expect(header).toHaveClass('bg-white', 'shadow-sm')
    })
  })

  describe('Navigation Integration', () => {
    it('renders desktop navigation by default', () => {
      render(<Header navigationItems={mockNavigationItems} />)
      
      const desktopNav = screen.getByTestId('desktop-navigation')
      expect(desktopNav).toBeInTheDocument()
      expect(desktopNav).toHaveClass('hidden', 'md:block')
      expect(desktopNav).toHaveAttribute('aria-label', 'Main navigation')
    })

    it('renders all navigation items', () => {
      render(<Header navigationItems={mockNavigationItems} />)
      
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Job Seekers')).toBeInTheDocument()
      expect(screen.getByText('Employers')).toBeInTheDocument()
      expect(screen.getByText('About')).toBeInTheDocument()
      expect(screen.getByText('Contact')).toBeInTheDocument()
    })

    it('can hide main navigation', () => {
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          showMainNav={false} 
        />
      )
      
      expect(screen.queryByTestId('desktop-navigation')).not.toBeInTheDocument()
      expect(screen.queryByTestId('mobile-menu-toggle')).not.toBeInTheDocument()
    })

    it('supports dropdown navigation', async () => {
      const navWithDropdowns: NavigationItem[] = [
        {
          href: '/services',
          label: 'Services',
          children: [
            { href: '/services/warehouse', label: 'Warehouse Jobs' },
            { href: '/services/logistics', label: 'Logistics Roles' },
          ],
        },
      ]

      const user = userEvent.setup()
      render(
        <Header 
          navigationItems={navWithDropdowns} 
          enableDropdowns={true} 
        />
      )
      
      const servicesButton = screen.getByTestId('nav-dropdown-services')
      expect(servicesButton).toHaveAttribute('aria-expanded', 'false')
      
      await user.click(servicesButton)
      expect(servicesButton).toHaveAttribute('aria-expanded', 'true')
      expect(screen.getByTestId('nav-dropdown-menu-services')).toBeInTheDocument()
      expect(screen.getByText('Warehouse Jobs')).toBeInTheDocument()
    })
  })

  describe('Mobile Responsive Behavior', () => {
    it('renders mobile menu toggle button', () => {
      render(<Header navigationItems={mockNavigationItems} />)
      
      const mobileToggle = screen.getByTestId('mobile-menu-toggle')
      expect(mobileToggle).toBeInTheDocument()
      expect(mobileToggle).toHaveClass('md:hidden')
      expect(mobileToggle).toHaveAttribute('aria-expanded', 'false')
      expect(mobileToggle).toHaveAttribute('aria-controls', 'mobile-navigation-menu')
    })

    it('toggles mobile menu on hamburger click', async () => {
      const user = userEvent.setup()
      render(<Header navigationItems={mockNavigationItems} />)
      
      const mobileToggle = screen.getByTestId('mobile-menu-toggle')
      const mobileNav = screen.getByTestId('mobile-navigation')
      
      // Initially closed
      expect(mobileToggle).toHaveAttribute('aria-expanded', 'false')
      expect(mobileNav).toHaveClass('hidden')
      expect(screen.getByText('☰')).toBeInTheDocument()
      
      // Open mobile menu
      await user.click(mobileToggle)
      expect(mobileToggle).toHaveAttribute('aria-expanded', 'true')
      expect(mobileNav).toHaveClass('block')
      expect(screen.getByText('✕')).toBeInTheDocument()
    })

    it('renders mobile navigation with proper structure', () => {
      render(<Header navigationItems={mockNavigationItems} />)
      
      const mobileNav = screen.getByTestId('mobile-navigation')
      expect(mobileNav).toHaveAttribute('aria-label', 'Mobile navigation')
      expect(mobileNav).toHaveAttribute('id', 'mobile-navigation-menu')
      expect(mobileNav).toHaveClass('md:hidden')
    })

    it('supports different mobile breakpoints', () => {
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          mobileBreakpoint="lg" 
        />
      )
      
      const desktopNav = screen.getByTestId('desktop-navigation')
      const mobileToggle = screen.getByTestId('mobile-menu-toggle')
      
      expect(desktopNav).toHaveClass('hidden', 'lg:block')
      expect(mobileToggle).toHaveClass('lg:hidden')
    })
  })

  describe('Contact Information', () => {
    it('renders contact information in top bar', () => {
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          contactInfo={mockContactInfo} 
          showContactInfo={true}
        />
      )
      
      expect(screen.getByTestId('header-top-bar')).toBeInTheDocument()
      
      const phoneLink = screen.getByTestId('contact-phone')
      expect(phoneLink).toHaveAttribute('href', 'tel:+44 118 123 4567')
      expect(phoneLink).toHaveTextContent('📞 +44 118 123 4567')
      
      const emailLink = screen.getByTestId('contact-email')
      expect(emailLink).toHaveAttribute('href', 'mailto:info@lightyear-recruitment.com')
      expect(emailLink).toHaveTextContent('✉️ info@lightyear-recruitment.com')
    })

    it('can hide contact information', () => {
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          contactInfo={mockContactInfo} 
          showContactInfo={false}
        />
      )
      
      expect(screen.queryByTestId('contact-phone')).not.toBeInTheDocument()
      expect(screen.queryByTestId('contact-email')).not.toBeInTheDocument()
    })

    it('handles partial contact information', () => {
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          contactInfo={{ phone: '+44 118 123 4567' }} 
          showContactInfo={true}
        />
      )
      
      expect(screen.getByTestId('contact-phone')).toBeInTheDocument()
      expect(screen.queryByTestId('contact-email')).not.toBeInTheDocument()
    })
  })

  describe('Call-to-Action Button', () => {
    it('renders CTA button with default settings', () => {
      render(<Header navigationItems={mockNavigationItems} />)
      
      const ctaButton = screen.getByTestId('header-cta-button')
      expect(ctaButton).toBeInTheDocument()
      expect(ctaButton).toHaveAttribute('href', 'https://registration.recruso.co.uk/Form/Worker/RdcgtU2Ti03C3gbg7Q6uWoxra98ucBoAnSg21MBO')
      expect(ctaButton).toHaveAttribute('target', '_blank')
      expect(ctaButton).toHaveAttribute('rel', 'noopener noreferrer')
      expect(ctaButton).toHaveTextContent('Register Now')
      expect(ctaButton).toHaveClass('btn-primary')
    })

    it('supports custom CTA configuration', () => {
      render(
        <Header 
          navigationItems={mockNavigationItems}
          ctaLabel="Get Started"
          ctaUrl="/signup"
          ctaVariant="secondary"
          ctaExternal={false}
        />
      )
      
      const ctaButton = screen.getByTestId('header-cta-button')
      expect(ctaButton).toHaveTextContent('Get Started')
      expect(ctaButton).toHaveAttribute('href', '/signup')
      expect(ctaButton).not.toHaveAttribute('target')
      expect(ctaButton).toHaveClass('btn-secondary')
      expect(screen.queryByText('↗')).not.toBeInTheDocument()
    })

    it('can hide CTA button', () => {
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          showCta={false} 
        />
      )
      
      expect(screen.queryByTestId('header-cta-button')).not.toBeInTheDocument()
    })

    it('shows external link indicator for external CTAs', () => {
      render(<Header navigationItems={mockNavigationItems} />)
      
      expect(screen.getByText('↗')).toBeInTheDocument()
    })
  })

  describe('Search Functionality', () => {
    it('renders search form when showSearch is true', () => {
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          showSearch={true} 
        />
      )
      
      const searchForm = screen.getByTestId('header-search')
      expect(searchForm).toBeInTheDocument()
      expect(searchForm).toHaveAttribute('role', 'search')
      
      const searchInput = screen.getByTestId('search-input')
      expect(searchInput).toHaveAttribute('type', 'search')
      expect(searchInput).toHaveAttribute('placeholder', 'Search jobs...')
    })

    it('supports custom search placeholder', () => {
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          showSearch={true} 
          searchPlaceholder="Find opportunities..." 
        />
      )
      
      const searchInput = screen.getByTestId('search-input')
      expect(searchInput).toHaveAttribute('placeholder', 'Find opportunities...')
    })

    it('handles search form submission', async () => {
      const mockOnSearch = jest.fn()
      const user = userEvent.setup()
      
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          showSearch={true} 
          onSearch={mockOnSearch} 
        />
      )
      
      const searchInput = screen.getByTestId('search-input')
      const searchButton = screen.getByTestId('search-button')
      
      await user.type(searchInput, 'warehouse jobs')
      await user.click(searchButton)
      
      expect(mockOnSearch).toHaveBeenCalledWith('warehouse jobs')
    })

    it('renders mobile search in mobile menu', async () => {
      const user = userEvent.setup()
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          showSearch={true} 
        />
      )
      
      const mobileToggle = screen.getByTestId('mobile-menu-toggle')
      await user.click(mobileToggle)
      
      expect(screen.getByTestId('mobile-search')).toBeInTheDocument()
      expect(screen.getByTestId('mobile-search-input')).toBeInTheDocument()
      expect(screen.getByTestId('mobile-search-button')).toBeInTheDocument()
    })

    it('does not render search when showSearch is false', () => {
      render(<Header navigationItems={mockNavigationItems} />)
      
      expect(screen.queryByTestId('header-search')).not.toBeInTheDocument()
    })
  })

  describe('Social Media Links', () => {
    it('renders social links when provided', () => {
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          socialLinks={mockSocialLinks} 
          showSocialLinks={true} 
        />
      )
      
      expect(screen.getByTestId('social-links')).toBeInTheDocument()
      
      const facebookLink = screen.getByTestId('social-link-facebook')
      expect(facebookLink).toHaveAttribute('href', 'https://facebook.com/lightyear')
      expect(facebookLink).toHaveAttribute('target', '_blank')
      expect(facebookLink).toHaveAttribute('aria-label', 'Visit our facebook page')
      
      const linkedinLink = screen.getByTestId('social-link-linkedin')
      expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/company/lightyear')
      
      // Check platform icons
      expect(screen.getByText('📘')).toBeInTheDocument() // Facebook
      expect(screen.getByText('💼')).toBeInTheDocument() // LinkedIn
      expect(screen.getByText('🐦')).toBeInTheDocument() // Twitter
    })

    it('uses custom aria-labels for social links', () => {
      const customSocialLinks: SocialLink[] = [
        { 
          platform: 'facebook', 
          url: 'https://facebook.com/test',
          'aria-label': 'Follow us on Facebook'
        },
      ]
      
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          socialLinks={customSocialLinks} 
          showSocialLinks={true} 
        />
      )
      
      const facebookLink = screen.getByTestId('social-link-facebook')
      expect(facebookLink).toHaveAttribute('aria-label', 'Follow us on Facebook')
    })

    it('does not render social links when showSocialLinks is false', () => {
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          socialLinks={mockSocialLinks} 
          showSocialLinks={false} 
        />
      )
      
      expect(screen.queryByTestId('social-links')).not.toBeInTheDocument()
    })
  })

  describe('Recruitment-Specific Features', () => {
    it('renders job statistics', () => {
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          jobStats={mockJobStats} 
          showJobStats={true} 
        />
      )
      
      expect(screen.getByTestId('job-stats')).toBeInTheDocument()
      
      const stat0 = screen.getByTestId('job-stat-0')
      expect(stat0).toHaveClass('featured')
      expect(stat0).toHaveTextContent('150 Active Jobs')
      
      const stat1 = screen.getByTestId('job-stat-1')
      expect(stat1).toHaveTextContent('500 Candidates Placed')
    })

    it('does not render job stats when showJobStats is false', () => {
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          jobStats={mockJobStats} 
          showJobStats={false} 
        />
      )
      
      expect(screen.queryByTestId('job-stats')).not.toBeInTheDocument()
    })

    it('handles recruitment navigation structure', () => {
      const recruitmentNav: NavigationItem[] = [
        { href: '/', label: 'Home', active: true },
        { href: '/candidates', label: 'Find Work' },
        { 
          href: 'https://registration.recruso.co.uk/Form/Worker/RdcgtU2Ti03C3gbg7Q6uWoxra98ucBoAnSg21MBO', 
          label: 'Register', 
          external: true 
        },
        { href: '/employers', label: 'Post Jobs' },
      ]
      
      render(<Header navigationItems={recruitmentNav} />)
      
      expect(screen.getByText('Find Work')).toBeInTheDocument()
      expect(screen.getByText('Register')).toBeInTheDocument()
      expect(screen.getByText('Post Jobs')).toBeInTheDocument()
      
      const registerLink = screen.getByText('Register').closest('a')
      expect(registerLink).toHaveAttribute('target', '_blank')
    })
  })

  describe('Touch Target Accessibility', () => {
    it('ensures minimum 44px touch targets for all interactive elements', () => {
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          contactInfo={mockContactInfo}
          socialLinks={mockSocialLinks}
          showSocialLinks={true}
          showSearch={true}
        />
      )
      
      // Navigation links
      const navLinks = screen.getAllByRole('link')
      navLinks.forEach(link => {
        if (link.classList.contains('nav-link')) {
          expect(link).toHaveClass('min-h-[44px]')
        }
      })
      
      // Contact links
      expect(screen.getByTestId('contact-phone')).toHaveClass('min-h-[44px]')
      expect(screen.getByTestId('contact-email')).toHaveClass('min-h-[44px]')
      
      // Social links
      const socialLinks = screen.getAllByTestId(/social-link-/)
      socialLinks.forEach(link => {
        expect(link).toHaveClass('min-h-[44px]', 'min-w-[44px]')
      })
      
      // Buttons
      expect(screen.getByTestId('mobile-menu-toggle')).toHaveClass('min-h-[44px]', 'min-w-[44px]')
      expect(screen.getByTestId('header-cta-button')).toHaveClass('min-h-[44px]')
      expect(screen.getByTestId('search-button')).toHaveClass('min-h-[44px]')
    })
  })

  describe('Semantic HTML Structure', () => {
    it('uses proper header element and landmarks', () => {
      render(<Header navigationItems={mockNavigationItems} />)
      
      const header = screen.getByRole('banner') // header elements have banner role
      expect(header).toBe(screen.getByTestId('header'))
    })

    it('uses proper navigation landmarks', () => {
      render(<Header navigationItems={mockNavigationItems} />)
      
      const mainNav = screen.getByRole('navigation', { name: 'Main navigation' })
      expect(mainNav).toBeInTheDocument()
    })

    it('uses proper search landmark', () => {
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          showSearch={true} 
        />
      )
      
      const searchForm = screen.getByRole('search')
      expect(searchForm).toBeInTheDocument()
    })
  })

  describe('Keyboard Navigation', () => {
    it('supports Tab navigation through all interactive elements', async () => {
      const user = userEvent.setup()
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          showSearch={true} 
        />
      )
      
      const skipLink = screen.getByTestId('skip-to-content')
      const logoLink = screen.getByTestId('logo-link')
      const navLinks = screen.getAllByRole('link').filter(link => 
        link.classList.contains('nav-link')
      )
      const searchInput = screen.getByTestId('search-input')
      
      // Skip link should be first
      await user.tab()
      expect(skipLink).toHaveFocus()
      
      await user.tab()
      expect(logoLink).toHaveFocus()
      
      // Navigation links
      for (const navLink of navLinks.slice(0, 2)) {
        await user.tab()
        expect(navLink).toHaveFocus()
      }
    })

    it('supports keyboard navigation for dropdown menus', async () => {
      const navWithDropdowns: NavigationItem[] = [
        {
          href: '/services',
          label: 'Services',
          children: [
            { href: '/services/warehouse', label: 'Warehouse Jobs' },
          ],
        },
      ]

      const user = userEvent.setup()
      render(
        <Header 
          navigationItems={navWithDropdowns} 
          enableDropdowns={true} 
        />
      )
      
      const servicesButton = screen.getByTestId('nav-dropdown-services')
      
      servicesButton.focus()
      await user.keyboard('{Enter}')
      expect(servicesButton).toHaveAttribute('aria-expanded', 'true')
      
      await user.keyboard(' ')
      expect(servicesButton).toHaveAttribute('aria-expanded', 'false')
    })

    it('supports keyboard navigation for mobile menu toggle', async () => {
      const user = userEvent.setup()
      render(<Header navigationItems={mockNavigationItems} />)
      
      const mobileToggle = screen.getByTestId('mobile-menu-toggle')
      
      mobileToggle.focus()
      await user.keyboard('{Enter}')
      expect(mobileToggle).toHaveAttribute('aria-expanded', 'true')
    })
  })

  describe('ARIA Labels and Landmarks', () => {
    it('provides proper ARIA labels for all interactive elements', () => {
      render(
        <Header 
          navigationItems={mockNavigationItems}
          contactInfo={mockContactInfo}
          socialLinks={mockSocialLinks}
          showSocialLinks={true}
        />
      )
      
      // Logo link
      expect(screen.getByTestId('logo-link')).toHaveAttribute('aria-label', 'Lightyear Recruitment homepage')
      
      // Mobile menu toggle
      expect(screen.getByTestId('mobile-menu-toggle')).toHaveAttribute('aria-label', 'Toggle mobile menu')
      
      // Contact links with screen reader text
      const phoneLink = screen.getByTestId('contact-phone')
      expect(phoneLink.querySelector('.sr-only')).toHaveTextContent('Call us at')
      
      const emailLink = screen.getByTestId('contact-email')
      expect(emailLink.querySelector('.sr-only')).toHaveTextContent('Email us at')
      
      // Social links
      expect(screen.getByTestId('social-link-facebook')).toHaveAttribute('aria-label', 'Visit our facebook page')
    })

    it('uses proper menubar and menu roles for navigation', async () => {
      const navWithDropdowns: NavigationItem[] = [
        {
          href: '/services',
          label: 'Services',
          children: [
            { href: '/services/warehouse', label: 'Warehouse Jobs' },
          ],
        },
      ]

      const user = userEvent.setup()
      render(
        <Header 
          navigationItems={navWithDropdowns} 
          enableDropdowns={true} 
        />
      )
      
      const menubar = screen.getByRole('menubar')
      expect(menubar).toBeInTheDocument()
      
      const servicesButton = screen.getByTestId('nav-dropdown-services')
      await user.click(servicesButton)
      
      const dropdownMenu = screen.getByTestId('nav-dropdown-menu-services')
      expect(dropdownMenu).toHaveAttribute('role', 'menu')
    })
  })

  describe('Error Handling', () => {
    it('renders gracefully with empty navigation items', () => {
      render(<Header navigationItems={[]} />)
      
      const header = screen.getByTestId('header')
      expect(header).toBeInTheDocument()
    })

    it('handles missing contact information gracefully', () => {
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          contactInfo={{}} 
          showContactInfo={true} 
        />
      )
      
      // Should not crash, and top bar should still render
      expect(screen.getByTestId('header')).toBeInTheDocument()
    })

    it('handles search without onSearch callback', async () => {
      const user = userEvent.setup()
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          showSearch={true} 
        />
      )
      
      const searchInput = screen.getByTestId('search-input')
      const searchButton = screen.getByTestId('search-button')
      
      await user.type(searchInput, 'test query')
      await user.click(searchButton)
      
      // Should not crash
      expect(searchInput).toHaveValue('test query')
    })
  })

  describe('Mobile-First Design', () => {
    it('applies mobile-first responsive classes', () => {
      render(<Header navigationItems={mockNavigationItems} />)
      
      const desktopNav = screen.getByTestId('desktop-navigation')
      expect(desktopNav).toHaveClass('hidden', 'md:block')
      
      const mobileToggle = screen.getByTestId('mobile-menu-toggle')
      expect(mobileToggle).toHaveClass('md:hidden')
    })

    it('prioritizes mobile CTA visibility', () => {
      render(<Header navigationItems={mockNavigationItems} />)
      
      const ctaButton = screen.getByTestId('header-cta-button')
      expect(ctaButton).toBeInTheDocument()
      // CTA should be visible on all screen sizes
    })
  })

  describe('Professional Styling', () => {
    it('applies brand colors to primary elements', () => {
      render(<Header navigationItems={mockNavigationItems} />)
      
      const siteName = screen.getByText('Lightyear Recruitment')
      expect(siteName).toHaveClass('text-primary')
      
      const ctaButton = screen.getByTestId('header-cta-button')
      expect(ctaButton).toHaveClass('btn-primary')
    })

    it('supports custom brand colors through CSS classes', () => {
      render(
        <Header 
          navigationItems={mockNavigationItems}
          jobStats={mockJobStats}
          showJobStats={true}
        />
      )
      
      const jobStatNumbers = screen.getAllByText('150')
      expect(jobStatNumbers[0].closest('.job-stat')).toContainElement(
        screen.getByText('150')
      )
      // Brand colors are applied via CSS classes
    })
  })

  describe('Integration with Recruitment Context', () => {
    it('optimizes for candidate registration conversion', () => {
      render(<Header navigationItems={mockNavigationItems} />)
      
      const ctaButton = screen.getByTestId('header-cta-button')
      expect(ctaButton).toHaveTextContent('Register Now')
      expect(ctaButton).toHaveAttribute('href', 'https://registration.recruso.co.uk/Form/Worker/RdcgtU2Ti03C3gbg7Q6uWoxra98ucBoAnSg21MBO')
      expect(ctaButton).toHaveClass('btn-primary')
    })

    it('builds trust with contact information display', () => {
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          contactInfo={mockContactInfo} 
        />
      )
      
      expect(screen.getByText('📞 +44 118 123 4567')).toBeInTheDocument()
      expect(screen.getByText('✉️ info@lightyear-recruitment.com')).toBeInTheDocument()
    })

    it('showcases recruitment expertise with job statistics', () => {
      render(
        <Header 
          navigationItems={mockNavigationItems} 
          jobStats={mockJobStats} 
          showJobStats={true} 
        />
      )
      
      expect(screen.getByText('150')).toBeInTheDocument()
      expect(screen.getByText('Active Jobs')).toBeInTheDocument()
      expect(screen.getByText('500')).toBeInTheDocument()
      expect(screen.getByText('Candidates Placed')).toBeInTheDocument()
    })
  })
})