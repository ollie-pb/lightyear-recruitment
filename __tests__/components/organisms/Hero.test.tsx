import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import '@testing-library/jest-dom';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock Next.js Image component for testing
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} data-testid="hero-image" />;
  };
});

// Mock Next.js Link component for testing
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>;
  };
});

// Hero component interface (TDD - defining the expected API)
interface HeroProps {
  // Layout variants
  layout?: 'centered' | 'left-aligned' | 'with-image';
  
  // Content
  headline: string;
  subheadline?: string;
  description?: string;
  
  // CTAs
  primaryCTA?: {
    text: string;
    href?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
  };
  secondaryCTA?: {
    text: string;
    href?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  
  // Visual elements
  backgroundImage?: string;
  backgroundVideo?: string;
  heroImage?: string;
  heroImageAlt?: string;
  
  // Sizes
  size?: 'compact' | 'standard' | 'large';
  
  // Form integration
  showQuickRegistration?: boolean;
  onRegistrationSubmit?: (data: any) => void;
  registrationFields?: Array<{
    name: string;
    type: string;
    placeholder: string;
    required?: boolean;
  }>;
  
  // Social proof
  testimonial?: {
    quote: string;
    author: string;
    role?: string;
    company?: string;
    image?: string;
  };
  statistics?: Array<{
    value: string;
    label: string;
    icon?: string;
  }>;
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
  
  // Additional props
  className?: string;
  id?: string;
  'data-testid'?: string;
}

// Mock Hero component implementation for testing (TDD approach)
const Hero: React.FC<HeroProps> = ({
  layout = 'centered',
  headline,
  subheadline,
  description,
  primaryCTA,
  secondaryCTA,
  backgroundImage,
  backgroundVideo,
  heroImage,
  heroImageAlt,
  size = 'standard',
  showQuickRegistration = false,
  onRegistrationSubmit,
  registrationFields = [
    { name: 'name', type: 'text', placeholder: 'Full Name', required: true },
    { name: 'email', type: 'email', placeholder: 'Email Address', required: true },
    { name: 'phone', type: 'tel', placeholder: 'Phone Number', required: true }
  ],
  testimonial,
  statistics,
  ariaLabel,
  role = 'banner',
  className = '',
  id,
  ...props
}) => {
  const [formData, setFormData] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const sizeClasses = {
    compact: 'py-12 md:py-16',
    standard: 'py-16 md:py-24',
    large: 'py-24 md:py-32'
  };

  const layoutClasses = {
    centered: 'text-center',
    'left-aligned': 'text-left',
    'with-image': 'text-left grid md:grid-cols-2 gap-8 items-center'
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onRegistrationSubmit) return;

    setIsSubmitting(true);
    try {
      await onRegistrationSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section
      id={id}
      role={role}
      aria-label={ariaLabel || `Hero section: ${headline}`}
      className={`hero relative overflow-hidden ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {/* Background Elements */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          aria-hidden="true"
          data-testid="hero-background-image"
        />
      )}
      
      {backgroundVideo && (
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          data-testid="hero-background-video"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}
      
      {/* Main Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`${layoutClasses[layout]} max-w-7xl mx-auto`}>
          {/* Content Section */}
          <div className={`${layout === 'with-image' ? 'space-y-6' : 'space-y-8'} max-w-4xl ${layout === 'centered' ? 'mx-auto' : ''}`}>
            {/* Headlines */}
            <div className="space-y-4">
              {subheadline && (
                <p className="text-orange-600 font-semibold text-lg md:text-xl tracking-wide uppercase">
                  {subheadline}
                </p>
              )}
              
              <h1 className={`font-bold text-gray-900 leading-tight ${
                size === 'compact' ? 'text-3xl md:text-4xl' :
                size === 'large' ? 'text-4xl md:text-6xl lg:text-7xl' :
                'text-3xl md:text-5xl lg:text-6xl'
              }`}>
                {headline}
              </h1>
              
              {description && (
                <p className={`text-gray-600 leading-relaxed ${
                  size === 'compact' ? 'text-lg' : 'text-xl md:text-2xl'
                } max-w-3xl ${layout === 'centered' ? 'mx-auto' : ''}`}>
                  {description}
                </p>
              )}
            </div>

            {/* Statistics */}
            {statistics && statistics.length > 0 && (
              <div className="flex flex-wrap gap-8 justify-center md:justify-start" data-testid="hero-statistics">
                {statistics.map((stat, index) => (
                  <div key={index} className="text-center" data-testid={`hero-stat-${index}`}>
                    {stat.icon && (
                      <div className="text-blue-600 mb-2" data-testid={`hero-stat-icon-${index}`}>
                        <span role="img" aria-hidden="true">{stat.icon}</span>
                      </div>
                    )}
                    <div className="text-2xl md:text-3xl font-bold text-blue-600">{stat.value}</div>
                    <div className="text-gray-600 text-sm md:text-base">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Registration Form */}
            {showQuickRegistration && (
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto md:mx-0" data-testid="hero-quick-registration">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Registration</h3>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {registrationFields.map((field) => (
                    <div key={field.name}>
                      <input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        required={field.required}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                        data-testid={`registration-field-${field.name}`}
                      />
                    </div>
                  ))}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                    data-testid="registration-submit"
                  >
                    {isSubmitting ? 'Registering...' : 'Register Now'}
                  </button>
                </form>
              </div>
            )}

            {/* CTAs */}
            {(primaryCTA || secondaryCTA) && (
              <div className={`flex flex-col sm:flex-row gap-4 ${layout === 'centered' ? 'justify-center' : 'justify-start'}`} data-testid="hero-ctas">
                {primaryCTA && (
                  primaryCTA.href ? (
                    <a
                      href={primaryCTA.href}
                      className={`inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg transition-all min-h-[56px] ${
                        primaryCTA.variant === 'secondary' 
                          ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg transform hover:scale-105'
                      }`}
                      data-testid="hero-primary-cta"
                    >
                      {primaryCTA.text}
                    </a>
                  ) : (
                    <button
                      onClick={primaryCTA.onClick}
                      className={`inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg transition-all min-h-[56px] ${
                        primaryCTA.variant === 'secondary' 
                          ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg transform hover:scale-105'
                      }`}
                      data-testid="hero-primary-cta"
                    >
                      {primaryCTA.text}
                    </button>
                  )
                )}
                
                {secondaryCTA && (
                  secondaryCTA.href ? (
                    <a
                      href={secondaryCTA.href}
                      className={`inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg transition-all min-h-[56px] ${
                        secondaryCTA.variant === 'primary' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                        secondaryCTA.variant === 'secondary' ? 'bg-orange-500 hover:bg-orange-600 text-white' :
                        'border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50'
                      }`}
                      data-testid="hero-secondary-cta"
                    >
                      {secondaryCTA.text}
                    </a>
                  ) : (
                    <button
                      onClick={secondaryCTA.onClick}
                      className={`inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg transition-all min-h-[56px] ${
                        secondaryCTA.variant === 'primary' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                        secondaryCTA.variant === 'secondary' ? 'bg-orange-500 hover:bg-orange-600 text-white' :
                        'border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50'
                      }`}
                      data-testid="hero-secondary-cta"
                    >
                      {secondaryCTA.text}
                    </button>
                  )
                )}
              </div>
            )}

            {/* Testimonial */}
            {testimonial && (
              <div className="bg-gray-50 rounded-lg p-6 max-w-2xl mx-auto md:mx-0" data-testid="hero-testimonial">
                <blockquote className="text-lg italic text-gray-700 mb-4">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  {testimonial.image && (
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full mr-4"
                      data-testid="testimonial-image"
                    />
                  )}
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    {testimonial.role && (
                      <div className="text-gray-600 text-sm">
                        {testimonial.role}
                        {testimonial.company && `, ${testimonial.company}`}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Hero Image Section */}
          {layout === 'with-image' && heroImage && (
            <div className="relative" data-testid="hero-image-container">
              <img
                src={heroImage}
                alt={heroImageAlt || 'Hero image'}
                className="rounded-lg shadow-xl w-full h-auto"
                loading="eager"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

describe('Hero Component', () => {
  // Default props for testing
  const defaultProps: HeroProps = {
    headline: 'Find Your Next Warehouse Job in Berkshire',
    description: 'Connect with top employers and discover exciting opportunities in warehouse, logistics, and distribution.',
    primaryCTA: {
      text: 'Register Now',
      href: 'https://registration.recruso.co.uk/Form/Worker/RdcgtU2Ti03C3gbg7Q6uWoxra98ucBoAnSg21MBO'
    }
  };

  describe('Basic Rendering and Content', () => {
    it('renders hero section with required props', () => {
      render(<Hero {...defaultProps} />);
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByText('Find Your Next Warehouse Job in Berkshire')).toBeInTheDocument();
      expect(screen.getByText('Connect with top employers and discover exciting opportunities in warehouse, logistics, and distribution.')).toBeInTheDocument();
    });

    it('renders with custom aria-label', () => {
      const customLabel = 'Custom hero section for job seekers';
      render(<Hero {...defaultProps} ariaLabel={customLabel} />);
      
      const heroSection = screen.getByRole('banner');
      expect(heroSection).toHaveAttribute('aria-label', customLabel);
    });

    it('renders with custom id and className', () => {
      render(<Hero {...defaultProps} id="custom-hero" className="custom-class" />);
      
      const heroSection = screen.getByRole('banner');
      expect(heroSection).toHaveAttribute('id', 'custom-hero');
      expect(heroSection).toHaveClass('custom-class');
    });

    it('renders subheadline when provided', () => {
      render(<Hero {...defaultProps} subheadline="Leading Recruitment Agency" />);
      
      expect(screen.getByText('Leading Recruitment Agency')).toBeInTheDocument();
      expect(screen.getByText('Leading Recruitment Agency')).toHaveClass('text-orange-600');
    });

    it('uses semantic HTML structure', () => {
      render(<Hero {...defaultProps} />);
      
      const section = screen.getByRole('banner');
      expect(section.tagName).toBe('SECTION');
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Find Your Next Warehouse Job in Berkshire');
    });
  });

  describe('Layout Variants', () => {
    it('renders centered layout by default', () => {
      render(<Hero {...defaultProps} />);
      
      const heroSection = screen.getByRole('banner');
      expect(heroSection.querySelector('.text-center')).toBeInTheDocument();
    });

    it('renders left-aligned layout', () => {
      render(<Hero {...defaultProps} layout="left-aligned" />);
      
      const heroSection = screen.getByRole('banner');
      expect(heroSection.querySelector('.text-left')).toBeInTheDocument();
      expect(heroSection.querySelector('.text-center')).not.toBeInTheDocument();
    });

    it('renders with-image layout with grid structure', () => {
      render(
        <Hero 
          {...defaultProps} 
          layout="with-image" 
          heroImage="/hero-image.jpg" 
          heroImageAlt="Warehouse workers" 
        />
      );
      
      const heroSection = screen.getByRole('banner');
      expect(heroSection.querySelector('.grid')).toBeInTheDocument();
      expect(heroSection.querySelector('.md\\:grid-cols-2')).toBeInTheDocument();
      
      // Check that hero image is rendered
      expect(screen.getByTestId('hero-image-container')).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'Warehouse workers' })).toBeInTheDocument();
    });

    it('renders hero image with proper attributes', () => {
      render(
        <Hero 
          {...defaultProps} 
          layout="with-image" 
          heroImage="/warehouse.jpg" 
          heroImageAlt="Modern warehouse facility" 
        />
      );
      
      const image = screen.getByRole('img', { name: 'Modern warehouse facility' });
      expect(image).toHaveAttribute('src', '/warehouse.jpg');
      expect(image).toHaveAttribute('loading', 'eager');
      expect(image).toHaveClass('rounded-lg', 'shadow-xl');
    });
  });

  describe('Size Variations', () => {
    it('renders compact size with appropriate spacing', () => {
      render(<Hero {...defaultProps} size="compact" />);
      
      const heroSection = screen.getByRole('banner');
      expect(heroSection).toHaveClass('py-12', 'md:py-16');
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('text-3xl', 'md:text-4xl');
    });

    it('renders standard size by default', () => {
      render(<Hero {...defaultProps} />);
      
      const heroSection = screen.getByRole('banner');
      expect(heroSection).toHaveClass('py-16', 'md:py-24');
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('text-3xl', 'md:text-5xl', 'lg:text-6xl');
    });

    it('renders large size with maximum spacing and typography', () => {
      render(<Hero {...defaultProps} size="large" />);
      
      const heroSection = screen.getByRole('banner');
      expect(heroSection).toHaveClass('py-24', 'md:py-32');
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('text-4xl', 'md:text-6xl', 'lg:text-7xl');
    });
  });

  describe('Call-to-Action Buttons', () => {
    it('renders primary CTA as link when href is provided', () => {
      render(<Hero {...defaultProps} />);
      
      const primaryCTA = screen.getByTestId('hero-primary-cta');
      expect(primaryCTA.tagName).toBe('A');
      expect(primaryCTA).toHaveAttribute('href', 'https://registration.recruso.co.uk/Form/Worker/RdcgtU2Ti03C3gbg7Q6uWoxra98ucBoAnSg21MBO');
      expect(primaryCTA).toHaveTextContent('Register Now');
      expect(primaryCTA).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white');
    });

    it('renders primary CTA as button when onClick is provided', () => {
      const handleClick = jest.fn();
      const props = {
        ...defaultProps,
        primaryCTA: {
          text: 'Get Started',
          onClick: handleClick
        }
      };
      
      render(<Hero {...props} />);
      
      const primaryCTA = screen.getByTestId('hero-primary-cta');
      expect(primaryCTA.tagName).toBe('BUTTON');
      expect(primaryCTA).toHaveTextContent('Get Started');
    });

    it('handles primary CTA click events', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      const props = {
        ...defaultProps,
        primaryCTA: {
          text: 'Click Me',
          onClick: handleClick
        }
      };
      
      render(<Hero {...props} />);
      
      const primaryCTA = screen.getByTestId('hero-primary-cta');
      await user.click(primaryCTA);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders secondary CTA with different styling', () => {
      const props = {
        ...defaultProps,
        secondaryCTA: {
          text: 'Learn More',
          href: '/about',
          variant: 'outline' as const
        }
      };
      
      render(<Hero {...props} />);
      
      const secondaryCTA = screen.getByTestId('hero-secondary-cta');
      expect(secondaryCTA).toHaveTextContent('Learn More');
      expect(secondaryCTA).toHaveClass('border-2', 'border-gray-300', 'text-gray-700');
    });

    it('renders both primary and secondary CTAs', () => {
      const props = {
        ...defaultProps,
        secondaryCTA: {
          text: 'Contact Us',
          href: '/contact'
        }
      };
      
      render(<Hero {...props} />);
      
      expect(screen.getByTestId('hero-primary-cta')).toBeInTheDocument();
      expect(screen.getByTestId('hero-secondary-cta')).toBeInTheDocument();
      expect(screen.getByTestId('hero-ctas')).toBeInTheDocument();
    });

    it('renders secondary CTA with different variants', () => {
      const { rerender } = render(
        <Hero 
          {...defaultProps}
          secondaryCTA={{
            text: 'Secondary',
            href: '/test',
            variant: 'secondary'
          }}
        />
      );
      
      let secondaryCTA = screen.getByTestId('hero-secondary-cta');
      expect(secondaryCTA).toHaveClass('bg-orange-500', 'hover:bg-orange-600', 'text-white');
      
      rerender(
        <Hero 
          {...defaultProps}
          secondaryCTA={{
            text: 'Primary',
            href: '/test',
            variant: 'primary'
          }}
        />
      );
      
      secondaryCTA = screen.getByTestId('hero-secondary-cta');
      expect(secondaryCTA).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white');
    });

    it('ensures CTAs meet minimum touch target requirements', () => {
      const props = {
        ...defaultProps,
        secondaryCTA: {
          text: 'Learn More',
          href: '/about'
        }
      };
      
      render(<Hero {...props} />);
      
      const primaryCTA = screen.getByTestId('hero-primary-cta');
      const secondaryCTA = screen.getByTestId('hero-secondary-cta');
      
      expect(primaryCTA).toHaveClass('min-h-[56px]');
      expect(secondaryCTA).toHaveClass('min-h-[56px]');
    });
  });

  describe('Background Elements', () => {
    it('renders background image when provided', () => {
      render(
        <Hero 
          {...defaultProps} 
          backgroundImage="/warehouse-bg.jpg" 
        />
      );
      
      const backgroundImage = screen.getByTestId('hero-background-image');
      expect(backgroundImage).toBeInTheDocument();
      expect(backgroundImage).toHaveStyle('background-image: url(/warehouse-bg.jpg)');
      expect(backgroundImage).toHaveAttribute('aria-hidden', 'true');
      expect(backgroundImage).toHaveClass('opacity-20');
    });

    it('renders background video when provided', () => {
      render(
        <Hero 
          {...defaultProps} 
          backgroundVideo="/warehouse-video.mp4" 
        />
      );
      
      const backgroundVideo = screen.getByTestId('hero-background-video');
      expect(backgroundVideo).toBeInTheDocument();
      expect(backgroundVideo).toHaveAttribute('aria-hidden', 'true');
      expect(backgroundVideo).toHaveAttribute('autoplay');
      expect(backgroundVideo).toHaveAttribute('loop');
      expect(backgroundVideo).toHaveAttribute('muted');
      expect(backgroundVideo).toHaveAttribute('playsinline');
      expect(backgroundVideo).toHaveClass('opacity-20');
      
      const source = backgroundVideo.querySelector('source');
      expect(source).toHaveAttribute('src', '/warehouse-video.mp4');
      expect(source).toHaveAttribute('type', 'video/mp4');
    });

    it('can render both background image and video', () => {
      render(
        <Hero 
          {...defaultProps} 
          backgroundImage="/warehouse-bg.jpg"
          backgroundVideo="/warehouse-video.mp4"
        />
      );
      
      expect(screen.getByTestId('hero-background-image')).toBeInTheDocument();
      expect(screen.getByTestId('hero-background-video')).toBeInTheDocument();
    });
  });

  describe('Quick Registration Form', () => {
    it('renders registration form when showQuickRegistration is true', () => {
      render(<Hero {...defaultProps} showQuickRegistration />);
      
      expect(screen.getByTestId('hero-quick-registration')).toBeInTheDocument();
      expect(screen.getByText('Quick Registration')).toBeInTheDocument();
      expect(screen.getByTestId('registration-submit')).toBeInTheDocument();
    });

    it('renders default registration fields', () => {
      render(<Hero {...defaultProps} showQuickRegistration />);
      
      expect(screen.getByTestId('registration-field-name')).toBeInTheDocument();
      expect(screen.getByTestId('registration-field-email')).toBeInTheDocument();
      expect(screen.getByTestId('registration-field-phone')).toBeInTheDocument();
      
      expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument();
    });

    it('renders custom registration fields when provided', () => {
      const customFields = [
        { name: 'firstName', type: 'text', placeholder: 'First Name', required: true },
        { name: 'lastName', type: 'text', placeholder: 'Last Name', required: true },
        { name: 'experience', type: 'select', placeholder: 'Experience Level', required: false }
      ];
      
      render(
        <Hero 
          {...defaultProps} 
          showQuickRegistration 
          registrationFields={customFields}
        />
      );
      
      expect(screen.getByTestId('registration-field-firstName')).toBeInTheDocument();
      expect(screen.getByTestId('registration-field-lastName')).toBeInTheDocument();
      expect(screen.getByTestId('registration-field-experience')).toBeInTheDocument();
    });

    it('handles form input changes', async () => {
      const user = userEvent.setup();
      render(<Hero {...defaultProps} showQuickRegistration />);
      
      const nameInput = screen.getByTestId('registration-field-name');
      await user.type(nameInput, 'John Smith');
      
      expect(nameInput).toHaveValue('John Smith');
    });

    it('handles form submission', async () => {
      const handleSubmit = jest.fn();
      const user = userEvent.setup();
      
      render(
        <Hero 
          {...defaultProps} 
          showQuickRegistration 
          onRegistrationSubmit={handleSubmit}
        />
      );
      
      // Fill out form
      await user.type(screen.getByTestId('registration-field-name'), 'John Smith');
      await user.type(screen.getByTestId('registration-field-email'), 'john@example.com');
      await user.type(screen.getByTestId('registration-field-phone'), '01234567890');
      
      // Submit form
      const submitButton = screen.getByTestId('registration-submit');
      await user.click(submitButton);
      
      expect(handleSubmit).toHaveBeenCalledWith({
        name: 'John Smith',
        email: 'john@example.com',
        phone: '01234567890'
      });
    });

    it('shows loading state during form submission', async () => {
      const slowSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
      const user = userEvent.setup();
      
      render(
        <Hero 
          {...defaultProps} 
          showQuickRegistration 
          onRegistrationSubmit={slowSubmit}
        />
      );
      
      const submitButton = screen.getByTestId('registration-submit');
      await user.click(submitButton);
      
      expect(submitButton).toHaveTextContent('Registering...');
      expect(submitButton).toBeDisabled();
      
      // Wait for submission to complete
      await waitFor(() => {
        expect(submitButton).toHaveTextContent('Register Now');
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('maintains form data after submission error', async () => {
      const errorSubmit = jest.fn(() => Promise.reject(new Error('Submission failed')));
      const user = userEvent.setup();
      
      render(
        <Hero 
          {...defaultProps} 
          showQuickRegistration 
          onRegistrationSubmit={errorSubmit}
        />
      );
      
      const nameInput = screen.getByTestId('registration-field-name');
      await user.type(nameInput, 'John Smith');
      
      const submitButton = screen.getByTestId('registration-submit');
      await user.click(submitButton);
      
      // Form data should persist after error
      await waitFor(() => {
        expect(nameInput).toHaveValue('John Smith');
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('Social Proof Elements', () => {
    it('renders testimonial when provided', () => {
      const testimonial = {
        quote: 'Lightyear helped me find my dream job in just 2 weeks!',
        author: 'Sarah Johnson',
        role: 'Warehouse Supervisor',
        company: 'ABC Logistics'
      };
      
      render(<Hero {...defaultProps} testimonial={testimonial} />);
      
      const testimonialSection = screen.getByTestId('hero-testimonial');
      expect(testimonialSection).toBeInTheDocument();
      
      expect(screen.getByText('"Lightyear helped me find my dream job in just 2 weeks!"')).toBeInTheDocument();
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('Warehouse Supervisor, ABC Logistics')).toBeInTheDocument();
    });

    it('renders testimonial with image', () => {
      const testimonial = {
        quote: 'Great service and support!',
        author: 'Mark Wilson',
        image: '/testimonial-mark.jpg'
      };
      
      render(<Hero {...defaultProps} testimonial={testimonial} />);
      
      const testimonialImage = screen.getByTestId('testimonial-image');
      expect(testimonialImage).toHaveAttribute('src', '/testimonial-mark.jpg');
      expect(testimonialImage).toHaveAttribute('alt', 'Mark Wilson');
      expect(testimonialImage).toHaveClass('w-12', 'h-12', 'rounded-full');
    });

    it('renders statistics when provided', () => {
      const statistics = [
        { value: '1000+', label: 'Jobs Placed', icon: '💼' },
        { value: '95%', label: 'Success Rate', icon: '⭐' },
        { value: '50+', label: 'Partner Companies', icon: '🏢' }
      ];
      
      render(<Hero {...defaultProps} statistics={statistics} />);
      
      const statisticsSection = screen.getByTestId('hero-statistics');
      expect(statisticsSection).toBeInTheDocument();
      
      statistics.forEach((stat, index) => {
        expect(screen.getByTestId(`hero-stat-${index}`)).toBeInTheDocument();
        expect(screen.getByText(stat.value)).toBeInTheDocument();
        expect(screen.getByText(stat.label)).toBeInTheDocument();
        
        if (stat.icon) {
          expect(screen.getByTestId(`hero-stat-icon-${index}`)).toBeInTheDocument();
        }
      });
    });

    it('renders multiple statistics with proper styling', () => {
      const statistics = [
        { value: '2000+', label: 'Active Jobs' },
        { value: '98%', label: 'Client Satisfaction' }
      ];
      
      render(<Hero {...defaultProps} statistics={statistics} />);
      
      const stat0 = screen.getByTestId('hero-stat-0');
      const stat1 = screen.getByTestId('hero-stat-1');
      
      expect(stat0.querySelector('.text-2xl')).toHaveTextContent('2000+');
      expect(stat0.querySelector('.text-gray-600')).toHaveTextContent('Active Jobs');
      
      expect(stat1.querySelector('.text-2xl')).toHaveTextContent('98%');
      expect(stat1.querySelector('.text-gray-600')).toHaveTextContent('Client Satisfaction');
    });
  });

  describe('Accessibility Features', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Hero {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('uses proper semantic HTML structure', () => {
      render(<Hero {...defaultProps} />);
      
      const section = screen.getByRole('banner');
      expect(section.tagName).toBe('SECTION');
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('provides proper ARIA labels for decorative elements', () => {
      render(
        <Hero 
          {...defaultProps} 
          backgroundImage="/bg.jpg"
          backgroundVideo="/bg.mp4"
        />
      );
      
      const backgroundImage = screen.getByTestId('hero-background-image');
      const backgroundVideo = screen.getByTestId('hero-background-video');
      
      expect(backgroundImage).toHaveAttribute('aria-hidden', 'true');
      expect(backgroundVideo).toHaveAttribute('aria-hidden', 'true');
    });

    it('supports keyboard navigation for interactive elements', async () => {
      const handlePrimaryClick = jest.fn();
      const handleSecondaryClick = jest.fn();
      const user = userEvent.setup();
      
      const props = {
        ...defaultProps,
        primaryCTA: {
          text: 'Primary',
          onClick: handlePrimaryClick
        },
        secondaryCTA: {
          text: 'Secondary',
          onClick: handleSecondaryClick
        }
      };
      
      render(<Hero {...props} />);
      
      const primaryCTA = screen.getByTestId('hero-primary-cta');
      const secondaryCTA = screen.getByTestId('hero-secondary-cta');
      
      // Tab navigation
      await user.tab();
      expect(primaryCTA).toHaveFocus();
      
      await user.tab();
      expect(secondaryCTA).toHaveFocus();
      
      // Keyboard activation
      await user.keyboard('{Enter}');
      expect(handleSecondaryClick).toHaveBeenCalled();
    });

    it('provides proper focus management for form elements', async () => {
      const user = userEvent.setup();
      render(<Hero {...defaultProps} showQuickRegistration />);
      
      const nameInput = screen.getByTestId('registration-field-name');
      const emailInput = screen.getByTestId('registration-field-email');
      const submitButton = screen.getByTestId('registration-submit');
      
      // Tab through form elements
      await user.tab(); // First CTA
      await user.tab(); // Name input
      expect(nameInput).toHaveFocus();
      
      await user.tab(); // Email input
      expect(emailInput).toHaveFocus();
      
      await user.tab(); // Phone input
      await user.tab(); // Submit button
      expect(submitButton).toHaveFocus();
    });

    it('maintains proper heading hierarchy', () => {
      render(
        <Hero 
          {...defaultProps} 
          showQuickRegistration
          testimonial={{
            quote: 'Great service',
            author: 'John Doe'
          }}
        />
      );
      
      // Main heading should be h1
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent('Find Your Next Warehouse Job in Berkshire');
      
      // Registration form heading should be h3
      const formHeading = screen.getByRole('heading', { level: 3 });
      expect(formHeading).toHaveTextContent('Quick Registration');
    });
  });

  describe('Mobile Responsiveness', () => {
    it('applies mobile-first responsive classes', () => {
      render(<Hero {...defaultProps} />);
      
      const heroSection = screen.getByRole('banner');
      expect(heroSection).toHaveClass('py-16', 'md:py-24'); // Responsive padding
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('text-3xl', 'md:text-5xl', 'lg:text-6xl'); // Responsive typography
    });

    it('ensures proper spacing for mobile layout', () => {
      render(
        <Hero 
          {...defaultProps} 
          layout="with-image"
          heroImage="/hero.jpg"
          showQuickRegistration
        />
      );
      
      // Container should have proper responsive padding
      const container = screen.getByRole('banner').querySelector('.container');
      expect(container).toHaveClass('px-4', 'sm:px-6', 'lg:px-8');
      
      // Grid layout should stack on mobile
      const gridContainer = screen.getByRole('banner').querySelector('.md\\:grid-cols-2');
      expect(gridContainer).toBeInTheDocument();
    });

    it('maintains proper touch targets on mobile', () => {
      render(
        <Hero 
          {...defaultProps}
          secondaryCTA={{
            text: 'Learn More',
            href: '/about'
          }}
        />
      );
      
      const primaryCTA = screen.getByTestId('hero-primary-cta');
      const secondaryCTA = screen.getByTestId('hero-secondary-cta');
      
      // Touch targets should be at least 44px (using min-h-[56px] for larger target)
      expect(primaryCTA).toHaveClass('min-h-[56px]');
      expect(secondaryCTA).toHaveClass('min-h-[56px]');
    });

    it('handles responsive CTA layout', () => {
      render(
        <Hero 
          {...defaultProps}
          secondaryCTA={{
            text: 'Contact',
            href: '/contact'
          }}
        />
      );
      
      const ctaContainer = screen.getByTestId('hero-ctas');
      expect(ctaContainer).toHaveClass('flex', 'flex-col', 'sm:flex-row', 'gap-4');
    });
  });

  describe('Brand Colors and Conversion Optimization', () => {
    it('uses correct brand colors for primary elements', () => {
      render(<Hero {...defaultProps} subheadline="Leading Agency" />);
      
      const subheadline = screen.getByText('Leading Agency');
      expect(subheadline).toHaveClass('text-orange-600'); // Brand secondary color
      
      const primaryCTA = screen.getByTestId('hero-primary-cta');
      expect(primaryCTA).toHaveClass('bg-blue-600', 'hover:bg-blue-700'); // Brand primary color
    });

    it('uses brand colors in statistics', () => {
      const statistics = [
        { value: '100+', label: 'Success Stories' }
      ];
      
      render(<Hero {...defaultProps} statistics={statistics} />);
      
      const statValue = screen.getByText('100+');
      expect(statValue).toHaveClass('text-blue-600'); // Brand primary color
    });

    it('applies conversion-optimized styling to CTAs', () => {
      render(<Hero {...defaultProps} />);
      
      const primaryCTA = screen.getByTestId('hero-primary-cta');
      expect(primaryCTA).toHaveClass(
        'bg-blue-600',
        'hover:bg-blue-700',
        'hover:shadow-lg',
        'transform',
        'hover:scale-105'
      );
    });

    it('positions elements for maximum conversion impact', () => {
      render(
        <Hero 
          {...defaultProps}
          showQuickRegistration
          statistics={[{ value: '95%', label: 'Success Rate' }]}
        />
      );
      
      // Statistics should be prominently displayed
      const statistics = screen.getByTestId('hero-statistics');
      expect(statistics).toBeInTheDocument();
      
      // Registration form should be visually distinct
      const registrationForm = screen.getByTestId('hero-quick-registration');
      expect(registrationForm).toHaveClass('bg-white', 'rounded-lg', 'shadow-lg');
      
      // Primary CTA should be prominent
      const primaryCTA = screen.getByTestId('hero-primary-cta');
      expect(primaryCTA).toHaveClass('text-lg', 'font-semibold');
    });
  });

  describe('Recruitment-Specific Features', () => {
    it('supports external registration URL for Recruso platform', () => {
      render(<Hero {...defaultProps} />);
      
      const primaryCTA = screen.getByTestId('hero-primary-cta');
      expect(primaryCTA).toHaveAttribute('href', 'https://registration.recruso.co.uk/Form/Worker/RdcgtU2Ti03C3gbg7Q6uWoxra98ucBoAnSg21MBO');
    });

    it('renders job seeker focused content effectively', () => {
      const jobSeekerProps = {
        headline: 'Your Next Warehouse Career Starts Here',
        subheadline: 'Berkshire\'s Leading Job Agency',
        description: 'Connect with top employers in warehouse, logistics, and distribution. Register today and get matched with your perfect job.',
        primaryCTA: {
          text: 'Find Jobs Now',
          href: 'https://registration.recruso.co.uk/Form/Worker/RdcgtU2Ti03C3gbg7Q6uWoxra98ucBoAnSg21MBO'
        },
        secondaryCTA: {
          text: 'Browse Jobs',
          href: '/jobs',
          variant: 'outline' as const
        },
        statistics: [
          { value: '500+', label: 'Active Jobs', icon: '💼' },
          { value: '95%', label: 'Placement Rate', icon: '⭐' }
        ]
      };
      
      render(<Hero {...jobSeekerProps} />);
      
      expect(screen.getByText('Your Next Warehouse Career Starts Here')).toBeInTheDocument();
      expect(screen.getByText('Berkshire\'s Leading Job Agency')).toBeInTheDocument();
      expect(screen.getByText('Find Jobs Now')).toBeInTheDocument();
      expect(screen.getByText('Browse Jobs')).toBeInTheDocument();
      expect(screen.getByText('500+')).toBeInTheDocument();
      expect(screen.getByText('Placement Rate')).toBeInTheDocument();
    });

    it('supports employer-focused hero content', () => {
      const employerProps = {
        headline: 'Find Qualified Warehouse Staff',
        subheadline: 'Employer Services',
        description: 'Access our pool of pre-screened warehouse professionals. Quick placements, competitive rates.',
        primaryCTA: {
          text: 'Post a Job',
          href: '/employers/post-job'
        },
        secondaryCTA: {
          text: 'Contact Us',
          href: '/contact',
          variant: 'outline' as const
        }
      };
      
      render(<Hero {...employerProps} />);
      
      expect(screen.getByText('Find Qualified Warehouse Staff')).toBeInTheDocument();
      expect(screen.getByText('Employer Services')).toBeInTheDocument();
      expect(screen.getByText('Post a Job')).toBeInTheDocument();
    });

    it('handles quick registration with recruitment-specific fields', () => {
      const recruitmentFields = [
        { name: 'fullName', type: 'text', placeholder: 'Full Name', required: true },
        { name: 'email', type: 'email', placeholder: 'Email Address', required: true },
        { name: 'phone', type: 'tel', placeholder: 'Mobile Number', required: true },
        { name: 'postcode', type: 'text', placeholder: 'Postcode', required: true }
      ];
      
      render(
        <Hero 
          {...defaultProps}
          showQuickRegistration
          registrationFields={recruitmentFields}
        />
      );
      
      expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Mobile Number')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Postcode')).toBeInTheDocument();
    });
  });

  describe('Performance and Edge Cases', () => {
    it('handles missing optional props gracefully', () => {
      const minimalProps = {
        headline: 'Minimal Hero'
      };
      
      render(<Hero {...minimalProps} />);
      
      expect(screen.getByText('Minimal Hero')).toBeInTheDocument();
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('handles empty arrays for statistics', () => {
      render(<Hero {...defaultProps} statistics={[]} />);
      
      expect(screen.queryByTestId('hero-statistics')).not.toBeInTheDocument();
    });

    it('handles long content gracefully', () => {
      const longContentProps = {
        headline: 'This is a very long headline that should wrap properly on mobile devices and maintain readability across all screen sizes',
        subheadline: 'This is also a very long subheadline with lots of descriptive text',
        description: 'This is an extremely long description that contains a lot of information about the recruitment services and should wrap properly across multiple lines while maintaining good readability and spacing throughout the entire hero section.',
        primaryCTA: {
          text: 'Register with Very Long Text',
          href: '/register'
        }
      };
      
      render(<Hero {...longContentProps} />);
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveClass('leading-tight');
      expect(screen.getByTestId('hero-primary-cta')).toBeInTheDocument();
    });

    it('does not re-render unnecessarily with same props', () => {
      const { rerender } = render(<Hero {...defaultProps} />);
      const initialHeading = screen.getByRole('heading', { level: 1 });
      
      // Re-render with same props
      rerender(<Hero {...defaultProps} />);
      const afterRerender = screen.getByRole('heading', { level: 1 });
      
      expect(afterRerender.textContent).toBe(initialHeading.textContent);
    });

    it('handles form submission errors gracefully', async () => {
      const failingSubmit = jest.fn().mockRejectedValue(new Error('Network error'));
      const user = userEvent.setup();
      
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = jest.fn();
      
      render(
        <Hero 
          {...defaultProps} 
          showQuickRegistration 
          onRegistrationSubmit={failingSubmit}
        />
      );
      
      const submitButton = screen.getByTestId('registration-submit');
      await user.click(submitButton);
      
      // Should return to normal state after error
      await waitFor(() => {
        expect(submitButton).toHaveTextContent('Register Now');
        expect(submitButton).not.toBeDisabled();
      });
      
      // Restore console.error
      console.error = originalError;
    });

    it('maintains proper z-index layering', () => {
      render(
        <Hero 
          {...defaultProps}
          backgroundImage="/bg.jpg"
          backgroundVideo="/video.mp4"
        />
      );
      
      const backgroundImage = screen.getByTestId('hero-background-image');
      const backgroundVideo = screen.getByTestId('hero-background-video');
      const contentContainer = screen.getByRole('banner').querySelector('.relative.z-10');
      
      expect(backgroundImage).toHaveClass('absolute', 'inset-0');
      expect(backgroundVideo).toHaveClass('absolute', 'inset-0');
      expect(contentContainer).toHaveClass('relative', 'z-10');
    });
  });

  describe('Layout Combinations and Complex Scenarios', () => {
    it('handles all features together without conflicts', () => {
      const complexProps: HeroProps = {
        layout: 'with-image',
        size: 'large',
        headline: 'Complete Hero Test',
        subheadline: 'All Features Enabled',
        description: 'Testing all hero features simultaneously',
        primaryCTA: {
          text: 'Primary Action',
          href: '/primary'
        },
        secondaryCTA: {
          text: 'Secondary Action',
          href: '/secondary',
          variant: 'outline'
        },
        backgroundImage: '/bg.jpg',
        heroImage: '/hero.jpg',
        heroImageAlt: 'Hero image',
        showQuickRegistration: true,
        testimonial: {
          quote: 'Amazing service',
          author: 'Test User',
          role: 'Manager'
        },
        statistics: [
          { value: '100%', label: 'Success' }
        ],
        ariaLabel: 'Complete hero section'
      };
      
      render(<Hero {...complexProps} />);
      
      // Verify all elements are present
      expect(screen.getByRole('banner')).toHaveAttribute('aria-label', 'Complete hero section');
      expect(screen.getByText('Complete Hero Test')).toBeInTheDocument();
      expect(screen.getByText('All Features Enabled')).toBeInTheDocument();
      expect(screen.getByTestId('hero-primary-cta')).toBeInTheDocument();
      expect(screen.getByTestId('hero-secondary-cta')).toBeInTheDocument();
      expect(screen.getByTestId('hero-background-image')).toBeInTheDocument();
      expect(screen.getByTestId('hero-image-container')).toBeInTheDocument();
      expect(screen.getByTestId('hero-quick-registration')).toBeInTheDocument();
      expect(screen.getByTestId('hero-testimonial')).toBeInTheDocument();
      expect(screen.getByTestId('hero-statistics')).toBeInTheDocument();
    });

    it('maintains proper responsive behavior with all features', () => {
      const responsiveProps: HeroProps = {
        layout: 'with-image',
        size: 'standard',
        headline: 'Responsive Test',
        heroImage: '/hero.jpg',
        showQuickRegistration: true,
        primaryCTA: {
          text: 'Action',
          href: '/action'
        }
      };
      
      render(<Hero {...responsiveProps} />);
      
      const heroSection = screen.getByRole('banner');
      const ctaContainer = screen.getByTestId('hero-ctas');
      const formContainer = screen.getByTestId('hero-quick-registration');
      
      // Check responsive grid layout
      expect(heroSection.querySelector('.md\\:grid-cols-2')).toBeInTheDocument();
      
      // Check responsive CTA layout
      expect(ctaContainer).toHaveClass('flex-col', 'sm:flex-row');
      
      // Form should have proper mobile styling
      expect(formContainer).toHaveClass('max-w-md', 'mx-auto', 'md:mx-0');
    });
  });
});