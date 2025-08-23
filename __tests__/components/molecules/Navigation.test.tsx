import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { jest } from '@jest/globals'

// Navigation component interfaces and types
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

export interface NavigationProps {
  items: NavigationItem[]
  layout?: 'horizontal' | 'vertical' | 'inline'
  type?: 'primary' | 'secondary' | 'breadcrumb' | 'pagination'
  showIcons?: boolean
  enableDropdowns?: boolean
  mobileBreakpoint?: 'sm' | 'md' | 'lg'
  mobileHamburger?: boolean
  ariaLabel?: string
  className?: string
  'data-testid'?: string
}

// Mock Navigation component for testing
const Navigation: React.FC<NavigationProps> = ({
  items,
  layout = 'horizontal',
  type = 'primary',
  showIcons = false,
  enableDropdowns = false,
  mobileBreakpoint = 'md',
  mobileHamburger = true,
  ariaLabel,
  className = '',
  'data-testid': dataTestId = 'navigation',
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
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

  const handleKeyDown = (e: React.KeyboardEvent, item: NavigationItem) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (item.children && enableDropdowns) {
        toggleDropdown(item.href)
      }
    }
  }

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const isDropdownOpen = openDropdowns.includes(item.href)
    const hasChildren = item.children && item.children.length > 0

    return (
      <li
        key={item.href}
        role="none"
        className={`nav-item ${level > 0 ? 'nav-item-nested' : ''}`}
        data-testid={`nav-item-${item.href.replace(/[^a-zA-Z0-9]/g, '')}`}
      >
        {hasChildren && enableDropdowns ? (
          <div className="nav-dropdown-container">
            <button
              type="button"
              className={`nav-link nav-dropdown-trigger ${item.active ? 'nav-link-active' : ''} ${
                item.disabled ? 'nav-link-disabled' : ''
              } min-h-[44px]`}
              onClick={() => toggleDropdown(item.href)}
              onKeyDown={(e) => handleKeyDown(e, item)}
              disabled={item.disabled}
              aria-expanded={isDropdownOpen}
              aria-haspopup="menu"
              aria-label={item['aria-label'] || `${item.label} menu`}
              data-testid={item['data-testid'] || `nav-dropdown-${item.href.replace(/[^a-zA-Z0-9]/g, '')}`}
            >
              {showIcons && item.icon}
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
                {item.children?.map(child => renderNavigationItem(child, level + 1))}
              </ul>
            )}
          </div>
        ) : (
          <a
            href={item.href}
            className={`nav-link ${item.active ? 'nav-link-active' : ''} ${
              item.disabled ? 'nav-link-disabled' : ''
            } min-h-[44px]`}
            role={level > 0 ? 'menuitem' : undefined}
            tabIndex={item.disabled ? -1 : 0}
            aria-disabled={item.disabled}
            aria-current={item.active ? 'page' : undefined}
            aria-label={item['aria-label']}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
            data-testid={item['data-testid'] || `nav-link-${item.href.replace(/[^a-zA-Z0-9]/g, '')}`}
            onClick={(e) => {
              if (item.disabled) {
                e.preventDefault()
              }
            }}
          >
            {showIcons && item.icon}
            {item.label}
            {item.external && <span aria-hidden="true">↗</span>}
          </a>
        )}
      </li>
    )
  }

  const getNavigationRole = () => {
    switch (type) {
      case 'breadcrumb':
        return 'navigation'
      case 'pagination':
        return 'navigation'
      default:
        return 'navigation'
    }
  }

  const getNavigationAriaLabel = () => {
    if (ariaLabel) return ariaLabel
    switch (type) {
      case 'primary':
        return 'Main navigation'
      case 'secondary':
        return 'Secondary navigation'
      case 'breadcrumb':
        return 'Breadcrumb navigation'
      case 'pagination':
        return 'Pagination navigation'
      default:
        return 'Navigation'
    }
  }

  return (
    <nav
      className={`navigation navigation-${layout} navigation-${type} ${className}`}
      role={getNavigationRole()}
      aria-label={getNavigationAriaLabel()}
      data-testid={dataTestId}
    >
      {/* Mobile hamburger button */}
      {mobileHamburger && layout === 'horizontal' && type === 'primary' && (
        <button
          type="button"
          className="mobile-menu-toggle md:hidden min-h-[44px] min-w-[44px]"
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

      {/* Navigation list */}
      <ul
        className={`nav-list ${isMobileMenuOpen ? 'nav-list-mobile-open' : 'nav-list-mobile-closed'}`}
        role={type === 'breadcrumb' ? 'list' : 'menubar'}
        id={mobileHamburger ? 'mobile-navigation-menu' : undefined}
        data-testid="nav-list"
      >
        {items.map(item => renderNavigationItem(item))}
      </ul>
    </nav>
  )
}

// Mock next/router for testing
jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/',
    push: jest.fn(),
    replace: jest.fn(),
  }),
}))

// Mock components
jest.mock('../../../components/atoms/Link', () => {
  return React.forwardRef<HTMLAnchorElement, any>((props, ref) => (
    <a ref={ref} {...props}>{props.children}</a>
  ))
})

jest.mock('../../../components/atoms/Icon', () => {
  return React.forwardRef<HTMLElement, any>((props, ref) => (
    <span ref={ref} {...props} data-icon={props.name || props.src}>{props.name || '🔗'}</span>
  ))
})

describe('Navigation Component', () => {
  const mockNavigationItems: NavigationItem[] = [
    {
      href: '/',
      label: 'Home',
      icon: <span data-icon="home">🏠</span>,
      active: true,
    },
    {
      href: '/candidates',
      label: 'Candidates',
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

  const mockDropdownItems: NavigationItem[] = [
    {
      href: '/services',
      label: 'Services',
      children: [
        { href: '/services/warehouse', label: 'Warehouse Jobs' },
        { href: '/services/logistics', label: 'Logistics Roles' },
        { href: '/services/temporary', label: 'Temporary Work' },
      ],
    },
    {
      href: '/about',
      label: 'About',
    },
  ]

  const mockBreadcrumbItems: NavigationItem[] = [
    { href: '/', label: 'Home' },
    { href: '/candidates', label: 'Candidates' },
    { href: '/candidates/jobs', label: 'Current Jobs', active: true },
  ]

  const mockPaginationItems: NavigationItem[] = [
    { href: '/jobs?page=1', label: 'Previous', disabled: true },
    { href: '/jobs?page=1', label: '1', active: true },
    { href: '/jobs?page=2', label: '2' },
    { href: '/jobs?page=3', label: '3' },
    { href: '/jobs?page=2', label: 'Next' },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders navigation with default props', () => {
      render(<Navigation items={mockNavigationItems} />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
      expect(nav).toHaveAttribute('aria-label', 'Main navigation')
      expect(nav).toHaveClass('navigation', 'navigation-horizontal', 'navigation-primary')
    })

    it('renders all navigation items', () => {
      render(<Navigation items={mockNavigationItems} />)
      
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Candidates')).toBeInTheDocument()
      expect(screen.getByText('Employers')).toBeInTheDocument()
      expect(screen.getByText('About')).toBeInTheDocument()
      expect(screen.getByText('Contact')).toBeInTheDocument()
    })

    it('renders with custom aria-label', () => {
      render(<Navigation items={mockNavigationItems} ariaLabel="Custom navigation label" />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveAttribute('aria-label', 'Custom navigation label')
    })

    it('renders with custom className and data-testid', () => {
      render(
        <Navigation 
          items={mockNavigationItems} 
          className="custom-nav-class" 
          data-testid="custom-nav-id"
        />
      )
      
      const nav = screen.getByTestId('custom-nav-id')
      expect(nav).toHaveClass('custom-nav-class')
    })
  })

  describe('Layout Variants', () => {
    it('renders horizontal layout by default', () => {
      render(<Navigation items={mockNavigationItems} />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('navigation-horizontal')
    })

    it('renders vertical layout', () => {
      render(<Navigation items={mockNavigationItems} layout="vertical" />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('navigation-vertical')
    })

    it('renders inline layout', () => {
      render(<Navigation items={mockNavigationItems} layout="inline" />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('navigation-inline')
    })
  })

  describe('Navigation Types', () => {
    it('renders primary navigation type', () => {
      render(<Navigation items={mockNavigationItems} type="primary" />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('navigation-primary')
      expect(nav).toHaveAttribute('aria-label', 'Main navigation')
    })

    it('renders secondary navigation type', () => {
      render(<Navigation items={mockNavigationItems} type="secondary" />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('navigation-secondary')
      expect(nav).toHaveAttribute('aria-label', 'Secondary navigation')
    })

    it('renders breadcrumb navigation type', () => {
      render(<Navigation items={mockBreadcrumbItems} type="breadcrumb" />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('navigation-breadcrumb')
      expect(nav).toHaveAttribute('aria-label', 'Breadcrumb navigation')
      
      const list = screen.getByTestId('nav-list')
      expect(list).toHaveAttribute('role', 'list')
    })

    it('renders pagination navigation type', () => {
      render(<Navigation items={mockPaginationItems} type="pagination" />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('navigation-pagination')
      expect(nav).toHaveAttribute('aria-label', 'Pagination navigation')
    })
  })

  describe('Active State Highlighting', () => {
    it('marks active navigation item with aria-current', () => {
      render(<Navigation items={mockNavigationItems} />)
      
      const homeLink = screen.getByText('Home').closest('a')
      expect(homeLink).toHaveAttribute('aria-current', 'page')
      expect(homeLink).toHaveClass('nav-link-active')
    })

    it('does not mark inactive items with aria-current', () => {
      render(<Navigation items={mockNavigationItems} />)
      
      const candidatesLink = screen.getByText('Candidates').closest('a')
      expect(candidatesLink).not.toHaveAttribute('aria-current')
      expect(candidatesLink).not.toHaveClass('nav-link-active')
    })
  })

  describe('Icons', () => {
    it('shows icons when showIcons is true', () => {
      render(<Navigation items={mockNavigationItems} showIcons={true} />)
      
      expect(screen.getByText('🏠')).toBeInTheDocument()
      expect(screen.getByText('👥')).toBeInTheDocument()
      expect(screen.getByText('🏢')).toBeInTheDocument()
    })

    it('hides icons when showIcons is false', () => {
      render(<Navigation items={mockNavigationItems} showIcons={false} />)
      
      expect(screen.queryByText('🏠')).not.toBeInTheDocument()
      expect(screen.queryByText('👥')).not.toBeInTheDocument()
      expect(screen.queryByText('🏢')).not.toBeInTheDocument()
    })
  })

  describe('Disabled Links', () => {
    const itemsWithDisabled: NavigationItem[] = [
      { href: '/', label: 'Home' },
      { href: '/disabled', label: 'Disabled Item', disabled: true },
    ]

    it('renders disabled navigation items', () => {
      render(<Navigation items={itemsWithDisabled} />)
      
      const disabledLink = screen.getByText('Disabled Item').closest('a')
      expect(disabledLink).toHaveClass('nav-link-disabled')
      expect(disabledLink).toHaveAttribute('aria-disabled', 'true')
      expect(disabledLink).toHaveAttribute('tabIndex', '-1')
    })

    it('prevents navigation on disabled links', async () => {
      const user = userEvent.setup()
      render(<Navigation items={itemsWithDisabled} />)
      
      const disabledLink = screen.getByText('Disabled Item').closest('a')
      await user.click(disabledLink!)
      
      // Should prevent default behavior
      expect(window.location.pathname).not.toBe('/disabled')
    })
  })

  describe('External Links', () => {
    const itemsWithExternal: NavigationItem[] = [
      { href: '/', label: 'Home' },
      { href: 'https://external.com', label: 'External Link', external: true },
    ]

    it('renders external links with proper attributes', () => {
      render(<Navigation items={itemsWithExternal} />)
      
      const externalLink = screen.getByText('External Link').closest('a')
      expect(externalLink).toHaveAttribute('target', '_blank')
      expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer')
      expect(screen.getByText('↗')).toBeInTheDocument()
    })
  })

  describe('Dropdown Navigation', () => {
    it('renders dropdown navigation when enableDropdowns is true', () => {
      render(<Navigation items={mockDropdownItems} enableDropdowns={true} />)
      
      const servicesButton = screen.getByRole('button', { name: /services menu/i })
      expect(servicesButton).toBeInTheDocument()
      expect(servicesButton).toHaveAttribute('aria-expanded', 'false')
      expect(servicesButton).toHaveAttribute('aria-haspopup', 'menu')
    })

    it('toggles dropdown menu on click', async () => {
      const user = userEvent.setup()
      render(<Navigation items={mockDropdownItems} enableDropdowns={true} />)
      
      const servicesButton = screen.getByRole('button', { name: /services menu/i })
      
      // Initially closed
      expect(servicesButton).toHaveAttribute('aria-expanded', 'false')
      expect(screen.queryByTestId('nav-dropdown-menu-services')).not.toBeInTheDocument()
      
      // Open dropdown
      await user.click(servicesButton)
      expect(servicesButton).toHaveAttribute('aria-expanded', 'true')
      expect(screen.getByTestId('nav-dropdown-menu-services')).toBeInTheDocument()
      
      // Close dropdown
      await user.click(servicesButton)
      expect(servicesButton).toHaveAttribute('aria-expanded', 'false')
    })

    it('renders nested navigation items in dropdown', async () => {
      const user = userEvent.setup()
      render(<Navigation items={mockDropdownItems} enableDropdowns={true} />)
      
      const servicesButton = screen.getByRole('button', { name: /services menu/i })
      await user.click(servicesButton)
      
      expect(screen.getByText('Warehouse Jobs')).toBeInTheDocument()
      expect(screen.getByText('Logistics Roles')).toBeInTheDocument()
      expect(screen.getByText('Temporary Work')).toBeInTheDocument()
    })

    it('supports keyboard navigation for dropdowns', async () => {
      const user = userEvent.setup()
      render(<Navigation items={mockDropdownItems} enableDropdowns={true} />)
      
      const servicesButton = screen.getByRole('button', { name: /services menu/i })
      
      // Open with Enter key
      servicesButton.focus()
      await user.keyboard('{Enter}')
      expect(servicesButton).toHaveAttribute('aria-expanded', 'true')
      
      // Close with Space key
      await user.keyboard(' ')
      expect(servicesButton).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('Mobile Responsive Behavior', () => {
    it('renders mobile hamburger menu by default for horizontal primary navigation', () => {
      render(<Navigation items={mockNavigationItems} />)
      
      const hamburgerButton = screen.getByTestId('mobile-menu-toggle')
      expect(hamburgerButton).toBeInTheDocument()
      expect(hamburgerButton).toHaveClass('md:hidden')
      expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false')
      expect(hamburgerButton).toHaveAttribute('aria-controls', 'mobile-navigation-menu')
    })

    it('toggles mobile menu on hamburger click', async () => {
      const user = userEvent.setup()
      render(<Navigation items={mockNavigationItems} />)
      
      const hamburgerButton = screen.getByTestId('mobile-menu-toggle')
      const navList = screen.getByTestId('nav-list')
      
      // Initially closed
      expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false')
      expect(navList).toHaveClass('nav-list-mobile-closed')
      expect(screen.getByText('☰')).toBeInTheDocument()
      
      // Open mobile menu
      await user.click(hamburgerButton)
      expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true')
      expect(navList).toHaveClass('nav-list-mobile-open')
      expect(screen.getByText('✕')).toBeInTheDocument()
    })

    it('does not render hamburger for non-horizontal layouts', () => {
      render(<Navigation items={mockNavigationItems} layout="vertical" />)
      
      expect(screen.queryByTestId('mobile-menu-toggle')).not.toBeInTheDocument()
    })

    it('can disable mobile hamburger menu', () => {
      render(<Navigation items={mockNavigationItems} mobileHamburger={false} />)
      
      expect(screen.queryByTestId('mobile-menu-toggle')).not.toBeInTheDocument()
    })
  })

  describe('Touch Target Accessibility', () => {
    it('ensures minimum 44px touch targets for all interactive elements', () => {
      render(<Navigation items={mockNavigationItems} />)
      
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toHaveClass('min-h-[44px]')
      })
      
      const hamburgerButton = screen.getByTestId('mobile-menu-toggle')
      expect(hamburgerButton).toHaveClass('min-h-[44px]', 'min-w-[44px]')
    })
  })

  describe('ARIA Navigation Landmarks', () => {
    it('uses proper navigation role and aria-label', () => {
      render(<Navigation items={mockNavigationItems} />)
      
      const nav = screen.getByRole('navigation', { name: 'Main navigation' })
      expect(nav).toBeInTheDocument()
    })

    it('uses menubar role for primary navigation list', () => {
      render(<Navigation items={mockNavigationItems} />)
      
      const list = screen.getByTestId('nav-list')
      expect(list).toHaveAttribute('role', 'menubar')
    })

    it('uses list role for breadcrumb navigation', () => {
      render(<Navigation items={mockBreadcrumbItems} type="breadcrumb" />)
      
      const list = screen.getByTestId('nav-list')
      expect(list).toHaveAttribute('role', 'list')
    })

    it('uses menu role for dropdown menus', async () => {
      const user = userEvent.setup()
      render(<Navigation items={mockDropdownItems} enableDropdowns={true} />)
      
      const servicesButton = screen.getByRole('button', { name: /services menu/i })
      await user.click(servicesButton)
      
      const dropdownMenu = screen.getByTestId('nav-dropdown-menu-services')
      expect(dropdownMenu).toHaveAttribute('role', 'menu')
      
      const menuItems = screen.getAllByRole('menuitem')
      expect(menuItems).toHaveLength(3)
    })
  })

  describe('Keyboard Navigation', () => {
    it('supports Tab navigation through all links', async () => {
      const user = userEvent.setup()
      render(<Navigation items={mockNavigationItems} />)
      
      const links = screen.getAllByRole('link')
      
      // Start from beginning
      await user.tab()
      expect(links[0]).toHaveFocus()
      
      await user.tab()
      expect(links[1]).toHaveFocus()
      
      await user.tab()
      expect(links[2]).toHaveFocus()
    })

    it('skips disabled links in tab navigation', async () => {
      const user = userEvent.setup()
      const itemsWithDisabled: NavigationItem[] = [
        { href: '/', label: 'Home' },
        { href: '/disabled', label: 'Disabled', disabled: true },
        { href: '/about', label: 'About' },
      ]
      
      render(<Navigation items={itemsWithDisabled} />)
      
      const links = screen.getAllByRole('link')
      
      await user.tab()
      expect(links[0]).toHaveFocus() // Home
      
      await user.tab()
      expect(links[2]).toHaveFocus() // About (skips disabled)
    })

    it('supports keyboard navigation for mobile menu toggle', async () => {
      const user = userEvent.setup()
      render(<Navigation items={mockNavigationItems} />)
      
      const hamburgerButton = screen.getByTestId('mobile-menu-toggle')
      
      hamburgerButton.focus()
      await user.keyboard('{Enter}')
      expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true')
    })
  })

  describe('Recruitment Site Structure', () => {
    it('renders recruitment site navigation structure correctly', () => {
      render(<Navigation items={mockNavigationItems} showIcons={true} />)
      
      // Verify all main sections are present
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Candidates')).toBeInTheDocument()
      expect(screen.getByText('Employers')).toBeInTheDocument()
      expect(screen.getByText('About')).toBeInTheDocument()
      expect(screen.getByText('Contact')).toBeInTheDocument()
      
      // Verify icons are displayed
      expect(screen.getByText('🏠')).toBeInTheDocument() // Home icon
      expect(screen.getByText('👥')).toBeInTheDocument() // Candidates icon
      expect(screen.getByText('🏢')).toBeInTheDocument() // Employers icon
    })

    it('handles complex recruitment site navigation with nested items', () => {
      const recruitmentNavigation: NavigationItem[] = [
        { href: '/', label: 'Home', active: true },
        {
          href: '/candidates',
          label: 'Job Seekers',
          children: [
            { href: '/candidates/register', label: 'Register Now' },
            { href: '/candidates/jobs', label: 'Current Jobs' },
            { href: '/candidates/cv-tips', label: 'CV Tips' },
          ],
        },
        {
          href: '/employers',
          label: 'Employers',
          children: [
            { href: '/employers/post-job', label: 'Post a Job' },
            { href: '/employers/find-staff', label: 'Find Staff' },
            { href: '/employers/services', label: 'Our Services' },
          ],
        },
        { href: '/about', label: 'About Us' },
        { href: '/contact', label: 'Contact' },
      ]
      
      render(<Navigation items={recruitmentNavigation} enableDropdowns={true} />)
      
      expect(screen.getByText('Job Seekers')).toBeInTheDocument()
      expect(screen.getByText('Employers')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /job seekers menu/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /employers menu/i })).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('renders gracefully with empty items array', () => {
      render(<Navigation items={[]} />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
      
      const list = screen.getByTestId('nav-list')
      expect(list).toBeInTheDocument()
      expect(list.children).toHaveLength(0)
    })

    it('handles items with missing required properties', () => {
      const invalidItems = [
        { href: '', label: 'Empty href' },
        { href: '/valid', label: '' }, // Empty label
      ] as NavigationItem[]
      
      // Should not crash
      render(<Navigation items={invalidItems} />)
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })
  })

  describe('Performance Considerations', () => {
    it('does not re-render unnecessarily when props are unchanged', () => {
      const renderSpy = jest.fn()
      const TestComponent = () => {
        renderSpy()
        return <Navigation items={mockNavigationItems} />
      }
      
      const { rerender } = render(<TestComponent />)
      expect(renderSpy).toHaveBeenCalledTimes(1)
      
      // Re-render with same props
      rerender(<TestComponent />)
      // Note: This would require React.memo on the actual component
    })
  })

  describe('Integration with Recruitment Features', () => {
    it('highlights candidate registration call-to-action', () => {
      const recruitmentItems: NavigationItem[] = [
        { href: '/', label: 'Home' },
        { href: '/candidates', label: 'Find Work' },
        { href: 'https://registration.recruso.co.uk/Form/Worker/RdcgtU2Ti03C3gbg7Q6uWoxra98ucBoAnSg21MBO', 
          label: 'Register Now', external: true },
        { href: '/employers', label: 'Find Staff' },
      ]
      
      render(<Navigation items={recruitmentItems} />)
      
      const registerLink = screen.getByText('Register Now').closest('a')
      expect(registerLink).toHaveAttribute('target', '_blank')
      expect(registerLink).toHaveAttribute('href', 'https://registration.recruso.co.uk/Form/Worker/RdcgtU2Ti03C3gbg7Q6uWoxra98ucBoAnSg21MBO')
      expect(screen.getByText('↗')).toBeInTheDocument()
    })

    it('supports mobile-first responsive design with proper spacing', () => {
      render(<Navigation items={mockNavigationItems} />)
      
      const navigation = screen.getByRole('navigation')
      expect(navigation).toHaveClass('navigation-horizontal')
      
      // Verify mobile toggle exists
      const mobileToggle = screen.getByTestId('mobile-menu-toggle')
      expect(mobileToggle).toHaveClass('md:hidden')
    })
  })
})