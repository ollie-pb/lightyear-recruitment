import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// TypeScript interface for Card component following atomic design principles
interface CardProps {
  // Content structure
  children?: React.ReactNode;
  
  // Header props
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode | string;
  
  // Footer props
  actions?: React.ReactNode;
  
  // Visual variants for different use cases
  variant?: 'default' | 'highlighted' | 'featured' | 'job-listing';
  
  // Size variations
  size?: 'sm' | 'base' | 'lg';
  
  // Interactive behavior
  onClick?: () => void;
  href?: string;
  clickableArea?: 'card' | 'none'; // whether whole card is clickable
  
  // Visual states
  hover?: boolean;
  focus?: boolean;
  
  // Layout and styling
  className?: string;
  padding?: 'none' | 'sm' | 'base' | 'lg';
  
  // Accessibility
  'aria-label'?: string;
  'aria-describedby'?: string;
  'data-testid'?: string;
  role?: string;
  
  // Recruitment-specific props
  location?: string;
  salary?: string;
  company?: string;
  jobType?: string;
  featured?: boolean;
  urgent?: boolean;
}

// Mock Card component implementation for TDD
const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  icon,
  actions,
  variant = 'default',
  size = 'base',
  onClick,
  href,
  clickableArea = 'none',
  className = '',
  padding = 'base',
  location,
  salary,
  company,
  jobType,
  featured = false,
  urgent = false,
  ...props
}) => {
  // Base styling following recruitment site design system
  const baseClasses = 'bg-white border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2';
  
  // Variant-specific styling
  const variantClasses = {
    default: 'hover:border-gray-300',
    highlighted: 'border-blue-200 bg-blue-50 hover:border-blue-300',
    featured: 'border-orange-200 bg-orange-50 hover:border-orange-300 ring-1 ring-orange-100',
    'job-listing': 'hover:border-blue-300 hover:bg-blue-50'
  };
  
  // Size-specific styling with proper touch targets
  const sizeClasses = {
    sm: 'rounded-lg p-3 min-h-[120px]',
    base: 'rounded-lg p-4 min-h-[140px]',
    lg: 'rounded-lg p-6 min-h-[160px]'
  };
  
  // Padding variations
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    base: 'p-4',
    lg: 'p-6'
  };
  
  // Combine all classes
  const cardClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${featured ? 'ring-2 ring-orange-400' : ''} ${urgent ? 'border-red-300 bg-red-50' : ''} ${className}`;
  
  // Handle click interactions
  const handleClick = () => {
    if (onClick && clickableArea === 'card') {
      onClick();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick && clickableArea === 'card') {
      e.preventDefault();
      onClick();
    }
  };
  
  // Render as link if href provided
  if (href && clickableArea === 'card') {
    return (
      <a
        href={href}
        className={cardClasses}
        {...props}
      >
        <CardContent
          title={title}
          subtitle={subtitle}
          icon={icon}
          actions={actions}
          location={location}
          salary={salary}
          company={company}
          jobType={jobType}
          featured={featured}
          urgent={urgent}
          size={size}
        >
          {children}
        </CardContent>
      </a>
    );
  }
  
  // Render as interactive div if clickable
  if (onClick && clickableArea === 'card') {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`${cardClasses} cursor-pointer`}
        {...props}
      >
        <CardContent
          title={title}
          subtitle={subtitle}
          icon={icon}
          actions={actions}
          location={location}
          salary={salary}
          company={company}
          jobType={jobType}
          featured={featured}
          urgent={urgent}
          size={size}
        >
          {children}
        </CardContent>
      </div>
    );
  }
  
  // Render as static card
  return (
    <div
      className={cardClasses}
      {...props}
    >
      <CardContent
        title={title}
        subtitle={subtitle}
        icon={icon}
        actions={actions}
        location={location}
        salary={salary}
        company={company}
        jobType={jobType}
        featured={featured}
        urgent={urgent}
        size={size}
      >
        {children}
      </CardContent>
    </div>
  );
};

// Helper component for card content structure
const CardContent: React.FC<{
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode | string;
  actions?: React.ReactNode;
  location?: string;
  salary?: string;
  company?: string;
  jobType?: string;
  featured?: boolean;
  urgent?: boolean;
  size: 'sm' | 'base' | 'lg';
  children?: React.ReactNode;
}> = ({ title, subtitle, icon, actions, location, salary, company, jobType, featured, urgent, size, children }) => {
  const hasHeader = title || subtitle || icon;
  const hasFooter = actions;
  const hasJobDetails = location || salary || company || jobType;
  
  return (
    <>
      {/* Special indicators */}
      {(featured || urgent) && (
        <div className="flex gap-2 mb-2">
          {featured && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800" data-testid="featured-badge">
              Featured
            </span>
          )}
          {urgent && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800" data-testid="urgent-badge">
              Urgent
            </span>
          )}
        </div>
      )}
      
      {/* Header section */}
      {hasHeader && (
        <div className="flex items-start gap-3 mb-3" data-testid="card-header">
          {icon && (
            <div className="flex-shrink-0" data-testid="card-icon">
              {typeof icon === 'string' ? (
                <span className="text-xl">{icon}</span>
              ) : (
                icon
              )}
            </div>
          )}
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className={`font-semibold text-gray-900 line-clamp-2 ${size === 'sm' ? 'text-base' : size === 'lg' ? 'text-xl' : 'text-lg'}`} data-testid="card-title">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className={`text-gray-600 mt-1 line-clamp-1 ${size === 'sm' ? 'text-sm' : 'text-base'}`} data-testid="card-subtitle">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Job-specific details */}
      {hasJobDetails && (
        <div className="grid grid-cols-1 gap-2 mb-3 text-sm text-gray-600" data-testid="job-details">
          {company && (
            <div className="flex items-center gap-1" data-testid="job-company">
              <span className="font-medium">{company}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-1" data-testid="job-location">
              <span>📍</span>
              <span>{location}</span>
            </div>
          )}
          {salary && (
            <div className="flex items-center gap-1" data-testid="job-salary">
              <span>💷</span>
              <span>{salary}</span>
            </div>
          )}
          {jobType && (
            <div className="flex items-center gap-1" data-testid="job-type">
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                {jobType}
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* Content area */}
      {children && (
        <div className="flex-1" data-testid="card-content">
          {children}
        </div>
      )}
      
      {/* Footer section */}
      {hasFooter && (
        <div className="mt-4 pt-3 border-t border-gray-100" data-testid="card-footer">
          {actions}
        </div>
      )}
    </>
  );
};

describe('Card Component', () => {
  // Test basic rendering and content display
  describe('Basic Rendering', () => {
    it('renders with minimal props', () => {
      render(<Card data-testid="basic-card">Basic content</Card>);
      
      expect(screen.getByTestId('basic-card')).toBeInTheDocument();
      expect(screen.getByTestId('card-content')).toHaveTextContent('Basic content');
    });
    
    it('renders with title only', () => {
      render(<Card title="Card Title" data-testid="title-card" />);
      
      expect(screen.getByTestId('title-card')).toBeInTheDocument();
      expect(screen.getByTestId('card-header')).toBeInTheDocument();
      expect(screen.getByTestId('card-title')).toHaveTextContent('Card Title');
    });
    
    it('renders with title and subtitle', () => {
      render(
        <Card 
          title="Main Title" 
          subtitle="Subtitle text" 
          data-testid="title-subtitle-card" 
        />
      );
      
      expect(screen.getByTestId('card-title')).toHaveTextContent('Main Title');
      expect(screen.getByTestId('card-subtitle')).toHaveTextContent('Subtitle text');
    });
    
    it('renders with icon as string', () => {
      render(<Card title="With Icon" icon="🏢" data-testid="icon-card" />);
      
      expect(screen.getByTestId('card-icon')).toHaveTextContent('🏢');
    });
    
    it('renders with icon as React element', () => {
      const IconComponent = () => <div data-testid="custom-icon">Icon</div>;
      render(<Card title="With Icon" icon={<IconComponent />} data-testid="icon-card" />);
      
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
    
    it('renders with actions in footer', () => {
      const actions = <button data-testid="card-action">Apply Now</button>;
      render(<Card title="With Actions" actions={actions} data-testid="actions-card" />);
      
      expect(screen.getByTestId('card-footer')).toBeInTheDocument();
      expect(screen.getByTestId('card-action')).toHaveTextContent('Apply Now');
    });
  });

  // Test different variants
  describe('Visual Variants', () => {
    it('applies default variant styles', () => {
      render(<Card variant="default" data-testid="default-card">Default</Card>);
      
      const card = screen.getByTestId('default-card');
      expect(card).toHaveClass('hover:border-gray-300');
      expect(card).not.toHaveClass('bg-blue-50', 'bg-orange-50');
    });
    
    it('applies highlighted variant styles', () => {
      render(<Card variant="highlighted" data-testid="highlighted-card">Highlighted</Card>);
      
      const card = screen.getByTestId('highlighted-card');
      expect(card).toHaveClass('border-blue-200', 'bg-blue-50', 'hover:border-blue-300');
    });
    
    it('applies featured variant styles', () => {
      render(<Card variant="featured" data-testid="featured-card">Featured</Card>);
      
      const card = screen.getByTestId('featured-card');
      expect(card).toHaveClass('border-orange-200', 'bg-orange-50', 'hover:border-orange-300', 'ring-1', 'ring-orange-100');
    });
    
    it('applies job-listing variant styles', () => {
      render(<Card variant="job-listing" data-testid="job-listing-card">Job</Card>);
      
      const card = screen.getByTestId('job-listing-card');
      expect(card).toHaveClass('hover:border-blue-300', 'hover:bg-blue-50');
    });
    
    it('defaults to default variant', () => {
      render(<Card data-testid="default-variant-card">Default</Card>);
      
      const card = screen.getByTestId('default-variant-card');
      expect(card).toHaveClass('hover:border-gray-300');
    });
  });

  // Test size variations
  describe('Size Variations', () => {
    it('applies small size styles', () => {
      render(<Card size="sm" title="Small Card" data-testid="small-card" />);
      
      const card = screen.getByTestId('small-card');
      expect(card).toHaveClass('p-3', 'min-h-[120px]');
      
      const title = screen.getByTestId('card-title');
      expect(title).toHaveClass('text-base');
    });
    
    it('applies base size styles', () => {
      render(<Card size="base" title="Base Card" data-testid="base-card" />);
      
      const card = screen.getByTestId('base-card');
      expect(card).toHaveClass('p-4', 'min-h-[140px]');
      
      const title = screen.getByTestId('card-title');
      expect(title).toHaveClass('text-lg');
    });
    
    it('applies large size styles', () => {
      render(<Card size="lg" title="Large Card" data-testid="large-card" />);
      
      const card = screen.getByTestId('large-card');
      expect(card).toHaveClass('p-6', 'min-h-[160px]');
      
      const title = screen.getByTestId('card-title');
      expect(title).toHaveClass('text-xl');
    });
    
    it('defaults to base size', () => {
      render(<Card title="Default Size" data-testid="default-size-card" />);
      
      const card = screen.getByTestId('default-size-card');
      expect(card).toHaveClass('p-4', 'min-h-[140px]');
    });
  });

  // Test interactive behavior - clickable cards
  describe('Interactive Behavior - Clickable Cards', () => {
    it('renders as clickable button when onClick and clickableArea="card"', () => {
      const handleClick = jest.fn();
      render(
        <Card 
          onClick={handleClick} 
          clickableArea="card" 
          title="Clickable Card" 
          data-testid="clickable-card" 
        />
      );
      
      const card = screen.getByTestId('clickable-card');
      expect(card).toHaveAttribute('role', 'button');
      expect(card).toHaveAttribute('tabIndex', '0');
      expect(card).toHaveClass('cursor-pointer');
    });
    
    it('calls onClick when card is clicked', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(
        <Card 
          onClick={handleClick} 
          clickableArea="card" 
          title="Clickable Card" 
          data-testid="clickable-card" 
        />
      );
      
      const card = screen.getByTestId('clickable-card');
      await user.click(card);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
    
    it('calls onClick when Enter key is pressed', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(
        <Card 
          onClick={handleClick} 
          clickableArea="card" 
          title="Keyboard Card" 
          data-testid="keyboard-card" 
        />
      );
      
      const card = screen.getByTestId('keyboard-card');
      card.focus();
      await user.keyboard('{Enter}');
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
    
    it('calls onClick when Space key is pressed', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(
        <Card 
          onClick={handleClick} 
          clickableArea="card" 
          title="Keyboard Card" 
          data-testid="keyboard-card" 
        />
      );
      
      const card = screen.getByTestId('keyboard-card');
      card.focus();
      await user.keyboard(' ');
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
    
    it('does not call onClick when clickableArea="none"', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(
        <Card 
          onClick={handleClick} 
          clickableArea="none" 
          title="Non-clickable Card" 
          data-testid="non-clickable-card" 
        />
      );
      
      const card = screen.getByTestId('non-clickable-card');
      await user.click(card);
      
      expect(handleClick).not.toHaveBeenCalled();
      expect(card).not.toHaveAttribute('role', 'button');
    });
  });

  // Test link behavior
  describe('Link Behavior', () => {
    it('renders as link when href and clickableArea="card"', () => {
      render(
        <Card 
          href="/test-url" 
          clickableArea="card" 
          title="Link Card" 
          data-testid="link-card" 
        />
      );
      
      const card = screen.getByTestId('link-card');
      expect(card.tagName.toLowerCase()).toBe('a');
      expect(card).toHaveAttribute('href', '/test-url');
    });
    
    it('renders as div when href provided but clickableArea="none"', () => {
      render(
        <Card 
          href="/test-url" 
          clickableArea="none" 
          title="Link Card" 
          data-testid="link-card" 
        />
      );
      
      const card = screen.getByTestId('link-card');
      expect(card.tagName.toLowerCase()).toBe('div');
      expect(card).not.toHaveAttribute('href');
    });
    
    it('applies same styles to link as div', () => {
      const { rerender } = render(
        <Card 
          variant="featured" 
          size="lg" 
          data-testid="styled-card"
        >
          Content
        </Card>
      );
      
      const divCard = screen.getByTestId('styled-card');
      const divClasses = divCard.className;
      
      rerender(
        <Card 
          variant="featured" 
          size="lg" 
          href="/test" 
          clickableArea="card" 
          data-testid="styled-card"
        >
          Content
        </Card>
      );
      
      const linkCard = screen.getByTestId('styled-card');
      expect(linkCard.className).toBe(divClasses);
    });
  });

  // Test job-specific functionality
  describe('Job Listing Features', () => {
    it('displays job details when provided', () => {
      render(
        <Card 
          title="Software Developer"
          company="Tech Corp"
          location="London, UK"
          salary="£45,000 - £55,000"
          jobType="Full-time"
          data-testid="job-card"
        />
      );
      
      expect(screen.getByTestId('job-details')).toBeInTheDocument();
      expect(screen.getByTestId('job-company')).toHaveTextContent('Tech Corp');
      expect(screen.getByTestId('job-location')).toHaveTextContent('📍 London, UK');
      expect(screen.getByTestId('job-salary')).toHaveTextContent('💷 £45,000 - £55,000');
      expect(screen.getByTestId('job-type')).toHaveTextContent('Full-time');
    });
    
    it('shows featured badge when featured=true', () => {
      render(<Card featured title="Featured Job" data-testid="featured-job" />);
      
      expect(screen.getByTestId('featured-badge')).toBeInTheDocument();
      expect(screen.getByTestId('featured-badge')).toHaveTextContent('Featured');
      expect(screen.getByTestId('featured-job')).toHaveClass('ring-2', 'ring-orange-400');
    });
    
    it('shows urgent badge when urgent=true', () => {
      render(<Card urgent title="Urgent Job" data-testid="urgent-job" />);
      
      expect(screen.getByTestId('urgent-badge')).toBeInTheDocument();
      expect(screen.getByTestId('urgent-badge')).toHaveTextContent('Urgent');
      expect(screen.getByTestId('urgent-job')).toHaveClass('border-red-300', 'bg-red-50');
    });
    
    it('shows both featured and urgent badges', () => {
      render(<Card featured urgent title="Special Job" data-testid="special-job" />);
      
      expect(screen.getByTestId('featured-badge')).toBeInTheDocument();
      expect(screen.getByTestId('urgent-badge')).toBeInTheDocument();
    });
    
    it('does not show job details section when no job props provided', () => {
      render(<Card title="Regular Card" data-testid="regular-card" />);
      
      expect(screen.queryByTestId('job-details')).not.toBeInTheDocument();
    });
  });

  // Test accessibility compliance
  describe('Accessibility', () => {
    it('has proper focus styles', () => {
      render(<Card data-testid="focus-card">Content</Card>);
      
      const card = screen.getByTestId('focus-card');
      expect(card).toHaveClass('focus-within:ring-2', 'focus-within:ring-blue-500', 'focus-within:ring-offset-2');
    });
    
    it('supports custom aria-label', () => {
      render(
        <Card 
          onClick={() => {}} 
          clickableArea="card" 
          aria-label="Apply to this job position" 
          data-testid="aria-card" 
        />
      );
      
      const card = screen.getByTestId('aria-card');
      expect(card).toHaveAttribute('aria-label', 'Apply to this job position');
    });
    
    it('supports aria-describedby', () => {
      render(
        <Card 
          aria-describedby="job-description" 
          data-testid="described-card" 
        />
      );
      
      const card = screen.getByTestId('described-card');
      expect(card).toHaveAttribute('aria-describedby', 'job-description');
    });
    
    it('maintains semantic heading structure', () => {
      render(<Card title="Job Title" data-testid="semantic-card" />);
      
      const title = screen.getByTestId('card-title');
      expect(title.tagName.toLowerCase()).toBe('h3');
    });
    
    it('maintains keyboard navigation for clickable cards', () => {
      render(
        <Card 
          onClick={() => {}} 
          clickableArea="card" 
          title="Keyboard Card" 
          data-testid="keyboard-nav-card" 
        />
      );
      
      const card = screen.getByTestId('keyboard-nav-card');
      expect(card).toHaveAttribute('tabIndex', '0');
      
      // Should be focusable
      card.focus();
      expect(card).toHaveFocus();
    });
  });

  // Test responsive design and mobile requirements
  describe('Responsive Design', () => {
    it('has minimum touch target height for mobile', () => {
      render(<Card size="sm" data-testid="mobile-card" />);
      
      const card = screen.getByTestId('mobile-card');
      expect(card).toHaveClass('min-h-[120px]');
    });
    
    it('uses appropriate text sizes for mobile', () => {
      render(<Card size="sm" title="Mobile Title" subtitle="Mobile subtitle" data-testid="mobile-text" />);
      
      const title = screen.getByTestId('card-title');
      const subtitle = screen.getByTestId('card-subtitle');
      
      expect(title).toHaveClass('text-base');
      expect(subtitle).toHaveClass('text-sm');
    });
    
    it('applies responsive padding', () => {
      const { rerender } = render(<Card size="sm" data-testid="responsive-card" />);
      expect(screen.getByTestId('responsive-card')).toHaveClass('p-3');
      
      rerender(<Card size="base" data-testid="responsive-card" />);
      expect(screen.getByTestId('responsive-card')).toHaveClass('p-4');
      
      rerender(<Card size="lg" data-testid="responsive-card" />);
      expect(screen.getByTestId('responsive-card')).toHaveClass('p-6');
    });
    
    it('handles text overflow gracefully', () => {
      render(
        <Card 
          title="Very long title that might overflow on mobile devices and should be handled properly"
          subtitle="Very long subtitle that also might overflow and needs proper handling"
          data-testid="overflow-card"
        />
      );
      
      const title = screen.getByTestId('card-title');
      const subtitle = screen.getByTestId('card-subtitle');
      
      expect(title).toHaveClass('line-clamp-2');
      expect(subtitle).toHaveClass('line-clamp-1');
    });
  });

  // Test brand colors and recruitment-specific styling
  describe('Brand Colors and Recruitment Styling', () => {
    it('uses recruitment brand colors for featured variant', () => {
      render(<Card variant="featured" data-testid="brand-featured" />);
      
      const card = screen.getByTestId('brand-featured');
      expect(card).toHaveClass('border-orange-200', 'bg-orange-50', 'ring-orange-100');
    });
    
    it('uses appropriate colors for job listing hover states', () => {
      render(<Card variant="job-listing" data-testid="job-hover" />);
      
      const card = screen.getByTestId('job-hover');
      expect(card).toHaveClass('hover:border-blue-300', 'hover:bg-blue-50');
    });
    
    it('applies correct focus ring color', () => {
      render(<Card data-testid="focus-ring" />);
      
      const card = screen.getByTestId('focus-ring');
      expect(card).toHaveClass('focus-within:ring-blue-500');
    });
    
    it('uses recruitment-appropriate badge colors', () => {
      render(<Card featured urgent data-testid="badge-colors" />);
      
      const featuredBadge = screen.getByTestId('featured-badge');
      const urgentBadge = screen.getByTestId('urgent-badge');
      
      expect(featuredBadge).toHaveClass('bg-orange-100', 'text-orange-800');
      expect(urgentBadge).toHaveClass('bg-red-100', 'text-red-800');
    });
  });

  // Test testimonial use case
  describe('Testimonial Use Case', () => {
    it('renders testimonial card with quote and author', () => {
      const testimonial = (
        <Card 
          variant="highlighted"
          size="base"
          data-testid="testimonial-card"
        >
          <blockquote className="text-gray-700 mb-4">
            "Lightyear Recruitment helped me find the perfect warehouse position. Professional and supportive throughout."
          </blockquote>
          <footer className="text-sm text-gray-600">
            <cite>Sarah Johnson</cite>
            <span className="mx-2">•</span>
            <span>ABC Logistics</span>
          </footer>
        </Card>
      );
      
      render(testimonial);
      
      expect(screen.getByTestId('testimonial-card')).toBeInTheDocument();
      expect(screen.getByText(/Lightyear Recruitment helped me find/)).toBeInTheDocument();
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    });
  });

  // Test service offering use case
  describe('Service Offering Use Case', () => {
    it('renders service card with icon, title, description, and CTA', () => {
      const ctaButton = <button className="btn-primary">Learn More</button>;
      
      render(
        <Card 
          icon="🏗️"
          title="Warehouse Staffing"
          subtitle="Temporary and permanent roles"
          actions={ctaButton}
          variant="default"
          data-testid="service-card"
        >
          <p>Connect with top warehouse employers in Berkshire. We specialize in logistics, distribution, and warehouse operations.</p>
        </Card>
      );
      
      expect(screen.getByTestId('service-card')).toBeInTheDocument();
      expect(screen.getByTestId('card-icon')).toHaveTextContent('🏗️');
      expect(screen.getByTestId('card-title')).toHaveTextContent('Warehouse Staffing');
      expect(screen.getByText(/Connect with top warehouse employers/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Learn More' })).toBeInTheDocument();
    });
  });

  // Test company benefits use case
  describe('Company Benefits Use Case', () => {
    it('renders benefit card with icon, title, and description', () => {
      render(
        <Card 
          icon="💰"
          title="Competitive Pay"
          size="sm"
          variant="highlighted"
          data-testid="benefit-card"
        >
          <p className="text-sm text-gray-600">Above-market rates for all positions with performance bonuses available.</p>
        </Card>
      );
      
      expect(screen.getByTestId('benefit-card')).toBeInTheDocument();
      expect(screen.getByTestId('card-icon')).toHaveTextContent('💰');
      expect(screen.getByTestId('card-title')).toHaveTextContent('Competitive Pay');
      expect(screen.getByText(/Above-market rates for all positions/)).toBeInTheDocument();
    });
  });

  // Test edge cases and error handling
  describe('Edge Cases', () => {
    it('handles empty title gracefully', () => {
      render(<Card title="" data-testid="empty-title" />);
      
      const titleElement = screen.queryByTestId('card-title');
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveTextContent('');
    });
    
    it('handles null children gracefully', () => {
      render(<Card data-testid="null-children">{null}</Card>);
      
      expect(screen.getByTestId('null-children')).toBeInTheDocument();
    });
    
    it('handles multiple rapid clicks', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(
        <Card 
          onClick={handleClick} 
          clickableArea="card" 
          data-testid="rapid-click" 
        />
      );
      
      const card = screen.getByTestId('rapid-click');
      
      await user.click(card);
      await user.click(card);
      await user.click(card);
      
      expect(handleClick).toHaveBeenCalledTimes(3);
    });
    
    it('maintains focus after interaction', async () => {
      const user = userEvent.setup();
      
      render(
        <Card 
          onClick={() => {}} 
          clickableArea="card" 
          data-testid="focus-maintain" 
        />
      );
      
      const card = screen.getByTestId('focus-maintain');
      await user.click(card);
      
      expect(card).toHaveFocus();
    });
  });

  // Test property combinations
  describe('Property Combinations', () => {
    it('combines variant, size, and interactive properties', () => {
      const handleClick = jest.fn();
      
      render(
        <Card 
          variant="featured"
          size="lg"
          onClick={handleClick}
          clickableArea="card"
          featured
          urgent
          data-testid="combined-props"
        />
      );
      
      const card = screen.getByTestId('combined-props');
      expect(card).toHaveClass('border-orange-200', 'bg-orange-50', 'p-6', 'min-h-[160px]', 'cursor-pointer', 'ring-2', 'ring-orange-400', 'border-red-300', 'bg-red-50');
      expect(card).toHaveAttribute('role', 'button');
    });
    
    it('handles job listing with all job details and interactivity', () => {
      render(
        <Card 
          variant="job-listing"
          title="Warehouse Supervisor"
          company="Logistics Plus"
          location="Reading, Berkshire"
          salary="£28,000 - £32,000"
          jobType="Permanent"
          featured
          href="/jobs/warehouse-supervisor-123"
          clickableArea="card"
          data-testid="full-job-card"
        />
      );
      
      const card = screen.getByTestId('full-job-card');
      expect(card.tagName.toLowerCase()).toBe('a');
      expect(card).toHaveAttribute('href', '/jobs/warehouse-supervisor-123');
      expect(screen.getByTestId('job-company')).toHaveTextContent('Logistics Plus');
      expect(screen.getByTestId('featured-badge')).toBeInTheDocument();
    });
  });

  // Test performance considerations
  describe('Performance', () => {
    it('does not re-render unnecessarily with same props', () => {
      const { rerender } = render(<Card title="Static Title">Static Content</Card>);
      const card = screen.getByText('Static Title');
      const initialElement = card;
      
      rerender(<Card title="Static Title">Static Content</Card>);
      const afterRerender = screen.getByText('Static Title');
      
      expect(afterRerender).toBe(initialElement);
    });
    
    it('handles dynamic prop changes efficiently', () => {
      const { rerender } = render(<Card variant="default" size="sm" data-testid="dynamic-card">Content</Card>);
      
      rerender(<Card variant="featured" size="lg" data-testid="dynamic-card">Content</Card>);
      const card = screen.getByTestId('dynamic-card');
      
      expect(card).toHaveClass('border-orange-200', 'bg-orange-50', 'p-6', 'min-h-[160px]');
      expect(card).not.toHaveClass('p-3', 'min-h-[120px]');
    });
  });
});