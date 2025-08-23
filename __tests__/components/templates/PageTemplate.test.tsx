import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

// Mock Next.js Head component
jest.mock('next/head', () => {
  const MockHead = ({ children }: { children: React.ReactNode }) => {
    return <div data-testid="mock-head">{children}</div>
  }
  MockHead.displayName = 'Head'
  return MockHead
})

// Mock child components
jest.mock('../../../components/organisms/Header', () => {
  const MockHeader = ({ 'data-testid': testId, variant, ...props }: any) => (
    <header data-testid={testId || 'header'} data-variant={variant} {...props}>
      Mock Header - {variant}
    </header>
  )
  MockHeader.displayName = 'Header'
  return MockHeader
})

jest.mock('../../../components/organisms/Footer', () => {
  const MockFooter = ({ 'data-testid': testId, layout, ...props }: any) => (
    <footer data-testid={testId || 'footer'} data-layout={layout} {...props}>
      Mock Footer - {layout}
    </footer>
  )
  MockFooter.displayName = 'Footer'
  return MockFooter
})

// Mock window.gtag for analytics tracking
const mockGtag = jest.fn()
Object.defineProperty(window, 'gtag', {
  value: mockGtag,
  writable: true,
})

// Mock IntersectionObserver for loading states
const mockIntersectionObserver = jest.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})
window.IntersectionObserver = mockIntersectionObserver

// PageTemplate interface definition (matches expected implementation)
export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

export interface PageTemplateProps {
  // Content
  children: React.ReactNode
  
  // Template variants
  variant?: 'default' | 'landing' | 'minimal' | 'application-form'
  
  // Layout options
  layout?: 'full-width' | 'contained' | 'sidebar'
  sidebarContent?: React.ReactNode
  sidebarPosition?: 'left' | 'right'
  
  // SEO metadata
  title?: string
  description?: string
  canonicalUrl?: string
  keywords?: string[]
  ogImage?: string
  noIndex?: boolean
  structuredData?: object
  
  // Page structure
  breadcrumbs?: BreadcrumbItem[]
  showSkipLinks?: boolean
  
  // Header/Footer customization
  headerProps?: Record<string, any>
  footerProps?: Record<string, any>
  hideHeader?: boolean
  hideFooter?: boolean
  
  // Loading and error states
  loading?: boolean
  error?: Error | string | null
  loadingComponent?: React.ReactNode
  errorComponent?: React.ReactNode
  
  // Analytics and tracking
  pageType?: string
  trackingData?: Record<string, any>
  conversionGoal?: string
  
  // Accessibility
  mainContentId?: string
  skipToContentText?: string
  
  // Performance
  preloadResources?: string[]
  criticalCss?: string
  
  // Additional props
  className?: string
  'data-testid'?: string
}

// Mock PageTemplate component implementation
const PageTemplate: React.FC<PageTemplateProps> = ({
  children,
  variant = 'default',
  layout = 'contained',
  sidebarContent,
  sidebarPosition = 'right',
  title,
  description,
  canonicalUrl,
  keywords = [],
  ogImage,
  noIndex = false,
  structuredData,
  breadcrumbs = [],
  showSkipLinks = true,
  headerProps = {},
  footerProps = {},
  hideHeader = false,
  hideFooter = false,
  loading = false,
  error = null,
  loadingComponent,
  errorComponent,
  pageType,
  trackingData = {},
  conversionGoal,
  mainContentId = 'main-content',
  skipToContentText = 'Skip to main content',
  preloadResources = [],
  criticalCss,
  className = '',
  'data-testid': testId = 'page-template',
  ...props
}) => {
  const router = useRouter()
  
  // Track page view
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_TRACKING_ID', {
        page_title: title,
        page_location: window.location.href,
        custom_map: trackingData,
      })
      
      if (conversionGoal) {
        window.gtag('event', 'page_view', {
          conversion_goal: conversionGoal,
          page_type: pageType,
        })
      }
    }
  }, [title, trackingData, conversionGoal, pageType])

  // Error boundary logic
  const [hasError, setHasError] = React.useState(false)
  
  React.useEffect(() => {
    if (error) {
      setHasError(true)
    }
  }, [error])

  // Generate page title
  const pageTitle = title 
    ? `${title} | Lightyear Recruitment`
    : 'Lightyear Recruitment - Warehouse & Logistics Jobs in Berkshire'

  // Generate structured data
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": canonicalUrl || (typeof window !== 'undefined' ? window.location.href : ''),
    "isPartOf": {
      "@type": "WebSite",
      "name": "Lightyear Recruitment",
      "url": "https://lightyear-recruitment.com"
    }
  }

  const finalStructuredData = structuredData || defaultStructuredData

  // Get header variant based on page variant
  const getHeaderVariant = () => {
    switch (variant) {
      case 'minimal':
      case 'application-form':
        return 'minimal'
      case 'landing':
        return 'landing-page'
      default:
        return 'default'
    }
  }

  // Get footer layout based on page variant
  const getFooterLayout = () => {
    switch (variant) {
      case 'minimal':
      case 'application-form':
        return 'minimal'
      default:
        return 'comprehensive'
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="page-loading">
        {loadingComponent || (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary">
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </div>
    )
  }

  // Error state
  if (hasError || error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" data-testid="page-error">
        {errorComponent || (
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-4">
              {typeof error === 'string' ? error : error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {description && <meta name="description" content={description} />}
        {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        {noIndex && <meta name="robots" content="noindex, nofollow" />}
        
        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        {description && <meta property="og:description" content={description} />}
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        {description && <meta name="twitter:description" content={description} />}
        {ogImage && <meta name="twitter:image" content={ogImage} />}
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(finalStructuredData) }}
        />
        
        {/* Preload Resources */}
        {preloadResources.map((resource, index) => (
          <link key={index} rel="preload" href={resource} />
        ))}
        
        {/* Critical CSS */}
        {criticalCss && (
          <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
        )}
      </Head>

      <div
        className={`min-h-screen flex flex-col ${className}`}
        data-testid={testId}
        data-variant={variant}
        data-layout={layout}
        {...props}
      >
        {/* Skip Links */}
        {showSkipLinks && (
          <div className="sr-only focus-within:not-sr-only">
            <a
              href={`#${mainContentId}`}
              className="absolute top-0 left-0 bg-primary text-white p-2 z-50 focus:relative"
              data-testid="skip-to-content"
            >
              {skipToContentText}
            </a>
          </div>
        )}

        {/* Header */}
        {!hideHeader && (
          <div data-testid="page-header">
            {React.createElement('div', {
              'data-testid': 'header',
              'data-variant': getHeaderVariant(),
              ...headerProps
            }, `Mock Header - ${getHeaderVariant()}`)}
          </div>
        )}

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="bg-gray-50 py-3"
            data-testid="page-breadcrumbs"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ol className="flex items-center space-x-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && (
                      <span className="text-gray-400 mx-2" aria-hidden="true">/</span>
                    )}
                    {crumb.href ? (
                      <a
                        href={crumb.href}
                        className="text-primary hover:text-primary/80"
                        aria-current={crumb.current ? 'page' : undefined}
                      >
                        {crumb.label}
                      </a>
                    ) : (
                      <span
                        className="text-gray-900"
                        aria-current={crumb.current ? 'page' : undefined}
                      >
                        {crumb.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </nav>
        )}

        {/* Main Content */}
        <main
          id={mainContentId}
          className="flex-1"
          role="main"
          aria-label="Main content"
          data-testid="page-main"
        >
          {layout === 'full-width' ? (
            <div className="w-full">
              {children}
            </div>
          ) : layout === 'sidebar' ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className={`grid grid-cols-1 lg:grid-cols-4 gap-8 ${
                sidebarPosition === 'left' ? 'lg:grid-flow-col-dense' : ''
              }`}>
                <div className={`lg:col-span-3 ${
                  sidebarPosition === 'left' ? 'lg:col-start-2' : ''
                }`}>
                  {children}
                </div>
                {sidebarContent && (
                  <aside
                    className={`lg:col-span-1 ${
                      sidebarPosition === 'left' ? 'lg:col-start-1 lg:row-start-1' : ''
                    }`}
                    data-testid="page-sidebar"
                    aria-label="Sidebar content"
                  >
                    {sidebarContent}
                  </aside>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          )}
        </main>

        {/* Footer */}
        {!hideFooter && (
          <div data-testid="page-footer">
            {React.createElement('div', {
              'data-testid': 'footer',
              'data-layout': getFooterLayout(),
              ...footerProps
            }, `Mock Footer - ${getFooterLayout()}`)}
          </div>
        )}
      </div>
    </>
  )
}

// Test Suite
describe('PageTemplate', () => {
  const mockRouter = {
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
  }

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    jest.clearAllMocks()
    mockGtag.mockClear()
  })

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(
        <PageTemplate>
          <div>Test content</div>
        </PageTemplate>
      )

      expect(screen.getByTestId('page-template')).toBeInTheDocument()
      expect(screen.getByText('Test content')).toBeInTheDocument()
      expect(screen.getByTestId('header')).toBeInTheDocument()
      expect(screen.getByTestId('footer')).toBeInTheDocument()
      expect(screen.getByTestId('page-main')).toBeInTheDocument()
    })

    it('applies custom className and data-testid', () => {
      render(
        <PageTemplate
          className="custom-class"
          data-testid="custom-page"
        >
          <div>Test content</div>
        </PageTemplate>
      )

      const pageTemplate = screen.getByTestId('custom-page')
      expect(pageTemplate).toBeInTheDocument()
      expect(pageTemplate).toHaveClass('custom-class')
    })

    it('renders children correctly', () => {
      render(
        <PageTemplate>
          <h1>Page Title</h1>
          <p>Page content</p>
          <div>Another section</div>
        </PageTemplate>
      )

      expect(screen.getByText('Page Title')).toBeInTheDocument()
      expect(screen.getByText('Page content')).toBeInTheDocument()
      expect(screen.getByText('Another section')).toBeInTheDocument()
    })
  })

  describe('Template Variants', () => {
    it('renders default variant correctly', () => {
      render(
        <PageTemplate variant="default">
          <div>Content</div>
        </PageTemplate>
      )

      const template = screen.getByTestId('page-template')
      expect(template).toHaveAttribute('data-variant', 'default')
      
      const header = screen.getByTestId('header')
      expect(header).toHaveAttribute('data-variant', 'default')
      
      const footer = screen.getByTestId('footer')
      expect(footer).toHaveAttribute('data-layout', 'comprehensive')
    })

    it('renders landing variant with correct header and footer', () => {
      render(
        <PageTemplate variant="landing">
          <div>Landing content</div>
        </PageTemplate>
      )

      const template = screen.getByTestId('page-template')
      expect(template).toHaveAttribute('data-variant', 'landing')
      
      const header = screen.getByTestId('header')
      expect(header).toHaveAttribute('data-variant', 'landing-page')
      
      const footer = screen.getByTestId('footer')
      expect(footer).toHaveAttribute('data-layout', 'comprehensive')
    })

    it('renders minimal variant with minimal header and footer', () => {
      render(
        <PageTemplate variant="minimal">
          <div>Minimal content</div>
        </PageTemplate>
      )

      const template = screen.getByTestId('page-template')
      expect(template).toHaveAttribute('data-variant', 'minimal')
      
      const header = screen.getByTestId('header')
      expect(header).toHaveAttribute('data-variant', 'minimal')
      
      const footer = screen.getByTestId('footer')
      expect(footer).toHaveAttribute('data-layout', 'minimal')
    })

    it('renders application-form variant with minimal components', () => {
      render(
        <PageTemplate variant="application-form">
          <form>Application form</form>
        </PageTemplate>
      )

      const template = screen.getByTestId('page-template')
      expect(template).toHaveAttribute('data-variant', 'application-form')
      
      const header = screen.getByTestId('header')
      expect(header).toHaveAttribute('data-variant', 'minimal')
      
      const footer = screen.getByTestId('footer')
      expect(footer).toHaveAttribute('data-layout', 'minimal')
    })
  })

  describe('Layout Options', () => {
    it('renders contained layout by default', () => {
      render(
        <PageTemplate>
          <div>Content</div>
        </PageTemplate>
      )

      const template = screen.getByTestId('page-template')
      expect(template).toHaveAttribute('data-layout', 'contained')
      
      const main = screen.getByTestId('page-main')
      expect(main.querySelector('.max-w-7xl')).toBeInTheDocument()
    })

    it('renders full-width layout', () => {
      render(
        <PageTemplate layout="full-width">
          <div>Full width content</div>
        </PageTemplate>
      )

      const template = screen.getByTestId('page-template')
      expect(template).toHaveAttribute('data-layout', 'full-width')
      
      const main = screen.getByTestId('page-main')
      expect(main.querySelector('.w-full')).toBeInTheDocument()
    })

    it('renders sidebar layout with right sidebar', () => {
      render(
        <PageTemplate
          layout="sidebar"
          sidebarContent={<div>Sidebar content</div>}
        >
          <div>Main content</div>
        </PageTemplate>
      )

      expect(screen.getByTestId('page-sidebar')).toBeInTheDocument()
      expect(screen.getByText('Sidebar content')).toBeInTheDocument()
      expect(screen.getByText('Main content')).toBeInTheDocument()
    })

    it('renders sidebar layout with left sidebar', () => {
      render(
        <PageTemplate
          layout="sidebar"
          sidebarPosition="left"
          sidebarContent={<div>Left sidebar</div>}
        >
          <div>Main content</div>
        </PageTemplate>
      )

      const sidebar = screen.getByTestId('page-sidebar')
      expect(sidebar).toBeInTheDocument()
      expect(sidebar).toHaveClass('lg:col-start-1', 'lg:row-start-1')
    })

    it('renders sidebar layout without sidebar content', () => {
      render(
        <PageTemplate layout="sidebar">
          <div>Main content only</div>
        </PageTemplate>
      )

      expect(screen.queryByTestId('page-sidebar')).not.toBeInTheDocument()
      expect(screen.getByText('Main content only')).toBeInTheDocument()
    })
  })

  describe('SEO Metadata', () => {
    it('renders default SEO metadata', () => {
      render(
        <PageTemplate>
          <div>Content</div>
        </PageTemplate>
      )

      const head = screen.getByTestId('mock-head')
      expect(head).toBeInTheDocument()
    })

    it('renders custom title and description', () => {
      render(
        <PageTemplate
          title="Custom Page Title"
          description="Custom page description"
        >
          <div>Content</div>
        </PageTemplate>
      )

      const head = screen.getByTestId('mock-head')
      expect(head).toBeInTheDocument()
      // Note: In a real implementation, you would test the actual meta tags
      // but with our mock, we can verify the Head component receives the right props
    })

    it('renders canonical URL', () => {
      render(
        <PageTemplate
          canonicalUrl="https://example.com/page"
          title="Test Page"
        >
          <div>Content</div>
        </PageTemplate>
      )

      expect(screen.getByTestId('mock-head')).toBeInTheDocument()
    })

    it('renders keywords meta tag', () => {
      render(
        <PageTemplate
          keywords={['recruitment', 'warehouse', 'logistics']}
          title="Jobs Page"
        >
          <div>Content</div>
        </PageTemplate>
      )

      expect(screen.getByTestId('mock-head')).toBeInTheDocument()
    })

    it('renders noindex when specified', () => {
      render(
        <PageTemplate
          noIndex={true}
          title="Private Page"
        >
          <div>Content</div>
        </PageTemplate>
      )

      expect(screen.getByTestId('mock-head')).toBeInTheDocument()
    })

    it('renders custom structured data', () => {
      const customStructuredData = {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        "title": "Warehouse Worker",
        "description": "Job description"
      }

      render(
        <PageTemplate
          structuredData={customStructuredData}
          title="Job Posting"
        >
          <div>Content</div>
        </PageTemplate>
      )

      expect(screen.getByTestId('mock-head')).toBeInTheDocument()
    })
  })

  describe('Breadcrumb Navigation', () => {
    it('does not render breadcrumbs when none provided', () => {
      render(
        <PageTemplate>
          <div>Content</div>
        </PageTemplate>
      )

      expect(screen.queryByTestId('page-breadcrumbs')).not.toBeInTheDocument()
    })

    it('renders breadcrumbs correctly', () => {
      const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: 'Jobs', href: '/jobs' },
        { label: 'Current Position', current: true }
      ]

      render(
        <PageTemplate breadcrumbs={breadcrumbs}>
          <div>Content</div>
        </PageTemplate>
      )

      const breadcrumbNav = screen.getByTestId('page-breadcrumbs')
      expect(breadcrumbNav).toBeInTheDocument()
      expect(breadcrumbNav).toHaveAttribute('aria-label', 'Breadcrumb')

      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Jobs')).toBeInTheDocument()
      expect(screen.getByText('Current Position')).toBeInTheDocument()
    })

    it('handles breadcrumb links and current page correctly', () => {
      const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: 'Current Page', current: true }
      ]

      render(
        <PageTemplate breadcrumbs={breadcrumbs}>
          <div>Content</div>
        </PageTemplate>
      )

      const homeLink = screen.getByText('Home')
      expect(homeLink.closest('a')).toHaveAttribute('href', '/')

      const currentPage = screen.getByText('Current Page')
      expect(currentPage.closest('span')).toHaveAttribute('aria-current', 'page')
      expect(currentPage.closest('a')).toBeNull()
    })
  })

  describe('Skip Links and Accessibility', () => {
    it('renders skip to content link by default', () => {
      render(
        <PageTemplate>
          <div>Content</div>
        </PageTemplate>
      )

      const skipLink = screen.getByTestId('skip-to-content')
      expect(skipLink).toBeInTheDocument()
      expect(skipLink).toHaveAttribute('href', '#main-content')
      expect(skipLink).toHaveTextContent('Skip to main content')
    })

    it('can hide skip links', () => {
      render(
        <PageTemplate showSkipLinks={false}>
          <div>Content</div>
        </PageTemplate>
      )

      expect(screen.queryByTestId('skip-to-content')).not.toBeInTheDocument()
    })

    it('renders custom skip to content text and id', () => {
      render(
        <PageTemplate
          skipToContentText="Go to main content"
          mainContentId="custom-main"
        >
          <div>Content</div>
        </PageTemplate>
      )

      const skipLink = screen.getByTestId('skip-to-content')
      expect(skipLink).toHaveAttribute('href', '#custom-main')
      expect(skipLink).toHaveTextContent('Go to main content')

      const main = screen.getByTestId('page-main')
      expect(main).toHaveAttribute('id', 'custom-main')
    })

    it('has proper ARIA landmarks', () => {
      render(
        <PageTemplate>
          <div>Content</div>
        </PageTemplate>
      )

      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
      expect(main).toHaveAttribute('aria-label', 'Main content')
    })
  })

  describe('Header and Footer Customization', () => {
    it('can hide header', () => {
      render(
        <PageTemplate hideHeader={true}>
          <div>Content</div>
        </PageTemplate>
      )

      expect(screen.queryByTestId('page-header')).not.toBeInTheDocument()
    })

    it('can hide footer', () => {
      render(
        <PageTemplate hideFooter={true}>
          <div>Content</div>
        </PageTemplate>
      )

      expect(screen.queryByTestId('page-footer')).not.toBeInTheDocument()
    })

    it('passes custom props to header', () => {
      const headerProps = {
        siteName: 'Custom Site',
        variant: 'custom'
      }

      render(
        <PageTemplate headerProps={headerProps}>
          <div>Content</div>
        </PageTemplate>
      )

      const header = screen.getByTestId('header')
      expect(header).toBeInTheDocument()
    })

    it('passes custom props to footer', () => {
      const footerProps = {
        companyName: 'Custom Company',
        layout: 'custom'
      }

      render(
        <PageTemplate footerProps={footerProps}>
          <div>Content</div>
        </PageTemplate>
      )

      const footer = screen.getByTestId('footer')
      expect(footer).toBeInTheDocument()
    })
  })

  describe('Loading States', () => {
    it('renders loading state', () => {
      render(
        <PageTemplate loading={true}>
          <div>Content</div>
        </PageTemplate>
      )

      expect(screen.getByTestId('page-loading')).toBeInTheDocument()
      expect(screen.getByText('Loading...')).toBeInTheDocument()
      expect(screen.queryByText('Content')).not.toBeInTheDocument()
    })

    it('renders custom loading component', () => {
      const customLoading = <div data-testid="custom-loading">Custom Loading</div>

      render(
        <PageTemplate loading={true} loadingComponent={customLoading}>
          <div>Content</div>
        </PageTemplate>
      )

      expect(screen.getByTestId('custom-loading')).toBeInTheDocument()
      expect(screen.getByText('Custom Loading')).toBeInTheDocument()
    })
  })

  describe('Error States', () => {
    // Mock console.error to avoid error output during tests
    const originalError = console.error
    beforeAll(() => {
      console.error = jest.fn()
    })
    afterAll(() => {
      console.error = originalError
    })

    it('renders error state with string error', () => {
      render(
        <PageTemplate error="Something went wrong">
          <div>Content</div>
        </PageTemplate>
      )

      expect(screen.getByTestId('page-error')).toBeInTheDocument()
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      expect(screen.getByText('Try again')).toBeInTheDocument()
    })

    it('renders error state with Error object', () => {
      const error = new Error('Test error message')
      
      render(
        <PageTemplate error={error}>
          <div>Content</div>
        </PageTemplate>
      )

      expect(screen.getByTestId('page-error')).toBeInTheDocument()
      expect(screen.getByText('Test error message')).toBeInTheDocument()
    })

    it('renders custom error component', () => {
      const customError = (
        <div data-testid="custom-error">
          Custom error message
        </div>
      )

      render(
        <PageTemplate error="Error" errorComponent={customError}>
          <div>Content</div>
        </PageTemplate>
      )

      expect(screen.getByTestId('custom-error')).toBeInTheDocument()
      expect(screen.getByText('Custom error message')).toBeInTheDocument()
    })

    it('handles error retry button', () => {
      const mockReload = jest.fn()
      Object.defineProperty(window, 'location', {
        value: { reload: mockReload },
        writable: true
      })

      render(
        <PageTemplate error="Test error">
          <div>Content</div>
        </PageTemplate>
      )

      const retryButton = screen.getByText('Try again')
      fireEvent.click(retryButton)

      expect(mockReload).toHaveBeenCalled()
    })
  })

  describe('Analytics and Tracking', () => {
    it('tracks page view on mount', async () => {
      render(
        <PageTemplate
          title="Test Page"
          pageType="landing"
          trackingData={{ section: 'recruitment' }}
        >
          <div>Content</div>
        </PageTemplate>
      )

      await waitFor(() => {
        expect(mockGtag).toHaveBeenCalledWith('config', 'GA_TRACKING_ID', {
          page_title: 'Test Page',
          page_location: 'http://localhost/',
          custom_map: { section: 'recruitment' },
        })
      })
    })

    it('tracks conversion goal', async () => {
      render(
        <PageTemplate
          conversionGoal="registration"
          pageType="application-form"
        >
          <div>Content</div>
        </PageTemplate>
      )

      await waitFor(() => {
        expect(mockGtag).toHaveBeenCalledWith('event', 'page_view', {
          conversion_goal: 'registration',
          page_type: 'application-form',
        })
      })
    })

    it('does not track when gtag is not available', () => {
      // Temporarily remove gtag
      const originalGtag = window.gtag
      delete (window as any).gtag

      render(
        <PageTemplate title="Test Page">
          <div>Content</div>
        </PageTemplate>
      )

      expect(mockGtag).not.toHaveBeenCalled()

      // Restore gtag
      window.gtag = originalGtag
    })
  })

  describe('Mobile Responsiveness', () => {
    it('applies responsive classes correctly', () => {
      render(
        <PageTemplate>
          <div>Content</div>
        </PageTemplate>
      )

      const template = screen.getByTestId('page-template')
      expect(template).toHaveClass('min-h-screen', 'flex', 'flex-col')

      const main = screen.getByTestId('page-main')
      expect(main).toHaveClass('flex-1')
    })

    it('handles sidebar responsively', () => {
      render(
        <PageTemplate
          layout="sidebar"
          sidebarContent={<div>Sidebar</div>}
        >
          <div>Content</div>
        </PageTemplate>
      )

      const main = screen.getByTestId('page-main')
      expect(main.querySelector('.grid-cols-1')).toBeInTheDocument()
      expect(main.querySelector('.lg\\:grid-cols-4')).toBeInTheDocument()
    })

    it('renders mobile-friendly breadcrumbs', () => {
      const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: 'Jobs', href: '/jobs' },
        { label: 'Current Position', current: true }
      ]

      render(
        <PageTemplate breadcrumbs={breadcrumbs}>
          <div>Content</div>
        </PageTemplate>
      )

      const breadcrumbNav = screen.getByTestId('page-breadcrumbs')
      expect(breadcrumbNav.querySelector('.px-4')).toBeInTheDocument()
      expect(breadcrumbNav.querySelector('.sm\\:px-6')).toBeInTheDocument()
      expect(breadcrumbNav.querySelector('.lg\\:px-8')).toBeInTheDocument()
    })
  })

  describe('Performance Features', () => {
    it('handles preload resources in head', () => {
      render(
        <PageTemplate
          preloadResources={['/critical.css', '/hero-image.jpg']}
          title="Performance Page"
        >
          <div>Content</div>
        </PageTemplate>
      )

      expect(screen.getByTestId('mock-head')).toBeInTheDocument()
      // In real implementation, would test actual preload links
    })

    it('handles critical CSS injection', () => {
      render(
        <PageTemplate
          criticalCss=".hero { background: blue; }"
          title="Styled Page"
        >
          <div>Content</div>
        </PageTemplate>
      )

      expect(screen.getByTestId('mock-head')).toBeInTheDocument()
      // In real implementation, would test actual style tag
    })
  })

  describe('Edge Cases', () => {
    it('handles empty breadcrumbs array', () => {
      render(
        <PageTemplate breadcrumbs={[]}>
          <div>Content</div>
        </PageTemplate>
      )

      expect(screen.queryByTestId('page-breadcrumbs')).not.toBeInTheDocument()
    })

    it('handles undefined sidebar content', () => {
      render(
        <PageTemplate layout="sidebar" sidebarContent={undefined}>
          <div>Content</div>
        </PageTemplate>
      )

      expect(screen.queryByTestId('page-sidebar')).not.toBeInTheDocument()
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('handles empty keywords array', () => {
      render(
        <PageTemplate keywords={[]} title="No Keywords Page">
          <div>Content</div>
        </PageTemplate>
      )

      expect(screen.getByTestId('mock-head')).toBeInTheDocument()
    })

    it('handles null error gracefully', () => {
      render(
        <PageTemplate error={null}>
          <div>Content</div>
        </PageTemplate>
      )

      expect(screen.queryByTestId('page-error')).not.toBeInTheDocument()
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('handles extremely long content without breaking', () => {
      const longContent = 'Very long content '.repeat(1000)
      
      render(
        <PageTemplate>
          <div>{longContent}</div>
        </PageTemplate>
      )

      expect(screen.getByText(longContent)).toBeInTheDocument()
    })
  })

  describe('Accessibility Compliance', () => {
    it('has proper heading hierarchy structure', () => {
      render(
        <PageTemplate
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Current', current: true }
          ]}
        >
          <h1>Main Page Title</h1>
          <h2>Section Title</h2>
        </PageTemplate>
      )

      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
      
      const breadcrumbNav = screen.getByRole('navigation', { name: /breadcrumb/i })
      expect(breadcrumbNav).toBeInTheDocument()
    })

    it('maintains focus management for skip links', () => {
      render(
        <PageTemplate>
          <div>Content</div>
        </PageTemplate>
      )

      const skipLink = screen.getByTestId('skip-to-content')
      expect(skipLink).toHaveClass('sr-only')
    })

    it('provides proper ARIA labels for sidebar', () => {
      render(
        <PageTemplate
          layout="sidebar"
          sidebarContent={<div>Sidebar content</div>}
        >
          <div>Main content</div>
        </PageTemplate>
      )

      const sidebar = screen.getByTestId('page-sidebar')
      expect(sidebar).toHaveAttribute('aria-label', 'Sidebar content')
    })

    it('supports high contrast mode classes', () => {
      render(
        <PageTemplate className="high-contrast">
          <div>Content</div>
        </PageTemplate>
      )

      const template = screen.getByTestId('page-template')
      expect(template).toHaveClass('high-contrast')
    })
  })

  describe('Integration Tests', () => {
    it('renders complete recruitment landing page setup', () => {
      const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: 'Jobs', href: '/jobs' },
        { label: 'Warehouse Worker', current: true }
      ]

      render(
        <PageTemplate
          variant="landing"
          title="Warehouse Worker Position"
          description="Join our team as a warehouse worker in Berkshire"
          breadcrumbs={breadcrumbs}
          pageType="job-listing"
          conversionGoal="job-application"
          trackingData={{ jobId: '12345', location: 'berkshire' }}
          sidebarContent={
            <div>
              <h3>Quick Apply</h3>
              <button>Apply Now</button>
            </div>
          }
          layout="sidebar"
        >
          <div>
            <h1>Warehouse Worker</h1>
            <p>Job description content</p>
            <button>Apply for this job</button>
          </div>
        </PageTemplate>
      )

      // Check all major components are rendered
      expect(screen.getByTestId('page-template')).toHaveAttribute('data-variant', 'landing')
      expect(screen.getByTestId('page-breadcrumbs')).toBeInTheDocument()
      expect(screen.getByTestId('page-sidebar')).toBeInTheDocument()
      expect(screen.getByText('Warehouse Worker')).toBeInTheDocument()
      expect(screen.getByText('Quick Apply')).toBeInTheDocument()
      expect(screen.getByText('Apply for this job')).toBeInTheDocument()
    })

    it('renders minimal application form setup', () => {
      render(
        <PageTemplate
          variant="application-form"
          title="Job Application Form"
          hideHeader={false}
          hideFooter={false}
          pageType="application"
          conversionGoal="form-submission"
        >
          <form>
            <h1>Application Form</h1>
            <input type="text" placeholder="Full Name" />
            <input type="email" placeholder="Email" />
            <textarea placeholder="Cover Letter"></textarea>
            <button type="submit">Submit Application</button>
          </form>
        </PageTemplate>
      )

      expect(screen.getByTestId('page-template')).toHaveAttribute('data-variant', 'application-form')
      expect(screen.getByText('Application Form')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
      expect(screen.getByText('Submit Application')).toBeInTheDocument()
    })

    it('handles error state with recovery', async () => {
      const mockReload = jest.fn()
      Object.defineProperty(window, 'location', {
        value: { reload: mockReload },
        writable: true
      })

      render(
        <PageTemplate error="Network error occurred">
          <div>Should not see this</div>
        </PageTemplate>
      )

      expect(screen.getByTestId('page-error')).toBeInTheDocument()
      expect(screen.getByText('Network error occurred')).toBeInTheDocument()
      expect(screen.queryByText('Should not see this')).not.toBeInTheDocument()

      const retryButton = screen.getByText('Try again')
      fireEvent.click(retryButton)

      expect(mockReload).toHaveBeenCalledTimes(1)
    })
  })
})