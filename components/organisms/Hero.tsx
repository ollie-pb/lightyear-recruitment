import React, { forwardRef, useState } from 'react'
import Heading from '../atoms/Heading'
import Text from '../atoms/Text'
import Button from '../atoms/Button'
import Icon from '../atoms/Icon'
import FormGroup from '../molecules/FormGroup'
import Card from '../molecules/Card'

export interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  // Layout and styling
  layout?: 'centered' | 'left-aligned' | 'with-image'
  size?: 'compact' | 'standard' | 'large'
  
  // Content
  headline?: string
  subheadline?: string  
  description?: string
  
  // CTAs
  primaryCta?: {
    text: string
    href?: string
    onClick?: () => void
    variant?: 'primary' | 'secondary'
  }
  secondaryCta?: {
    text: string
    href?: string
    onClick?: () => void
    variant?: 'outline' | 'ghost'
  }
  
  // Background
  backgroundImage?: string
  backgroundVideo?: string
  backgroundColor?: string
  
  // Quick registration form
  showQuickForm?: boolean
  formTitle?: string
  onFormSubmit?: (data: { name: string; email: string; phone: string }) => void
  
  // Social proof
  testimonial?: {
    text: string
    author: string
    role: string
    company: string
    image?: string
  }
  statistics?: Array<{
    value: string
    label: string
    icon?: React.ReactNode
  }>
  
  // Content positioning
  imagePosition?: 'left' | 'right'
  imageUrl?: string
  imageAlt?: string
  
  className?: string
  'data-testid'?: string
}

const Hero = forwardRef<HTMLElement, HeroProps>(
  (
    {
      layout = 'centered',
      size = 'standard',
      headline,
      subheadline,
      description,
      primaryCta,
      secondaryCta,
      backgroundImage,
      backgroundVideo,
      backgroundColor = 'bg-white',
      showQuickForm = false,
      formTitle = 'Quick Registration',
      onFormSubmit,
      testimonial,
      statistics,
      imagePosition = 'right',
      imageUrl,
      imageAlt,
      className = '',
      ...props
    },
    ref
  ) => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' })
    const [formErrors, setFormErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const sizeClasses = {
      compact: 'py-12 md:py-16',
      standard: 'py-16 md:py-24',
      large: 'py-24 md:py-32',
    }

    const headlineSizes = {
      compact: '2xl' as const,
      standard: '3xl' as const,
      large: '4xl' as const,
    }

    const layoutClasses = {
      centered: 'text-center',
      'left-aligned': 'text-left',
      'with-image': 'text-left',
    }

    const validateForm = () => {
      const errors: Record<string, string> = {}
      
      if (!formData.name.trim()) {
        errors.name = 'Name is required'
      }
      
      if (!formData.email.trim()) {
        errors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Please enter a valid email address'
      }
      
      if (!formData.phone.trim()) {
        errors.phone = 'Phone number is required'
      }
      
      setFormErrors(errors)
      return Object.keys(errors).length === 0
    }

    const handleFormSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      
      if (!validateForm()) return
      
      setIsSubmitting(true)
      try {
        await onFormSubmit?.(formData)
        setFormData({ name: '', email: '', phone: '' })
        setFormErrors({})
      } catch (error) {
        setFormErrors({ submit: 'Something went wrong. Please try again.' })
      } finally {
        setIsSubmitting(false)
      }
    }

    const handleInputChange = (field: string) => (value: string | number) => {
      setFormData(prev => ({ ...prev, [field]: value as string }))
      if (formErrors[field]) {
        setFormErrors(prev => ({ ...prev, [field]: '' }))
      }
    }

    const backgroundStyle: React.CSSProperties = {
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: backgroundColor ? undefined : '#ffffff',
    }

    return (
      <section
        ref={ref}
        className={`relative overflow-hidden ${backgroundColor} ${sizeClasses[size]} ${className}`}
        style={backgroundStyle}
        role="banner"
        aria-label="Hero section"
        {...props}
      >
        {/* Background Video */}
        {backgroundVideo && (
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              aria-hidden="true"
            >
              <source src={backgroundVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/30" />
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {layout === 'with-image' && imageUrl ? (
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${imagePosition === 'left' ? 'lg:grid-cols-[1fr_1.2fr]' : ''}`}>
              {/* Content */}
              <div className={`${layoutClasses[layout]} ${imagePosition === 'left' ? 'lg:order-2' : 'lg:order-1'}`}>
                {subheadline && (
                  <Text
                    size="lg"
                    weight="medium"
                    color="accent"
                    className="mb-4"
                    data-testid="hero-subheadline"
                  >
                    {subheadline}
                  </Text>
                )}

                {headline && (
                  <Heading
                    level={1}
                    size={headlineSizes[size]}
                    className="mb-6 font-bold leading-tight"
                    data-testid="hero-headline"
                  >
                    {headline}
                  </Heading>
                )}

                {description && (
                  <Text
                    size="lg"
                    color="muted"
                    className="mb-8 max-w-2xl"
                    data-testid="hero-description"
                  >
                    {description}
                  </Text>
                )}

                {/* CTAs */}
                {(primaryCta || secondaryCta) && (
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    {primaryCta && (
                      <Button
                        variant={primaryCta.variant || 'primary'}
                        size="lg"
                        href={primaryCta.href}
                        onClick={primaryCta.onClick}
                        className="min-w-[200px]"
                        data-testid="hero-primary-cta"
                      >
                        {primaryCta.text}
                      </Button>
                    )}
                    
                    {secondaryCta && (
                      <Button
                        variant={secondaryCta.variant || 'outline'}
                        size="lg"
                        href={secondaryCta.href}
                        onClick={secondaryCta.onClick}
                        className="min-w-[200px]"
                        data-testid="hero-secondary-cta"
                      >
                        {secondaryCta.text}
                      </Button>
                    )}
                  </div>
                )}

                {/* Statistics */}
                {statistics && statistics.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8" data-testid="hero-statistics">
                    {statistics.map((stat, index) => (
                      <div key={index} className="text-center">
                        {stat.icon && (
                          <div className="mb-2 flex justify-center">
                            {React.isValidElement(stat.icon) ? stat.icon : <Icon src={stat.icon as any} size="lg" color="accent" />}
                          </div>
                        )}
                        <Text size="2xl" weight="bold" className="block">
                          {stat.value}
                        </Text>
                        <Text size="sm" color="muted">
                          {stat.label}
                        </Text>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Image */}
              <div className={`${imagePosition === 'left' ? 'lg:order-1' : 'lg:order-2'}`}>
                <img
                  src={imageUrl}
                  alt={imageAlt || ''}
                  className="w-full h-auto rounded-lg shadow-lg"
                  data-testid="hero-image"
                />
              </div>
            </div>
          ) : (
            <div className={`${layoutClasses[layout]} max-w-4xl ${layout === 'centered' ? 'mx-auto' : ''}`}>
              {subheadline && (
                <Text
                  size="lg"
                  weight="medium"
                  color="accent"
                  className="mb-4"
                  data-testid="hero-subheadline"
                >
                  {subheadline}
                </Text>
              )}

              {headline && (
                <Heading
                  level={1}
                  size={headlineSizes[size]}
                  className="mb-6 font-bold leading-tight"
                  data-testid="hero-headline"
                >
                  {headline}
                </Heading>
              )}

              {description && (
                <Text
                  size="lg"
                  color="muted"
                  className={`mb-8 ${layout === 'centered' ? 'max-w-3xl mx-auto' : 'max-w-2xl'}`}
                  data-testid="hero-description"
                >
                  {description}
                </Text>
              )}

              {/* CTAs */}
              {(primaryCta || secondaryCta) && (
                <div className={`flex flex-col sm:flex-row gap-4 mb-8 ${layout === 'centered' ? 'justify-center' : ''}`}>
                  {primaryCta && (
                    <Button
                      variant={primaryCta.variant || 'primary'}
                      size="lg"
                      href={primaryCta.href}
                      onClick={primaryCta.onClick}
                      className="min-w-[200px]"
                      data-testid="hero-primary-cta"
                    >
                      {primaryCta.text}
                    </Button>
                  )}
                  
                  {secondaryCta && (
                    <Button
                      variant={secondaryCta.variant || 'outline'}
                      size="lg"
                      href={secondaryCta.href}
                      onClick={secondaryCta.onClick}
                      className="min-w-[200px]"
                      data-testid="hero-secondary-cta"
                    >
                      {secondaryCta.text}
                    </Button>
                  )}
                </div>
              )}

              {/* Statistics */}
              {statistics && statistics.length > 0 && (
                <div className={`grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 ${layout === 'centered' ? 'max-w-2xl mx-auto' : ''}`} data-testid="hero-statistics">
                  {statistics.map((stat, index) => (
                    <div key={index} className="text-center">
                      {stat.icon && (
                        <div className="mb-2 flex justify-center">
                          {React.isValidElement(stat.icon) ? stat.icon : <Icon src={stat.icon as any} size="lg" color="accent" />}
                        </div>
                      )}
                      <Text size="2xl" weight="bold" className="block">
                        {stat.value}
                      </Text>
                      <Text size="sm" color="muted">
                        {stat.label}
                      </Text>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Registration Form */}
          {showQuickForm && (
            <div className="mt-12 max-w-md mx-auto">
              <Card className="p-6">
                <Heading level={3} size="lg" className="mb-4 text-center">
                  {formTitle}
                </Heading>
                
                <form onSubmit={handleFormSubmit} data-testid="hero-quick-form">
                  <div className="space-y-4">
                    <FormGroup
                      label="Full Name"
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      required
                      error={formErrors.name}
                      value={formData.name}
                      onChange={handleInputChange('name')}
                      data-testid="hero-form-name"
                    />
                    
                    <FormGroup
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                      error={formErrors.email}
                      value={formData.email}
                      onChange={handleInputChange('email')}
                      data-testid="hero-form-email"
                    />
                    
                    <FormGroup
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      placeholder="Your phone number"
                      required
                      error={formErrors.phone}
                      value={formData.phone}
                      onChange={handleInputChange('phone')}
                      data-testid="hero-form-phone"
                    />

                    {formErrors.submit && (
                      <Text color="error" size="sm" role="alert">
                        {formErrors.submit}
                      </Text>
                    )}
                    
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full"
                      data-testid="hero-form-submit"
                    >
                      {isSubmitting ? 'Submitting...' : 'Register Now'}
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          )}

          {/* Testimonial */}
          {testimonial && (
            <div className="mt-12 max-w-2xl mx-auto text-center" data-testid="hero-testimonial">
              <Card className="p-6">
                <Text size="lg" className="mb-4 italic">
                  "{testimonial.text}"
                </Text>
                
                <div className="flex items-center justify-center gap-4">
                  {testimonial.image && (
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <Text weight="medium">
                      {testimonial.author}
                    </Text>
                    <Text size="sm" color="muted">
                      {testimonial.role} at {testimonial.company}
                    </Text>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </section>
    )
  }
)

Hero.displayName = 'Hero'

export default Hero