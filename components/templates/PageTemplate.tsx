import React, { forwardRef, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Header from '../organisms/Header'
import Footer from '../organisms/Footer'
import Navigation from '../molecules/Navigation'
import Text from '../atoms/Text'
import type { HeaderProps } from '../organisms/Header'
import type { FooterProps } from '../organisms/Footer'
import type { NavigationItem } from '../molecules/Navigation'

export interface PageTemplateProps extends React.HTMLAttributes<HTMLDivElement> {
  // Template variant
  variant?: 'default' | 'landing' | 'minimal' | 'application-form'
  
  // Layout
  layout?: 'full-width' | 'contained' | 'sidebar-left' | 'sidebar-right'
  sidebarContent?: React.ReactNode
  
  // SEO and metadata
  title?: string
  description?: string
  canonicalUrl?: string
  keywords?: string
  noIndex?: boolean
  openGraph?: {
    title?: string
    description?: string
    image?: string
    url?: string
    type?: string
  }
  structuredData?: object
  
  // Page structure
  showSkipLink?: boolean
  skipLinkText?: string
  skipLinkTarget?: string
  breadcrumbs?: NavigationItem[]
  
  // Loading and error states
  loading?: boolean
  error?: boolean
  loadingComponent?: React.ReactNode
  errorComponent?: React.ReactNode
  onRetry?: () => void
  
  // Analytics
  pageType?: string
  conversionGoals?: string[]
  trackingData?: Record<string, any>
  
  // Header/Footer customization
  headerProps?: Partial<HeaderProps>
  footerProps?: Partial<FooterProps>
  
  children: React.ReactNode
  className?: string
  'data-testid'?: string
}

const PageTemplate = forwardRef<HTMLDivElement, PageTemplateProps>(
  (
    {
      variant = 'default',
      layout = 'contained',
      sidebarContent,
      title,
      description,
      canonicalUrl,
      keywords,
      noIndex = false,
      openGraph,
      structuredData,
      showSkipLink = true,
      skipLinkText = 'Skip to main content',
      skipLinkTarget = 'main-content',
      breadcrumbs,
      loading = false,
      error = false,
      loadingComponent,
      errorComponent,
      onRetry,
      pageType = 'default',
      conversionGoals = [],
      trackingData = {},
      headerProps = {},
      footerProps = {},
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const router = useRouter()
    const siteName = 'Lightyear Recruitment'
    const baseUrl = 'https://www.lightyear-recruitment.com'
    
    // Default SEO values
    const pageTitle = title ? `${title} | ${siteName}` : siteName
    const pageDescription = description || 'Professional recruitment services specializing in warehouse and logistics roles across Berkshire. Family-run agency helping candidates find their perfect job match.'
    const pageCanonical = canonicalUrl || `${baseUrl}${router.asPath}`
    
    // Analytics tracking
    useEffect(() => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'page_view', {
          page_title: pageTitle,
          page_location: pageCanonical,
          page_type: pageType,
          ...trackingData,
        })
        
        // Track conversion goals
        conversionGoals.forEach(goal => {
          window.gtag('event', 'conversion_opportunity', {
            conversion_goal: goal,
            page_type: pageType,
          })
        })
      }
    }, [pageTitle, pageCanonical, pageType, trackingData, conversionGoals])

    // Header configuration based on variant
    const getHeaderConfig = (): Partial<HeaderProps> => {
      const baseConfig = {
        variant: variant === 'minimal' || variant === 'application-form' ? 'minimal' as const : 'default' as const,
        ...headerProps,
      }
      
      if (variant === 'landing') {
        return {
          ...baseConfig,
          ctaButton: {
            text: 'Register Now',
            href: 'https://registration.recruso.co.uk/Form/Worker/RdcgtU2Ti03C3gbg7Q6uWoxra98ucBoAnSg21MBO',
            variant: 'primary' as const,
          },
          ...headerProps,
        }
      }
      
      return baseConfig
    }

    // Footer configuration based on variant
    const getFooterConfig = (): Partial<FooterProps> => {
      if (variant === 'minimal' || variant === 'application-form') {
        return {
          layout: 'minimal',
          ...footerProps,
        }
      }
      
      return {
        layout: 'comprehensive',
        ...footerProps,
      }
    }

    // Layout classes
    const layoutClasses = {
      'full-width': '',
      'contained': 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
      'sidebar-left': 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
      'sidebar-right': 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    }

    const renderContent = () => {
      if (loading) {
        return loadingComponent || (
          <div className="flex items-center justify-center py-24" data-testid="page-loading">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <Text>Loading...</Text>
            </div>
          </div>
        )
      }

      if (error) {
        return errorComponent || (
          <div className="text-center py-24" data-testid="page-error">
            <Text size="xl" className="mb-4">Something went wrong</Text>
            <Text color="muted" className="mb-6">Please try again or contact support if the problem persists.</Text>
            {onRetry && (
              <button
                onClick={onRetry}
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors"
                data-testid="error-retry-button"
              >
                Retry
              </button>
            )}
          </div>
        )
      }

      if (layout === 'sidebar-left' || layout === 'sidebar-right') {
        return (
          <div className={`grid grid-cols-1 lg:grid-cols-4 gap-8 ${layoutClasses[layout]}`}>
            {layout === 'sidebar-left' && sidebarContent && (
              <aside 
                className="lg:col-span-1" 
                role="complementary"
                aria-label="Sidebar content"
                data-testid="page-sidebar"
              >
                {sidebarContent}
              </aside>
            )}
            
            <main 
              id={skipLinkTarget}
              className={`${layout === 'sidebar-left' || layout === 'sidebar-right' ? 'lg:col-span-3' : 'lg:col-span-4'}`}
              role="main"
            >
              {children}
            </main>
            
            {layout === 'sidebar-right' && sidebarContent && (
              <aside 
                className="lg:col-span-1" 
                role="complementary"
                aria-label="Sidebar content"
                data-testid="page-sidebar"
              >
                {sidebarContent}
              </aside>
            )}
          </div>
        )
      }

      return (
        <main 
          id={skipLinkTarget}
          className={layoutClasses[layout]}
          role="main"
        >
          {children}
        </main>
      )
    }

    return (
      <>
        <Head>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          {keywords && <meta name="keywords" content={keywords} />}
          <link rel="canonical" href={pageCanonical} />
          
          {noIndex && <meta name="robots" content="noindex,nofollow" />}
          
          {/* Open Graph */}
          <meta property="og:title" content={openGraph?.title || pageTitle} />
          <meta property="og:description" content={openGraph?.description || pageDescription} />
          <meta property="og:url" content={openGraph?.url || pageCanonical} />
          <meta property="og:type" content={openGraph?.type || 'website'} />
          <meta property="og:site_name" content={siteName} />
          {openGraph?.image && <meta property="og:image" content={openGraph.image} />}
          
          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={openGraph?.title || pageTitle} />
          <meta name="twitter:description" content={openGraph?.description || pageDescription} />
          {openGraph?.image && <meta name="twitter:image" content={openGraph.image} />}
          
          {/* Structured Data */}
          {structuredData && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
          )}
          
          {/* Mobile optimization */}
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="theme-color" content="#0066CC" />
        </Head>

        <div
          ref={ref}
          className={`min-h-screen flex flex-col ${className}`}
          {...props}
        >
          {/* Skip to content link */}
          {showSkipLink && (
            <a
              href={`#${skipLinkTarget}`}
              className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-primary text-white p-3 z-50 rounded-br-md"
              data-testid="skip-to-content"
            >
              {skipLinkText}
            </a>
          )}

          {/* Header */}
          <Header {...getHeaderConfig()} />

          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav
              aria-label="Breadcrumb"
              className="bg-gray-50 border-b border-gray-200"
              data-testid="page-breadcrumbs"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <Navigation
                  items={breadcrumbs}
                  type="breadcrumb"
                  layout="horizontal"
                />
              </div>
            </nav>
          )}

          {/* Main content area */}
          <div className="flex-1 py-8">
            {renderContent()}
          </div>

          {/* Footer */}
          <Footer {...getFooterConfig()} />
        </div>
      </>
    )
  }
)

PageTemplate.displayName = 'PageTemplate'

export default PageTemplate

// Global type declaration for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}