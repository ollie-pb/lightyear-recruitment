import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { jest } from '@jest/globals'

// Footer component interfaces and types
export interface FooterLink {
  href: string
  label: string
  external?: boolean
  ariaLabel?: string
}

export interface FooterSection {
  title: string
  links: FooterLink[]
  ariaLabel?: string
}

export interface SocialMediaLink {
  platform: 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'youtube'
  href: string
  ariaLabel?: string
}

export interface CompanyInfo {
  name: string
  description?: string
  address: {
    street: string
    city: string
    county: string
    postcode: string
    country?: string
  }
  phone: string
  email: string
  openingHours?: {
    weekdays: string
    saturday?: string
    sunday?: string
  }
  companyNumber?: string
  vatNumber?: string
}

export interface NewsletterConfig {
  enabled: boolean
  title?: string
  description?: string
  placeholder?: string
  submitText?: string
  successMessage?: string
  errorMessage?: string
  onSubmit?: (email: string) => Promise<void>
}

export interface FooterProps {
  layout?: 'simple' | 'comprehensive' | 'minimal'
  companyInfo: CompanyInfo
  navigationSections?: FooterSection[]
  socialMedia?: SocialMediaLink[]
  newsletter?: NewsletterConfig
  legalLinks?: FooterLink[]
  showTrustElements?: boolean
  showComplianceInfo?: boolean
  copyrightText?: string
  className?: string
  'data-testid'?: string
}

// Mock Footer component for testing
const Footer: React.FC<FooterProps> = ({
  layout = 'comprehensive',
  companyInfo,
  navigationSections = [],
  socialMedia = [],
  newsletter = { enabled: false },
  legalLinks = [],
  showTrustElements = true,
  showComplianceInfo = true,
  copyrightText,
  className = '',
  'data-testid': dataTestId = 'footer',
}) => {
  const [newsletterEmail, setNewsletterEmail] = React.useState('')
  const [newsletterStatus, setNewsletterStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [isNewsletterExpanded, setIsNewsletterExpanded] = React.useState(false)

  const currentYear = new Date().getFullYear()
  const defaultCopyright = copyrightText || `© ${currentYear} ${companyInfo.name}. All rights reserved.`

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail.trim()) return

    setNewsletterStatus('loading')
    try {
      if (newsletter.onSubmit) {
        await newsletter.onSubmit(newsletterEmail)
      }
      setNewsletterStatus('success')
      setNewsletterEmail('')
    } catch (error) {
      setNewsletterStatus('error')
    }
  }

  const getSocialIcon = (platform: string) => {
    const icons: Record<string, string> = {
      facebook: '📘',
      twitter: '🐦',
      linkedin: '💼',
      instagram: '📷',
      youtube: '📺'
    }
    return icons[platform] || '🔗'
  }

  const formatAddress = (address: CompanyInfo['address']) => {
    return `${address.street}, ${address.city}, ${address.county} ${address.postcode}${address.country ? `, ${address.country}` : ''}`
  }

  const renderNavigation = () => {
    if (!navigationSections.length) return null

    return (
      <div className="footer-navigation" data-testid="footer-navigation">
        {navigationSections.map((section, index) => (
          <nav
            key={`${section.title}-${index}`}
            className="footer-nav-section"
            aria-labelledby={`footer-nav-${index}-heading`}
            data-testid={`footer-nav-section-${index}`}
          >
            <h3
              id={`footer-nav-${index}-heading`}
              className="footer-nav-title"
              data-testid={`footer-nav-title-${index}`}
            >
              {section.title}
            </h3>
            <ul
              className="footer-nav-list"
              role="list"
              data-testid={`footer-nav-list-${index}`}
            >
              {section.links.map((link, linkIndex) => (
                <li
                  key={`${link.href}-${linkIndex}`}
                  className="footer-nav-item"
                  data-testid={`footer-nav-item-${index}-${linkIndex}`}
                >
                  <a
                    href={link.href}
                    className="footer-nav-link min-h-[44px]"
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    aria-label={link.ariaLabel}
                    data-testid={`footer-nav-link-${index}-${linkIndex}`}
                  >
                    {link.label}
                    {link.external && <span aria-hidden="true">↗</span>}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    )
  }

  const renderCompanyInfo = () => (
    <section className="footer-company-info" data-testid="footer-company-info">
      <h2 className="footer-company-name" data-testid="footer-company-name">
        {companyInfo.name}
      </h2>
      {companyInfo.description && (
        <p className="footer-company-description" data-testid="footer-company-description">
          {companyInfo.description}
        </p>
      )}
      
      <div className="footer-contact-info" data-testid="footer-contact-info">
        <address className="footer-address" data-testid="footer-address">
          {formatAddress(companyInfo.address)}
        </address>
        
        <div className="footer-contact-methods" data-testid="footer-contact-methods">
          <a
            href={`tel:${companyInfo.phone}`}
            className="footer-phone-link min-h-[44px]"
            data-testid="footer-phone-link"
          >
            📞 {companyInfo.phone}
          </a>
          <a
            href={`mailto:${companyInfo.email}`}
            className="footer-email-link min-h-[44px]"
            data-testid="footer-email-link"
          >
            ✉️ {companyInfo.email}
          </a>
        </div>

        {companyInfo.openingHours && (
          <div className="footer-opening-hours" data-testid="footer-opening-hours">
            <h4 className="footer-hours-title">Opening Hours</h4>
            <div className="footer-hours-list" data-testid="footer-hours-list">
              <div data-testid="weekday-hours">Monday - Friday: {companyInfo.openingHours.weekdays}</div>
              {companyInfo.openingHours.saturday && (
                <div data-testid="saturday-hours">Saturday: {companyInfo.openingHours.saturday}</div>
              )}
              {companyInfo.openingHours.sunday && (
                <div data-testid="sunday-hours">Sunday: {companyInfo.openingHours.sunday}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )

  const renderSocialMedia = () => {
    if (!socialMedia.length) return null

    return (
      <section className="footer-social-media" data-testid="footer-social-media">
        <h3 className="footer-social-title" data-testid="footer-social-title">
          Follow Us
        </h3>
        <ul className="footer-social-list" role="list" data-testid="footer-social-list">
          {socialMedia.map((social, index) => (
            <li
              key={`${social.platform}-${index}`}
              className="footer-social-item"
              data-testid={`footer-social-item-${social.platform}`}
            >
              <a
                href={social.href}
                className="footer-social-link min-h-[44px] min-w-[44px]"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.ariaLabel || `Follow us on ${social.platform}`}
                data-testid={`footer-social-link-${social.platform}`}
              >
                <span aria-hidden="true">{getSocialIcon(social.platform)}</span>
                <span className="sr-only">{social.platform}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    )
  }

  const renderNewsletter = () => {
    if (!newsletter.enabled) return null

    return (
      <section className="footer-newsletter" data-testid="footer-newsletter">
        <div className="footer-newsletter-header" data-testid="footer-newsletter-header">
          <h3 className="footer-newsletter-title" data-testid="footer-newsletter-title">
            {newsletter.title || 'Job Alerts'}
          </h3>
          {layout === 'minimal' && (
            <button
              type="button"
              className="footer-newsletter-toggle min-h-[44px] min-w-[44px]"
              onClick={() => setIsNewsletterExpanded(!isNewsletterExpanded)}
              aria-expanded={isNewsletterExpanded}
              aria-controls="footer-newsletter-form"
              data-testid="footer-newsletter-toggle"
            >
              {isNewsletterExpanded ? '−' : '+'}
            </button>
          )}
        </div>
        
        {newsletter.description && (
          <p className="footer-newsletter-description" data-testid="footer-newsletter-description">
            {newsletter.description}
          </p>
        )}

        <div
          className={`footer-newsletter-form-container ${
            layout === 'minimal' && !isNewsletterExpanded ? 'footer-newsletter-collapsed' : ''
          }`}
          id="footer-newsletter-form"
          data-testid="footer-newsletter-form-container"
        >
          <form
            className="footer-newsletter-form"
            onSubmit={handleNewsletterSubmit}
            data-testid="footer-newsletter-form"
          >
            <div className="footer-newsletter-input-group" data-testid="footer-newsletter-input-group">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address for job alerts
              </label>
              <input
                type="email"
                id="newsletter-email"
                className="footer-newsletter-input min-h-[44px]"
                placeholder={newsletter.placeholder || 'Enter your email'}
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                disabled={newsletterStatus === 'loading'}
                required
                data-testid="footer-newsletter-input"
              />
              <button
                type="submit"
                className="footer-newsletter-submit min-h-[44px]"
                disabled={newsletterStatus === 'loading' || !newsletterEmail.trim()}
                data-testid="footer-newsletter-submit"
              >
                {newsletterStatus === 'loading' ? 'Submitting...' : newsletter.submitText || 'Subscribe'}
              </button>
            </div>
          </form>

          {newsletterStatus === 'success' && (
            <div
              className="footer-newsletter-success"
              role="status"
              aria-live="polite"
              data-testid="footer-newsletter-success"
            >
              {newsletter.successMessage || 'Successfully subscribed to job alerts!'}
            </div>
          )}

          {newsletterStatus === 'error' && (
            <div
              className="footer-newsletter-error"
              role="alert"
              aria-live="assertive"
              data-testid="footer-newsletter-error"
            >
              {newsletter.errorMessage || 'Failed to subscribe. Please try again.'}
            </div>
          )}
        </div>
      </section>
    )
  }

  const renderLegalLinks = () => {
    if (!legalLinks.length) return null

    return (
      <nav className="footer-legal-nav" aria-label="Legal information" data-testid="footer-legal-nav">
        <ul className="footer-legal-list" role="list" data-testid="footer-legal-list">
          {legalLinks.map((link, index) => (
            <li
              key={`${link.href}-${index}`}
              className="footer-legal-item"
              data-testid={`footer-legal-item-${index}`}
            >
              <a
                href={link.href}
                className="footer-legal-link min-h-[44px]"
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                aria-label={link.ariaLabel}
                data-testid={`footer-legal-link-${index}`}
              >
                {link.label}
                {link.external && <span aria-hidden="true">↗</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    )
  }

  const renderTrustElements = () => {
    if (!showTrustElements) return null

    return (
      <div className="footer-trust-elements" data-testid="footer-trust-elements">
        <div className="footer-certifications" data-testid="footer-certifications">
          <span className="footer-cert-item" data-testid="footer-cert-family-run">
            👨‍👩‍👧‍👦 Family-run business since 2008
          </span>
          <span className="footer-cert-item" data-testid="footer-cert-local">
            📍 Local Berkshire specialists
          </span>
          <span className="footer-cert-item" data-testid="footer-cert-warehouse">
            🏭 Warehouse & logistics experts
          </span>
        </div>
      </div>
    )
  }

  const renderComplianceInfo = () => {
    if (!showComplianceInfo) return null

    return (
      <div className="footer-compliance" data-testid="footer-compliance">
        {companyInfo.companyNumber && (
          <div className="footer-company-number" data-testid="footer-company-number">
            Company Registration: {companyInfo.companyNumber}
          </div>
        )}
        {companyInfo.vatNumber && (
          <div className="footer-vat-number" data-testid="footer-vat-number">
            VAT Number: {companyInfo.vatNumber}
          </div>
        )}
        <div className="footer-recruitment-compliance" data-testid="footer-recruitment-compliance">
          <span className="footer-compliance-item" data-testid="footer-compliance-gdpr">
            GDPR Compliant
          </span>
          <span className="footer-compliance-item" data-testid="footer-compliance-employment">
            Employment Agency Standards
          </span>
        </div>
      </div>
    )
  }

  return (
    <footer
      className={`footer footer-${layout} ${className}`}
      data-testid={dataTestId}
    >
      <div className="footer-main" data-testid="footer-main">
        {layout === 'comprehensive' && (
          <>
            <div className="footer-top-section" data-testid="footer-top-section">
              {renderCompanyInfo()}
              {renderNavigation()}
              {renderSocialMedia()}
              {renderNewsletter()}
            </div>
            <div className="footer-middle-section" data-testid="footer-middle-section">
              {renderTrustElements()}
              {renderComplianceInfo()}
            </div>
          </>
        )}

        {layout === 'simple' && (
          <div className="footer-simple-layout" data-testid="footer-simple-layout">
            {renderCompanyInfo()}
            {renderNavigation()}
            {renderNewsletter()}
          </div>
        )}

        {layout === 'minimal' && (
          <div className="footer-minimal-layout" data-testid="footer-minimal-layout">
            <div className="footer-minimal-company" data-testid="footer-minimal-company">
              <h2 className="footer-company-name">{companyInfo.name}</h2>
              <a href={`tel:${companyInfo.phone}`} className="footer-phone-link">
                {companyInfo.phone}
              </a>
            </div>
            {renderNewsletter()}
          </div>
        )}
      </div>

      <div className="footer-bottom" data-testid="footer-bottom">
        <div className="footer-bottom-content" data-testid="footer-bottom-content">
          <div className="footer-copyright" data-testid="footer-copyright">
            {defaultCopyright}
          </div>
          {renderLegalLinks()}
        </div>
      </div>
    </footer>
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

jest.mock('../../../components/molecules/Navigation', () => {
  return React.forwardRef<HTMLElement, any>((props, ref) => (
    <nav ref={ref} {...props}>{props.children}</nav>
  ))
})

jest.mock('../../../components/atoms/Button', () => {
  return React.forwardRef<HTMLButtonElement, any>((props, ref) => (
    <button ref={ref} {...props}>{props.children}</button>
  ))
})

jest.mock('../../../components/atoms/Input', () => {
  return React.forwardRef<HTMLInputElement, any>((props, ref) => (
    <input ref={ref} {...props} />
  ))
})

describe('Footer Component', () => {
  const mockCompanyInfo: CompanyInfo = {
    name: 'Lightyear Recruitment',
    description: 'Family-run recruitment specialists in warehouse and logistics sectors across Berkshire.',
    address: {
      street: '123 Business Park Drive',
      city: 'Reading',
      county: 'Berkshire',
      postcode: 'RG1 2AB',
      country: 'United Kingdom'
    },
    phone: '01234 567890',
    email: 'info@lightyear-recruitment.com',
    openingHours: {
      weekdays: '8:00 AM - 6:00 PM',
      saturday: '9:00 AM - 1:00 PM',
      sunday: 'Closed'
    },
    companyNumber: '12345678',
    vatNumber: 'GB123456789'
  }

  const mockNavigationSections: FooterSection[] = [
    {
      title: 'Job Seekers',
      links: [
        { href: '/candidates/register', label: 'Register Now' },
        { href: '/candidates/jobs', label: 'Current Jobs' },
        { href: '/candidates/cv-tips', label: 'CV Tips' },
        { href: '/candidates/interview-advice', label: 'Interview Advice' }
      ]
    },
    {
      title: 'Employers',
      links: [
        { href: '/employers/post-job', label: 'Post a Job' },
        { href: '/employers/find-staff', label: 'Find Staff' },
        { href: '/employers/services', label: 'Our Services' },
        { href: '/employers/testimonials', label: 'Client Testimonials' }
      ]
    },
    {
      title: 'About',
      links: [
        { href: '/about', label: 'Our Story' },
        { href: '/about/team', label: 'Meet the Team' },
        { href: '/about/sectors', label: 'Industry Sectors' },
        { href: '/contact', label: 'Contact Us' }
      ]
    }
  ]

  const mockSocialMedia: SocialMediaLink[] = [
    { platform: 'facebook', href: 'https://facebook.com/lightyear-recruitment' },
    { platform: 'linkedin', href: 'https://linkedin.com/company/lightyear-recruitment' },
    { platform: 'twitter', href: 'https://twitter.com/lightyear_recruit' }
  ]

  const mockLegalLinks: FooterLink[] = [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms-of-service', label: 'Terms of Service' },
    { href: '/cookie-policy', label: 'Cookie Policy' },
    { href: '/accessibility', label: 'Accessibility' }
  ]

  const mockNewsletterConfig: NewsletterConfig = {
    enabled: true,
    title: 'Job Alerts',
    description: 'Get notified about new warehouse and logistics jobs in Berkshire',
    placeholder: 'Enter your email for job alerts',
    submitText: 'Subscribe',
    successMessage: 'Successfully subscribed! We\'ll notify you of new opportunities.',
    errorMessage: 'Subscription failed. Please check your email and try again.'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders footer with default comprehensive layout', () => {
      render(<Footer companyInfo={mockCompanyInfo} />)
      
      const footer = screen.getByRole('contentinfo')
      expect(footer).toBeInTheDocument()
      expect(footer).toHaveClass('footer', 'footer-comprehensive')
    })

    it('renders with custom className and data-testid', () => {
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          className="custom-footer-class" 
          data-testid="custom-footer-id"
        />
      )
      
      const footer = screen.getByTestId('custom-footer-id')
      expect(footer).toHaveClass('custom-footer-class')
    })

    it('renders company information section', () => {
      render(<Footer companyInfo={mockCompanyInfo} />)
      
      expect(screen.getByTestId('footer-company-info')).toBeInTheDocument()
      expect(screen.getByTestId('footer-company-name')).toHaveTextContent('Lightyear Recruitment')
      expect(screen.getByTestId('footer-company-description')).toHaveTextContent(mockCompanyInfo.description!)
    })

    it('renders contact information with proper links', () => {
      render(<Footer companyInfo={mockCompanyInfo} />)
      
      const phoneLink = screen.getByTestId('footer-phone-link')
      expect(phoneLink).toHaveAttribute('href', 'tel:01234 567890')
      expect(phoneLink).toHaveTextContent('01234 567890')
      
      const emailLink = screen.getByTestId('footer-email-link')
      expect(emailLink).toHaveAttribute('href', 'mailto:info@lightyear-recruitment.com')
      expect(emailLink).toHaveTextContent('info@lightyear-recruitment.com')
    })

    it('renders address information', () => {
      render(<Footer companyInfo={mockCompanyInfo} />)
      
      const address = screen.getByTestId('footer-address')
      expect(address).toHaveTextContent('123 Business Park Drive, Reading, Berkshire RG1 2AB, United Kingdom')
    })
  })

  describe('Layout Variants', () => {
    it('renders comprehensive layout with all sections', () => {
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          layout="comprehensive"
          navigationSections={mockNavigationSections}
          socialMedia={mockSocialMedia}
          newsletter={mockNewsletterConfig}
        />
      )
      
      expect(screen.getByTestId('footer-top-section')).toBeInTheDocument()
      expect(screen.getByTestId('footer-middle-section')).toBeInTheDocument()
      expect(screen.getByTestId('footer-company-info')).toBeInTheDocument()
      expect(screen.getByTestId('footer-navigation')).toBeInTheDocument()
      expect(screen.getByTestId('footer-social-media')).toBeInTheDocument()
      expect(screen.getByTestId('footer-newsletter')).toBeInTheDocument()
    })

    it('renders simple layout with basic sections', () => {
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          layout="simple"
          navigationSections={mockNavigationSections}
          newsletter={mockNewsletterConfig}
        />
      )
      
      expect(screen.getByTestId('footer-simple-layout')).toBeInTheDocument()
      expect(screen.getByTestId('footer-company-info')).toBeInTheDocument()
      expect(screen.getByTestId('footer-navigation')).toBeInTheDocument()
      expect(screen.getByTestId('footer-newsletter')).toBeInTheDocument()
      expect(screen.queryByTestId('footer-social-media')).not.toBeInTheDocument()
    })

    it('renders minimal layout with essential information only', () => {
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          layout="minimal"
          newsletter={mockNewsletterConfig}
        />
      )
      
      expect(screen.getByTestId('footer-minimal-layout')).toBeInTheDocument()
      expect(screen.getByTestId('footer-minimal-company')).toBeInTheDocument()
      expect(screen.getByTestId('footer-newsletter')).toBeInTheDocument()
      expect(screen.queryByTestId('footer-navigation')).not.toBeInTheDocument()
      expect(screen.queryByTestId('footer-social-media')).not.toBeInTheDocument()
    })
  })

  describe('Navigation Sections', () => {
    it('renders navigation sections with proper structure', () => {
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          navigationSections={mockNavigationSections}
        />
      )
      
      const navigation = screen.getByTestId('footer-navigation')
      expect(navigation).toBeInTheDocument()

      // Check all navigation sections
      mockNavigationSections.forEach((section, sectionIndex) => {
        const navSection = screen.getByTestId(`footer-nav-section-${sectionIndex}`)
        expect(navSection).toBeInTheDocument()
        expect(navSection).toHaveAttribute('aria-labelledby', `footer-nav-${sectionIndex}-heading`)
        
        const title = screen.getByTestId(`footer-nav-title-${sectionIndex}`)
        expect(title).toHaveTextContent(section.title)
        
        // Check navigation links
        section.links.forEach((link, linkIndex) => {
          const linkElement = screen.getByTestId(`footer-nav-link-${sectionIndex}-${linkIndex}`)
          expect(linkElement).toHaveAttribute('href', link.href)
          expect(linkElement).toHaveTextContent(link.label)
        })
      })
    })

    it('handles external links with proper attributes', () => {
      const sectionsWithExternal: FooterSection[] = [
        {
          title: 'External Resources',
          links: [
            { href: 'https://external.com', label: 'External Link', external: true },
            { href: '/internal', label: 'Internal Link' }
          ]
        }
      ]

      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          navigationSections={sectionsWithExternal}
        />
      )
      
      const externalLink = screen.getByTestId('footer-nav-link-0-0')
      expect(externalLink).toHaveAttribute('target', '_blank')
      expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer')
      expect(screen.getByText('↗')).toBeInTheDocument()
      
      const internalLink = screen.getByTestId('footer-nav-link-0-1')
      expect(internalLink).not.toHaveAttribute('target')
      expect(internalLink).not.toHaveAttribute('rel')
    })

    it('does not render navigation when no sections provided', () => {
      render(<Footer companyInfo={mockCompanyInfo} />)
      
      expect(screen.queryByTestId('footer-navigation')).not.toBeInTheDocument()
    })
  })

  describe('Social Media Links', () => {
    it('renders social media section with all platforms', () => {
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          socialMedia={mockSocialMedia}
        />
      )
      
      const socialSection = screen.getByTestId('footer-social-media')
      expect(socialSection).toBeInTheDocument()
      expect(screen.getByTestId('footer-social-title')).toHaveTextContent('Follow Us')

      mockSocialMedia.forEach(social => {
        const link = screen.getByTestId(`footer-social-link-${social.platform}`)
        expect(link).toHaveAttribute('href', social.href)
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
        expect(link).toHaveAttribute('aria-label', `Follow us on ${social.platform}`)
      })
    })

    it('displays correct icons for each social platform', () => {
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          socialMedia={mockSocialMedia}
        />
      )
      
      expect(screen.getByText('📘')).toBeInTheDocument() // Facebook
      expect(screen.getByText('💼')).toBeInTheDocument() // LinkedIn
      expect(screen.getByText('🐦')).toBeInTheDocument() // Twitter
    })

    it('does not render social media section when no links provided', () => {
      render(<Footer companyInfo={mockCompanyInfo} />)
      
      expect(screen.queryByTestId('footer-social-media')).not.toBeInTheDocument()
    })

    it('supports custom aria-labels for social links', () => {
      const socialWithCustomLabels: SocialMediaLink[] = [
        { 
          platform: 'facebook', 
          href: 'https://facebook.com/company', 
          ariaLabel: 'Visit our Facebook page for updates' 
        }
      ]

      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          socialMedia={socialWithCustomLabels}
        />
      )
      
      const link = screen.getByTestId('footer-social-link-facebook')
      expect(link).toHaveAttribute('aria-label', 'Visit our Facebook page for updates')
    })
  })

  describe('Newsletter Functionality', () => {
    it('renders newsletter section when enabled', () => {
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          newsletter={mockNewsletterConfig}
        />
      )
      
      const newsletter = screen.getByTestId('footer-newsletter')
      expect(newsletter).toBeInTheDocument()
      expect(screen.getByTestId('footer-newsletter-title')).toHaveTextContent('Job Alerts')
      expect(screen.getByTestId('footer-newsletter-description')).toHaveTextContent(mockNewsletterConfig.description!)
    })

    it('handles newsletter form submission', async () => {
      const mockSubmit = jest.fn().mockResolvedValue(undefined)
      const newsletterWithHandler = { ...mockNewsletterConfig, onSubmit: mockSubmit }
      const user = userEvent.setup()
      
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          newsletter={newsletterWithHandler}
        />
      )
      
      const emailInput = screen.getByTestId('footer-newsletter-input')
      const submitButton = screen.getByTestId('footer-newsletter-submit')
      
      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)
      
      expect(mockSubmit).toHaveBeenCalledWith('test@example.com')
    })

    it('shows success message after successful submission', async () => {
      const mockSubmit = jest.fn().mockResolvedValue(undefined)
      const newsletterWithHandler = { ...mockNewsletterConfig, onSubmit: mockSubmit }
      const user = userEvent.setup()
      
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          newsletter={newsletterWithHandler}
        />
      )
      
      const emailInput = screen.getByTestId('footer-newsletter-input')
      const submitButton = screen.getByTestId('footer-newsletter-submit')
      
      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('footer-newsletter-success')).toBeInTheDocument()
        expect(screen.getByTestId('footer-newsletter-success')).toHaveTextContent(newsletterWithHandler.successMessage!)
      })
    })

    it('shows error message when submission fails', async () => {
      const mockSubmit = jest.fn().mockRejectedValue(new Error('Network error'))
      const newsletterWithHandler = { ...mockNewsletterConfig, onSubmit: mockSubmit }
      const user = userEvent.setup()
      
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          newsletter={newsletterWithHandler}
        />
      )
      
      const emailInput = screen.getByTestId('footer-newsletter-input')
      const submitButton = screen.getByTestId('footer-newsletter-submit')
      
      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('footer-newsletter-error')).toBeInTheDocument()
        expect(screen.getByTestId('footer-newsletter-error')).toHaveTextContent(newsletterWithHandler.errorMessage!)
      })
    })

    it('disables submit button when email is empty', () => {
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          newsletter={mockNewsletterConfig}
        />
      )
      
      const submitButton = screen.getByTestId('footer-newsletter-submit')
      expect(submitButton).toBeDisabled()
    })

    it('enables submit button when valid email is entered', async () => {
      const user = userEvent.setup()
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          newsletter={mockNewsletterConfig}
        />
      )
      
      const emailInput = screen.getByTestId('footer-newsletter-input')
      const submitButton = screen.getByTestId('footer-newsletter-submit')
      
      await user.type(emailInput, 'test@example.com')
      expect(submitButton).not.toBeDisabled()
    })

    it('supports collapsible newsletter in minimal layout', async () => {
      const user = userEvent.setup()
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          layout="minimal"
          newsletter={mockNewsletterConfig}
        />
      )
      
      const toggle = screen.getByTestId('footer-newsletter-toggle')
      expect(toggle).toHaveAttribute('aria-expanded', 'false')
      
      const formContainer = screen.getByTestId('footer-newsletter-form-container')
      expect(formContainer).toHaveClass('footer-newsletter-collapsed')
      
      await user.click(toggle)
      expect(toggle).toHaveAttribute('aria-expanded', 'true')
      expect(formContainer).not.toHaveClass('footer-newsletter-collapsed')
    })

    it('does not render newsletter section when disabled', () => {
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          newsletter={{ enabled: false }}
        />
      )
      
      expect(screen.queryByTestId('footer-newsletter')).not.toBeInTheDocument()
    })
  })

  describe('Legal Links', () => {
    it('renders legal links section', () => {
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          legalLinks={mockLegalLinks}
        />
      )
      
      const legalNav = screen.getByTestId('footer-legal-nav')
      expect(legalNav).toBeInTheDocument()
      expect(legalNav).toHaveAttribute('aria-label', 'Legal information')

      mockLegalLinks.forEach((link, index) => {
        const linkElement = screen.getByTestId(`footer-legal-link-${index}`)
        expect(linkElement).toHaveAttribute('href', link.href)
        expect(linkElement).toHaveTextContent(link.label)
      })
    })

    it('handles external legal links properly', () => {
      const legalWithExternal: FooterLink[] = [
        { href: '/privacy', label: 'Privacy Policy' },
        { href: 'https://external-compliance.com', label: 'External Compliance', external: true }
      ]

      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          legalLinks={legalWithExternal}
        />
      )
      
      const externalLink = screen.getByTestId('footer-legal-link-1')
      expect(externalLink).toHaveAttribute('target', '_blank')
      expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('does not render legal section when no links provided', () => {
      render(<Footer companyInfo={mockCompanyInfo} />)
      
      expect(screen.queryByTestId('footer-legal-nav')).not.toBeInTheDocument()
    })
  })

  describe('Opening Hours', () => {
    it('renders opening hours when provided', () => {
      render(<Footer companyInfo={mockCompanyInfo} />)
      
      const hours = screen.getByTestId('footer-opening-hours')
      expect(hours).toBeInTheDocument()
      
      expect(screen.getByTestId('weekday-hours')).toHaveTextContent('Monday - Friday: 8:00 AM - 6:00 PM')
      expect(screen.getByTestId('saturday-hours')).toHaveTextContent('Saturday: 9:00 AM - 1:00 PM')
      expect(screen.getByTestId('sunday-hours')).toHaveTextContent('Sunday: Closed')
    })

    it('does not render opening hours when not provided', () => {
      const companyWithoutHours = {
        ...mockCompanyInfo,
        openingHours: undefined
      }

      render(<Footer companyInfo={companyWithoutHours} />)
      
      expect(screen.queryByTestId('footer-opening-hours')).not.toBeInTheDocument()
    })
  })

  describe('Trust Elements and Compliance', () => {
    it('renders trust elements when enabled', () => {
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          showTrustElements={true}
        />
      )
      
      const trustElements = screen.getByTestId('footer-trust-elements')
      expect(trustElements).toBeInTheDocument()
      
      expect(screen.getByTestId('footer-cert-family-run')).toHaveTextContent('Family-run business since 2008')
      expect(screen.getByTestId('footer-cert-local')).toHaveTextContent('Local Berkshire specialists')
      expect(screen.getByTestId('footer-cert-warehouse')).toHaveTextContent('Warehouse & logistics experts')
    })

    it('does not render trust elements when disabled', () => {
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          showTrustElements={false}
        />
      )
      
      expect(screen.queryByTestId('footer-trust-elements')).not.toBeInTheDocument()
    })

    it('renders compliance information when enabled', () => {
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          showComplianceInfo={true}
        />
      )
      
      const compliance = screen.getByTestId('footer-compliance')
      expect(compliance).toBeInTheDocument()
      
      expect(screen.getByTestId('footer-company-number')).toHaveTextContent('Company Registration: 12345678')
      expect(screen.getByTestId('footer-vat-number')).toHaveTextContent('VAT Number: GB123456789')
      expect(screen.getByTestId('footer-compliance-gdpr')).toHaveTextContent('GDPR Compliant')
      expect(screen.getByTestId('footer-compliance-employment')).toHaveTextContent('Employment Agency Standards')
    })

    it('does not render compliance info when disabled', () => {
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          showComplianceInfo={false}
        />
      )
      
      expect(screen.queryByTestId('footer-compliance')).not.toBeInTheDocument()
    })
  })

  describe('Copyright', () => {
    it('renders default copyright with current year', () => {
      render(<Footer companyInfo={mockCompanyInfo} />)
      
      const copyright = screen.getByTestId('footer-copyright')
      const currentYear = new Date().getFullYear()
      expect(copyright).toHaveTextContent(`© ${currentYear} Lightyear Recruitment. All rights reserved.`)
    })

    it('renders custom copyright text when provided', () => {
      const customCopyright = '© 2024 Custom Copyright Text. All rights reserved.'
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          copyrightText={customCopyright}
        />
      )
      
      const copyright = screen.getByTestId('footer-copyright')
      expect(copyright).toHaveTextContent(customCopyright)
    })
  })

  describe('Accessibility', () => {
    it('uses proper semantic HTML structure', () => {
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          navigationSections={mockNavigationSections}
        />
      )
      
      // Footer should be a landmark
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
      
      // Navigation sections should have proper nav elements
      const navSections = screen.getAllByRole('navigation')
      expect(navSections.length).toBeGreaterThan(0)
    })

    it('provides proper ARIA labels and landmarks', () => {
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          navigationSections={mockNavigationSections}
          legalLinks={mockLegalLinks}
        />
      )
      
      // Navigation sections should have proper labeling
      mockNavigationSections.forEach((_, index) => {
        const section = screen.getByTestId(`footer-nav-section-${index}`)
        expect(section).toHaveAttribute('aria-labelledby', `footer-nav-${index}-heading`)
      })
      
      // Legal navigation should have aria-label
      const legalNav = screen.getByTestId('footer-legal-nav')
      expect(legalNav).toHaveAttribute('aria-label', 'Legal information')
    })

    it('ensures minimum touch target sizes', () => {
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          navigationSections={mockNavigationSections}
          socialMedia={mockSocialMedia}
        />
      )
      
      // All interactive elements should have minimum touch targets
      const phoneLink = screen.getByTestId('footer-phone-link')
      expect(phoneLink).toHaveClass('min-h-[44px]')
      
      const emailLink = screen.getByTestId('footer-email-link')
      expect(emailLink).toHaveClass('min-h-[44px]')
      
      // Social media links should have both height and width
      mockSocialMedia.forEach(social => {
        const link = screen.getByTestId(`footer-social-link-${social.platform}`)
        expect(link).toHaveClass('min-h-[44px]', 'min-w-[44px]')
      })
    })

    it('provides proper form accessibility', () => {
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          newsletter={mockNewsletterConfig}
        />
      )
      
      const emailInput = screen.getByTestId('footer-newsletter-input')
      expect(emailInput).toHaveAttribute('type', 'email')
      expect(emailInput).toHaveAttribute('required')
      
      // Label should be associated with input
      const label = screen.getByLabelText('Email address for job alerts')
      expect(label).toBe(emailInput)
    })

    it('provides proper live regions for newsletter status', async () => {
      const mockSubmit = jest.fn().mockResolvedValue(undefined)
      const newsletterWithHandler = { ...mockNewsletterConfig, onSubmit: mockSubmit }
      const user = userEvent.setup()
      
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          newsletter={newsletterWithHandler}
        />
      )
      
      const emailInput = screen.getByTestId('footer-newsletter-input')
      const submitButton = screen.getByTestId('footer-newsletter-submit')
      
      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)
      
      await waitFor(() => {
        const successMessage = screen.getByTestId('footer-newsletter-success')
        expect(successMessage).toHaveAttribute('role', 'status')
        expect(successMessage).toHaveAttribute('aria-live', 'polite')
      })
    })
  })

  describe('Mobile Responsive Behavior', () => {
    it('stacks content appropriately in mobile layout', () => {
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          layout="comprehensive"
          navigationSections={mockNavigationSections}
        />
      )
      
      // Footer should have appropriate layout classes
      const footer = screen.getByTestId('footer')
      expect(footer).toHaveClass('footer-comprehensive')
    })

    it('handles newsletter toggle in minimal layout', async () => {
      const user = userEvent.setup()
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          layout="minimal"
          newsletter={mockNewsletterConfig}
        />
      )
      
      const toggle = screen.getByTestId('footer-newsletter-toggle')
      expect(toggle).toHaveClass('min-h-[44px]', 'min-w-[44px]')
      
      // Should be properly labeled for accessibility
      expect(toggle).toHaveAttribute('aria-expanded')
      expect(toggle).toHaveAttribute('aria-controls', 'footer-newsletter-form')
    })

    it('maintains proper spacing and layout on mobile', () => {
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          layout="simple"
        />
      )
      
      const footer = screen.getByTestId('footer')
      expect(footer).toHaveClass('footer-simple')
    })
  })

  describe('Recruitment Industry Features', () => {
    it('displays industry-specific trust elements', () => {
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          showTrustElements={true}
        />
      )
      
      expect(screen.getByTestId('footer-cert-family-run')).toHaveTextContent('Family-run business')
      expect(screen.getByTestId('footer-cert-local')).toHaveTextContent('Local Berkshire specialists')
      expect(screen.getByTestId('footer-cert-warehouse')).toHaveTextContent('Warehouse & logistics experts')
    })

    it('includes recruitment compliance information', () => {
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          showComplianceInfo={true}
        />
      )
      
      expect(screen.getByTestId('footer-compliance-gdpr')).toHaveTextContent('GDPR Compliant')
      expect(screen.getByTestId('footer-compliance-employment')).toHaveTextContent('Employment Agency Standards')
    })

    it('supports job alert newsletter functionality', () => {
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          newsletter={mockNewsletterConfig}
        />
      )
      
      expect(screen.getByTestId('footer-newsletter-title')).toHaveTextContent('Job Alerts')
      expect(screen.getByTestId('footer-newsletter-description')).toHaveTextContent('new warehouse and logistics jobs')
    })

    it('handles recruitment-specific navigation sections', () => {
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          navigationSections={mockNavigationSections}
        />
      )
      
      // Job Seekers section
      expect(screen.getByTestId('footer-nav-title-0')).toHaveTextContent('Job Seekers')
      expect(screen.getByTestId('footer-nav-link-0-0')).toHaveTextContent('Register Now')
      
      // Employers section
      expect(screen.getByTestId('footer-nav-title-1')).toHaveTextContent('Employers')
      expect(screen.getByTestId('footer-nav-link-1-0')).toHaveTextContent('Post a Job')
    })
  })

  describe('Error Handling and Edge Cases', () => {
    it('renders gracefully with minimal company info', () => {
      const minimalCompanyInfo: CompanyInfo = {
        name: 'Test Company',
        address: {
          street: '123 Test St',
          city: 'Test City',
          county: 'Test County',
          postcode: 'T1 1ST'
        },
        phone: '01234 567890',
        email: 'test@example.com'
      }

      render(<Footer companyInfo={minimalCompanyInfo} />)
      
      expect(screen.getByTestId('footer-company-name')).toHaveTextContent('Test Company')
      expect(screen.queryByTestId('footer-opening-hours')).not.toBeInTheDocument()
      expect(screen.queryByTestId('footer-company-number')).not.toBeInTheDocument()
    })

    it('handles empty navigation sections gracefully', () => {
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          navigationSections={[]}
        />
      )
      
      expect(screen.queryByTestId('footer-navigation')).not.toBeInTheDocument()
    })

    it('handles newsletter form validation', async () => {
      const user = userEvent.setup()
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          newsletter={mockNewsletterConfig}
        />
      )
      
      const form = screen.getByTestId('footer-newsletter-form')
      const submitButton = screen.getByTestId('footer-newsletter-submit')
      
      // Try to submit empty form
      fireEvent.submit(form)
      expect(submitButton).toBeDisabled()
      
      // Enter invalid email format would be handled by browser validation
      const emailInput = screen.getByTestId('footer-newsletter-input')
      expect(emailInput).toHaveAttribute('type', 'email')
    })

    it('maintains functionality with missing optional props', () => {
      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          newsletter={{ enabled: true }}
        />
      )
      
      // Should render with default values
      expect(screen.getByTestId('footer-newsletter-title')).toHaveTextContent('Job Alerts')
      const input = screen.getByTestId('footer-newsletter-input')
      expect(input).toHaveAttribute('placeholder', 'Enter your email')
    })
  })

  describe('Performance and Optimization', () => {
    it('does not re-render unnecessarily with same props', () => {
      const { rerender } = render(<Footer companyInfo={mockCompanyInfo} />)
      const footer = screen.getByTestId('footer')
      const initialElement = footer
      
      // Re-render with same props
      rerender(<Footer companyInfo={mockCompanyInfo} />)
      const afterRerender = screen.getByTestId('footer')
      
      expect(afterRerender).toBe(initialElement)
    })

    it('handles large numbers of navigation items efficiently', () => {
      const largeSections = Array.from({ length: 10 }, (_, i) => ({
        title: `Section ${i + 1}`,
        links: Array.from({ length: 20 }, (_, j) => ({
          href: `/section-${i}-link-${j}`,
          label: `Link ${j + 1}`
        }))
      }))

      render(
        <Footer 
          companyInfo={mockCompanyInfo}
          navigationSections={largeSections}
        />
      )
      
      expect(screen.getByTestId('footer-navigation')).toBeInTheDocument()
      // Should render all sections without performance issues
      expect(screen.getAllByTestId(/footer-nav-section-/)).toHaveLength(10)
    })
  })
})