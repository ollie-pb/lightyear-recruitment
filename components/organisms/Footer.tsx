import React, { forwardRef, useState } from 'react'
import Heading from '../atoms/Heading'
import Text from '../atoms/Text'
import Button from '../atoms/Button'
import Icon from '../atoms/Icon'
import Link from '../atoms/Link'
import FormGroup from '../molecules/FormGroup'
import Navigation from '../molecules/Navigation'
import type { NavigationItem } from '../molecules/Navigation'

export interface FooterSection {
  title: string
  items: NavigationItem[]
}

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  // Layout
  layout?: 'simple' | 'comprehensive' | 'minimal'
  
  // Company information
  companyName?: string
  companyDescription?: string
  address?: {
    street: string
    city: string
    postcode: string
    country?: string
  }
  
  // Contact details
  contactPhone?: string
  contactEmail?: string
  openingHours?: Array<{
    day: string
    hours: string
    closed?: boolean
  }>
  
  // Navigation sections
  navigationSections?: FooterSection[]
  
  // Social media
  socialLinks?: Array<{
    platform: 'facebook' | 'linkedin' | 'twitter' | 'instagram' | 'youtube'
    url: string
    label?: string
  }>
  
  // Newsletter
  showNewsletter?: boolean
  newsletterTitle?: string
  newsletterDescription?: string
  onNewsletterSubmit?: (email: string) => Promise<void>
  
  // Legal
  legalLinks?: NavigationItem[]
  copyrightText?: string
  
  // Trust elements
  trustElements?: Array<{
    text: string
    icon?: React.ReactNode
  }>
  
  className?: string
  'data-testid'?: string
}

const Footer = forwardRef<HTMLElement, FooterProps>(
  (
    {
      layout = 'comprehensive',
      companyName = 'Lightyear Recruitment',
      companyDescription = 'Family-run recruitment agency specializing in warehouse and logistics roles across Berkshire.',
      address,
      contactPhone,
      contactEmail,
      openingHours,
      navigationSections = [],
      socialLinks = [],
      showNewsletter = true,
      newsletterTitle = 'Stay Updated',
      newsletterDescription = 'Get the latest job alerts and recruitment news.',
      onNewsletterSubmit,
      legalLinks = [],
      copyrightText,
      trustElements = [],
      className = '',
      ...props
    },
    ref
  ) => {
    const [newsletterEmail, setNewsletterEmail] = useState('')
    const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
    const [newsletterError, setNewsletterError] = useState('')
    const [newsletterCollapsed, setNewsletterCollapsed] = useState(false)

    const currentYear = new Date().getFullYear()
    
    const handleNewsletterSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      
      if (!newsletterEmail.trim()) {
        setNewsletterError('Email address is required')
        return
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
        setNewsletterError('Please enter a valid email address')
        return
      }
      
      setNewsletterStatus('submitting')
      setNewsletterError('')
      
      try {
        await onNewsletterSubmit?.(newsletterEmail)
        setNewsletterStatus('success')
        setNewsletterEmail('')
      } catch (error) {
        setNewsletterStatus('error')
        setNewsletterError('Something went wrong. Please try again.')
      }
    }

    const getSocialIcon = (platform: string) => {
      const icons = {
        facebook: 'facebook',
        linkedin: 'linkedin',
        twitter: 'twitter',
        instagram: 'instagram',
        youtube: 'youtube',
      }
      return icons[platform as keyof typeof icons] || 'link'
    }

    const formatOpeningHours = (hours: typeof openingHours) => {
      if (!hours || hours.length === 0) return null
      
      return hours.map((item, index) => (
        <div key={index} className="flex justify-between items-center py-1">
          <Text size="sm" weight="medium">{item.day}</Text>
          <Text size="sm" color={item.closed ? 'muted' : 'default'}>
            {item.closed ? 'Closed' : item.hours}
          </Text>
        </div>
      ))
    }

    if (layout === 'minimal') {
      return (
        <footer
          ref={ref}
          className={`bg-gray-50 border-t border-gray-200 py-8 ${className}`}
          role="contentinfo"
          {...props}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Text size="sm" color="muted">
                {copyrightText || `© ${currentYear} ${companyName}. All rights reserved.`}
              </Text>
              {legalLinks.length > 0 && (
                <div className="mt-4">
                  <Navigation
                    items={legalLinks}
                    layout="inline"
                    type="secondary"
                    className="justify-center"
                    data-testid="footer-legal-links"
                  />
                </div>
              )}
            </div>
          </div>
        </footer>
      )
    }

    return (
      <footer
        ref={ref}
        className={`bg-gray-900 text-white ${className}`}
        role="contentinfo"
        {...props}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main footer content */}
          <div className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Company Information */}
              <div className="lg:col-span-1">
                <Heading level={3} size="lg" color="inverse" className="mb-4">
                  {companyName}
                </Heading>
                
                {companyDescription && (
                  <Text size="sm" color="muted" className="mb-4">
                    {companyDescription}
                  </Text>
                )}

                {/* Contact Information */}
                <div className="space-y-2 mb-6" data-testid="footer-contact-info">
                  {address && (
                    <div className="flex items-start gap-2">
                      <Icon name="map-pin" size="sm" color="muted" className="mt-0.5 flex-shrink-0" />
                      <Text size="sm" color="muted">
                        {address.street}<br />
                        {address.city} {address.postcode}<br />
                        {address.country || 'United Kingdom'}
                      </Text>
                    </div>
                  )}
                  
                  {contactPhone && (
                    <div className="flex items-center gap-2">
                      <Icon name="phone" size="sm" color="muted" />
                      <Link
                        href={`tel:${contactPhone}`}
                        color="muted"
                        className="hover:text-white"
                      >
                        {contactPhone}
                      </Link>
                    </div>
                  )}
                  
                  {contactEmail && (
                    <div className="flex items-center gap-2">
                      <Icon name="email" size="sm" color="muted" />
                      <Link
                        href={`mailto:${contactEmail}`}
                        color="muted"
                        className="hover:text-white"
                      >
                        {contactEmail}
                      </Link>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                {socialLinks.length > 0 && (
                  <div data-testid="footer-social-links">
                    <Text size="sm" weight="medium" color="inverse" className="mb-3">
                      Follow Us
                    </Text>
                    <div className="flex gap-3">
                      {socialLinks.map((link, index) => (
                        <Link
                          key={index}
                          href={link.url}
                          external
                          className="text-gray-400 hover:text-white transition-colors"
                          aria-label={link.label || `Visit our ${link.platform} page`}
                        >
                          <Icon name={getSocialIcon(link.platform)} size="base" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Sections */}
              {navigationSections.map((section, index) => (
                <div key={index} className="lg:col-span-1">
                  <Heading level={4} size="base" color="inverse" className="mb-4">
                    {section.title}
                  </Heading>
                  <Navigation
                    items={section.items}
                    layout="vertical"
                    type="secondary"
                    aria-label={`${section.title} navigation`}
                    className="space-y-2"
                  />
                </div>
              ))}

              {/* Newsletter & Opening Hours */}
              {(showNewsletter || openingHours) && (
                <div className="lg:col-span-1">
                  {/* Newsletter Signup */}
                  {showNewsletter && (
                    <div className="mb-8" data-testid="footer-newsletter">
                      <div className="flex items-center justify-between mb-2">
                        <Heading level={4} size="base" color="inverse">
                          {newsletterTitle}
                        </Heading>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setNewsletterCollapsed(!newsletterCollapsed)}
                          aria-expanded={!newsletterCollapsed}
                          className="text-gray-400 hover:text-white lg:hidden"
                          data-testid="newsletter-toggle"
                        >
                          <Icon name={newsletterCollapsed ? 'chevron-down' : 'chevron-up'} size="sm" />
                        </Button>
                      </div>
                      
                      <div className={`${newsletterCollapsed ? 'hidden' : 'block'} lg:block`}>
                        {newsletterDescription && (
                          <Text size="sm" color="muted" className="mb-4">
                            {newsletterDescription}
                          </Text>
                        )}

                        <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                          <FormGroup
                            name="newsletter-email"
                            type="email"
                            placeholder="Enter your email"
                            value={newsletterEmail}
                            onChange={(value) => setNewsletterEmail(value as string)}
                            error={newsletterError}
                            disabled={newsletterStatus === 'submitting'}
                            size="sm"
                          />
                          
                          <Button
                            type="submit"
                            variant="secondary"
                            size="sm"
                            disabled={newsletterStatus === 'submitting'}
                            className="w-full"
                            data-testid="newsletter-submit"
                          >
                            {newsletterStatus === 'submitting' ? 'Subscribing...' : 'Subscribe'}
                          </Button>
                        </form>

                        {newsletterStatus === 'success' && (
                          <Text
                            size="sm"
                            color="success"
                            className="mt-2"
                            role="alert"
                            aria-live="polite"
                          >
                            Successfully subscribed!
                          </Text>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Opening Hours */}
                  {openingHours && openingHours.length > 0 && (
                    <div data-testid="footer-opening-hours">
                      <Heading level={4} size="base" color="inverse" className="mb-4">
                        Opening Hours
                      </Heading>
                      <div className="space-y-1">
                        {formatOpeningHours(openingHours)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Trust Elements */}
          {trustElements.length > 0 && (
            <div className="border-t border-gray-800 py-6" data-testid="footer-trust-elements">
              <div className="flex flex-wrap justify-center items-center gap-6 text-center">
                {trustElements.map((element, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {element.icon && (
                      <span className="text-gray-400">
                        {React.isValidElement(element.icon) ? element.icon : <Icon src={element.icon as any} size="sm" />}
                      </span>
                    )}
                    <Text size="xs" color="muted">
                      {element.text}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <Text size="sm" color="muted">
                {copyrightText || `© ${currentYear} ${companyName}. All rights reserved.`}
              </Text>
              
              {legalLinks.length > 0 && (
                <Navigation
                  items={legalLinks}
                  layout="inline"
                  type="secondary"
                  data-testid="footer-legal-links"
                />
              )}
            </div>
          </div>
        </div>
      </footer>
    )
  }
)

Footer.displayName = 'Footer'

export default Footer