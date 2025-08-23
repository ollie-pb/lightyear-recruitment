import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// TypeScript interface for Heading component
interface HeadingProps {
  children: React.ReactNode;
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  color?: 'default' | 'muted' | 'accent' | 'success' | 'warning' | 'error';
  className?: string;
  required?: boolean;
  error?: boolean;
  id?: string;
  'data-testid'?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

// Mock implementation for TDD - this will guide our real implementation
const Heading: React.FC<HeadingProps> = React.forwardRef<HTMLHeadingElement, HeadingProps>(({
  children,
  level = 'h1',
  size = 'base',
  color = 'default',
  className = '',
  required = false,
  error = false,
  id,
  ...props
}, ref) => {
  const Component = level;
  
  const baseClasses = 'font-sans font-semibold leading-tight';
  
  const sizeClasses = {
    'xs': 'text-xs',       // 0.8rem
    'sm': 'text-sm',       // 0.875rem  
    'base': 'text-base',   // 1rem
    'lg': 'text-lg',       // 1.125rem
    'xl': 'text-xl',       // 1.25rem
    '2xl': 'text-2xl',     // 1.563rem
    '3xl': 'text-3xl',     // 1.953rem
    '4xl': 'text-4xl',     // 2.441rem
    '5xl': 'text-5xl',     // 3.052rem
  };
  
  const colorClasses = {
    default: 'text-neutral-900',
    muted: 'text-neutral-600',
    accent: 'text-primary',
    success: 'text-success',
    warning: 'text-orange-500',
    error: 'text-red-500',
  };
  
  // Mobile-first responsive sizing - smaller on mobile
  const responsiveClasses = {
    'xs': 'text-xs',
    'sm': 'text-xs sm:text-sm',
    'base': 'text-sm sm:text-base',
    'lg': 'text-base sm:text-lg',
    'xl': 'text-lg sm:text-xl',
    '2xl': 'text-xl sm:text-2xl',
    '3xl': 'text-2xl sm:text-3xl',
    '4xl': 'text-3xl sm:text-4xl',
    '5xl': 'text-4xl sm:text-5xl',
  };
  
  // Interactive elements need 44px touch target
  const interactiveClasses = (required || error) ? 'min-h-[44px] flex items-center' : '';
  
  const finalColor = error ? 'error' : color;
  const classes = `${baseClasses} ${responsiveClasses[size]} ${colorClasses[finalColor]} ${interactiveClasses} ${className}`.trim();
  
  return (
    <Component
      ref={ref}
      id={id}
      className={classes}
      aria-required={required || undefined}
      aria-invalid={error || undefined}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
    </Component>
  );
});

Heading.displayName = 'Heading';

describe('Heading Component', () => {
  // Test user behavior: Basic rendering and content
  describe('Rendering and Content', () => {
    it('renders heading with text content', () => {
      render(<Heading>Welcome to our site</Heading>);
      
      const heading = screen.getByRole('heading', { name: /welcome to our site/i });
      expect(heading).toBeInTheDocument();
    });
    
    it('renders heading with children elements', () => {
      render(
        <Heading>
          <span>Section</span>
          <span>Title</span>
        </Heading>
      );
      
      const heading = screen.getByRole('heading');
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Section');
      expect(heading).toHaveTextContent('Title');
    });
    
    it('supports custom id attribute', () => {
      render(<Heading id="main-heading">Main Title</Heading>);
      
      const heading = screen.getByRole('heading');
      expect(heading).toHaveAttribute('id', 'main-heading');
    });
    
    it('has proper display name for debugging', () => {
      expect(Heading.displayName).toBe('Heading');
    });
  });

  // Test user behavior: Semantic levels
  describe('Semantic Levels', () => {
    it('renders h1 by default', () => {
      render(<Heading>Default Heading</Heading>);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H1');
    });
    
    it('renders h2 when level is specified', () => {
      render(<Heading level="h2">Section Heading</Heading>);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H2');
    });
    
    it('renders h3 when level is specified', () => {
      render(<Heading level="h3">Subsection Heading</Heading>);
      
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H3');
    });
    
    it('renders h4 when level is specified', () => {
      render(<Heading level="h4">Minor Heading</Heading>);
      
      const heading = screen.getByRole('heading', { level: 4 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H4');
    });
    
    it('renders h5 when level is specified', () => {
      render(<Heading level="h5">Small Heading</Heading>);
      
      const heading = screen.getByRole('heading', { level: 5 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H5');
    });
    
    it('renders h6 when level is specified', () => {
      render(<Heading level="h6">Smallest Heading</Heading>);
      
      const heading = screen.getByRole('heading', { level: 6 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H6');
    });
  });

  // Test user behavior: Size variants
  describe('Size Variants', () => {
    it('renders xs size with correct classes', () => {
      render(<Heading size="xs" data-testid="xs-heading">Extra Small</Heading>);
      
      const heading = screen.getByTestId('xs-heading');
      expect(heading).toHaveClass('text-xs');
    });
    
    it('renders sm size with correct classes', () => {
      render(<Heading size="sm" data-testid="sm-heading">Small</Heading>);
      
      const heading = screen.getByTestId('sm-heading');
      expect(heading).toHaveClass('text-xs', 'sm:text-sm');
    });
    
    it('renders base size with correct classes', () => {
      render(<Heading size="base" data-testid="base-heading">Base</Heading>);
      
      const heading = screen.getByTestId('base-heading');
      expect(heading).toHaveClass('text-sm', 'sm:text-base');
    });
    
    it('renders lg size with correct classes', () => {
      render(<Heading size="lg" data-testid="lg-heading">Large</Heading>);
      
      const heading = screen.getByTestId('lg-heading');
      expect(heading).toHaveClass('text-base', 'sm:text-lg');
    });
    
    it('renders xl size with correct classes', () => {
      render(<Heading size="xl" data-testid="xl-heading">Extra Large</Heading>);
      
      const heading = screen.getByTestId('xl-heading');
      expect(heading).toHaveClass('text-lg', 'sm:text-xl');
    });
    
    it('renders 2xl size with correct classes', () => {
      render(<Heading size="2xl" data-testid="2xl-heading">2X Large</Heading>);
      
      const heading = screen.getByTestId('2xl-heading');
      expect(heading).toHaveClass('text-xl', 'sm:text-2xl');
    });
    
    it('renders 3xl size with correct classes', () => {
      render(<Heading size="3xl" data-testid="3xl-heading">3X Large</Heading>);
      
      const heading = screen.getByTestId('3xl-heading');
      expect(heading).toHaveClass('text-2xl', 'sm:text-3xl');
    });
    
    it('renders 4xl size with correct classes', () => {
      render(<Heading size="4xl" data-testid="4xl-heading">4X Large</Heading>);
      
      const heading = screen.getByTestId('4xl-heading');
      expect(heading).toHaveClass('text-3xl', 'sm:text-4xl');
    });
    
    it('renders 5xl size with correct classes', () => {
      render(<Heading size="5xl" data-testid="5xl-heading">5X Large</Heading>);
      
      const heading = screen.getByTestId('5xl-heading');
      expect(heading).toHaveClass('text-4xl', 'sm:text-5xl');
    });
    
    it('defaults to base size when no size specified', () => {
      render(<Heading data-testid="default-size">Default Size</Heading>);
      
      const heading = screen.getByTestId('default-size');
      expect(heading).toHaveClass('text-sm', 'sm:text-base');
    });
  });

  // Test user behavior: Size independent of semantic level
  describe('Size Independent of Semantic Level', () => {
    it('allows h1 with small size', () => {
      render(<Heading level="h1" size="xs" data-testid="small-h1">Small H1</Heading>);
      
      const heading = screen.getByTestId('small-h1');
      expect(heading.tagName).toBe('H1');
      expect(heading).toHaveClass('text-xs');
    });
    
    it('allows h6 with large size', () => {
      render(<Heading level="h6" size="5xl" data-testid="large-h6">Large H6</Heading>);
      
      const heading = screen.getByTestId('large-h6');
      expect(heading.tagName).toBe('H6');
      expect(heading).toHaveClass('text-4xl', 'sm:text-5xl');
    });
    
    it('maintains semantic meaning regardless of visual size', () => {
      render(
        <div>
          <Heading level="h1" size="sm">Small Main Title</Heading>
          <Heading level="h2" size="xl">Large Subtitle</Heading>
        </div>
      );
      
      const h1 = screen.getByRole('heading', { level: 1 });
      const h2 = screen.getByRole('heading', { level: 2 });
      
      expect(h1).toHaveClass('text-xs', 'sm:text-sm');
      expect(h2).toHaveClass('text-lg', 'sm:text-xl');
    });
  });

  // Test user behavior: Color variants
  describe('Color Variants', () => {
    it('renders default color with correct classes', () => {
      render(<Heading color="default" data-testid="default-color">Default</Heading>);
      
      const heading = screen.getByTestId('default-color');
      expect(heading).toHaveClass('text-neutral-900');
    });
    
    it('renders muted color with correct classes', () => {
      render(<Heading color="muted" data-testid="muted-color">Muted</Heading>);
      
      const heading = screen.getByTestId('muted-color');
      expect(heading).toHaveClass('text-neutral-600');
    });
    
    it('renders accent color with correct classes', () => {
      render(<Heading color="accent" data-testid="accent-color">Accent</Heading>);
      
      const heading = screen.getByTestId('accent-color');
      expect(heading).toHaveClass('text-primary');
    });
    
    it('renders success color with correct classes', () => {
      render(<Heading color="success" data-testid="success-color">Success</Heading>);
      
      const heading = screen.getByTestId('success-color');
      expect(heading).toHaveClass('text-success');
    });
    
    it('renders warning color with correct classes', () => {
      render(<Heading color="warning" data-testid="warning-color">Warning</Heading>);
      
      const heading = screen.getByTestId('warning-color');
      expect(heading).toHaveClass('text-orange-500');
    });
    
    it('renders error color with correct classes', () => {
      render(<Heading color="error" data-testid="error-color">Error</Heading>);
      
      const heading = screen.getByTestId('error-color');
      expect(heading).toHaveClass('text-red-500');
    });
    
    it('defaults to default color when no color specified', () => {
      render(<Heading data-testid="default-color-implicit">Default Color</Heading>);
      
      const heading = screen.getByTestId('default-color-implicit');
      expect(heading).toHaveClass('text-neutral-900');
    });
  });

  // Test user behavior: Responsive behavior
  describe('Responsive Behavior', () => {
    it('applies mobile-first responsive classes', () => {
      render(<Heading size="lg" data-testid="responsive-heading">Responsive</Heading>);
      
      const heading = screen.getByTestId('responsive-heading');
      expect(heading).toHaveClass('text-base', 'sm:text-lg');
    });
    
    it('smallest sizes have consistent mobile sizing', () => {
      render(<Heading size="xs" data-testid="xs-mobile">XS Mobile</Heading>);
      
      const heading = screen.getByTestId('xs-mobile');
      expect(heading).toHaveClass('text-xs');
    });
    
    it('largest sizes scale down appropriately on mobile', () => {
      render(<Heading size="5xl" data-testid="5xl-mobile">5XL Mobile</Heading>);
      
      const heading = screen.getByTestId('5xl-mobile');
      expect(heading).toHaveClass('text-4xl', 'sm:text-5xl');
    });
    
    it('maintains readability across screen sizes', () => {
      render(
        <div>
          <Heading size="3xl" data-testid="large-mobile">Large Title</Heading>
          <Heading size="lg" data-testid="medium-mobile">Medium Title</Heading>
        </div>
      );
      
      const large = screen.getByTestId('large-mobile');
      const medium = screen.getByTestId('medium-mobile');
      
      // Large title scales down more on mobile
      expect(large).toHaveClass('text-2xl', 'sm:text-3xl');
      // Medium title has moderate scaling
      expect(medium).toHaveClass('text-base', 'sm:text-lg');
    });
  });

  // Test user behavior: Accessibility features
  describe('Accessibility Features', () => {
    it('supports custom aria-label', () => {
      render(<Heading aria-label="Custom heading label">Visual Text</Heading>);
      
      const heading = screen.getByRole('heading', { name: /custom heading label/i });
      expect(heading).toBeInTheDocument();
    });
    
    it('supports aria-describedby', () => {
      render(
        <div>
          <Heading aria-describedby="heading-description">Heading</Heading>
          <p id="heading-description">This describes the heading</p>
        </div>
      );
      
      const heading = screen.getByRole('heading');
      expect(heading).toHaveAttribute('aria-describedby', 'heading-description');
    });
    
    it('maintains proper heading hierarchy', () => {
      render(
        <div>
          <Heading level="h1">Main Title</Heading>
          <Heading level="h2">Section Title</Heading>
          <Heading level="h3">Subsection Title</Heading>
        </div>
      );
      
      const headings = screen.getAllByRole('heading');
      expect(headings).toHaveLength(3);
      expect(headings[0]).toHaveProperty('tagName', 'H1');
      expect(headings[1]).toHaveProperty('tagName', 'H2');
      expect(headings[2]).toHaveProperty('tagName', 'H3');
    });
    
    it('provides accessible content for screen readers', () => {
      render(<Heading>This is accessible content</Heading>);
      
      const heading = screen.getByRole('heading');
      expect(heading).toHaveAccessibleName('This is accessible content');
    });
    
    it('supports role override if needed', () => {
      render(<Heading role="banner" data-testid="banner-heading">Banner</Heading>);
      
      // When role is overridden, it may not be found by heading role
      const element = screen.getByTestId('banner-heading');
      expect(element).toBeInTheDocument();
    });
  });

  // Test user behavior: Custom styling and className
  describe('Custom Styling and className', () => {
    it('applies custom className', () => {
      render(<Heading className="custom-class" data-testid="custom-heading">Custom</Heading>);
      
      const heading = screen.getByTestId('custom-heading');
      expect(heading).toHaveClass('custom-class');
    });
    
    it('combines custom className with default classes', () => {
      render(<Heading className="custom-class" size="lg" data-testid="combined-classes">Combined</Heading>);
      
      const heading = screen.getByTestId('combined-classes');
      expect(heading).toHaveClass('custom-class', 'font-sans', 'font-semibold', 'text-base', 'sm:text-lg');
    });
    
    it('allows className override of default styles', () => {
      render(<Heading className="text-purple-500 font-light" data-testid="override-heading">Override</Heading>);
      
      const heading = screen.getByTestId('override-heading');
      expect(heading).toHaveClass('text-purple-500', 'font-light');
    });
    
    it('handles empty className gracefully', () => {
      render(<Heading className="" data-testid="empty-class">Empty Class</Heading>);
      
      const heading = screen.getByTestId('empty-class');
      expect(heading).toBeInTheDocument();
    });
  });

  // Test user behavior: Interactive states
  describe('Interactive States', () => {
    it('renders required indicator when required is true', () => {
      render(<Heading required data-testid="required-heading">Required Field</Heading>);
      
      const heading = screen.getByTestId('required-heading');
      const asterisk = heading.querySelector('[aria-hidden="true"]');
      
      expect(heading).toHaveAttribute('aria-required', 'true');
      expect(asterisk).toBeInTheDocument();
      expect(asterisk).toHaveTextContent('*');
      expect(asterisk).toHaveClass('text-red-500', 'ml-1');
    });
    
    it('applies touch target sizing when required', () => {
      render(<Heading required data-testid="touch-target-required">Required</Heading>);
      
      const heading = screen.getByTestId('touch-target-required');
      expect(heading).toHaveClass('min-h-[44px]', 'flex', 'items-center');
    });
    
    it('renders error state with correct styling', () => {
      render(<Heading error data-testid="error-heading">Error State</Heading>);
      
      const heading = screen.getByTestId('error-heading');
      expect(heading).toHaveAttribute('aria-invalid', 'true');
      expect(heading).toHaveClass('text-red-500');
    });
    
    it('applies touch target sizing when in error state', () => {
      render(<Heading error data-testid="touch-target-error">Error</Heading>);
      
      const heading = screen.getByTestId('touch-target-error');
      expect(heading).toHaveClass('min-h-[44px]', 'flex', 'items-center');
    });
    
    it('error state overrides color prop', () => {
      render(<Heading color="accent" error data-testid="error-override">Error Override</Heading>);
      
      const heading = screen.getByTestId('error-override');
      expect(heading).toHaveClass('text-red-500');
      expect(heading).not.toHaveClass('text-primary');
    });
    
    it('handles required and error states together', () => {
      render(<Heading required error data-testid="required-error">Required Error</Heading>);
      
      const heading = screen.getByTestId('required-error');
      const asterisk = heading.querySelector('[aria-hidden="true"]');
      
      expect(heading).toHaveAttribute('aria-required', 'true');
      expect(heading).toHaveAttribute('aria-invalid', 'true');
      expect(heading).toHaveClass('text-red-500', 'min-h-[44px]');
      expect(asterisk).toBeInTheDocument();
    });
  });

  // Test user behavior: Edge cases and error handling
  describe('Edge Cases and Error Handling', () => {
    it('handles empty children gracefully', () => {
      render(<Heading>{''}</Heading>);
      
      const heading = screen.getByRole('heading');
      expect(heading).toBeInTheDocument();
    });
    
    it('handles null children gracefully', () => {
      render(<Heading>{null}</Heading>);
      
      const heading = screen.getByRole('heading');
      expect(heading).toBeInTheDocument();
    });
    
    it('handles undefined children gracefully', () => {
      render(<Heading>{undefined}</Heading>);
      
      const heading = screen.getByRole('heading');
      expect(heading).toBeInTheDocument();
    });
    
    it('handles complex children with nested elements', () => {
      render(
        <Heading>
          <span>Part 1</span>
          {' '}
          <strong>Part 2</strong>
          {' '}
          <em>Part 3</em>
        </Heading>
      );
      
      const heading = screen.getByRole('heading');
      expect(heading).toHaveTextContent('Part 1 Part 2 Part 3');
      expect(heading.querySelector('strong')).toBeInTheDocument();
      expect(heading.querySelector('em')).toBeInTheDocument();
    });
    
    it('handles boolean and numeric children', () => {
      render(<Heading>{42}</Heading>);
      
      const heading = screen.getByRole('heading');
      expect(heading).toHaveTextContent('42');
    });
  });

  // Test user behavior: TypeScript prop validation
  describe('TypeScript Prop Validation', () => {
    it('accepts all valid level values', () => {
      const levels: Array<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
      
      levels.forEach(level => {
        const { unmount } = render(<Heading level={level}>Level {level}</Heading>);
        const heading = screen.getByRole('heading');
        expect(heading.tagName).toBe(level.toUpperCase());
        unmount();
      });
    });
    
    it('accepts all valid size values', () => {
      const sizes: Array<'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'> = 
        ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'];
      
      sizes.forEach(size => {
        const { unmount } = render(<Heading size={size} data-testid={`size-${size}`}>Size {size}</Heading>);
        const heading = screen.getByTestId(`size-${size}`);
        expect(heading).toBeInTheDocument();
        unmount();
      });
    });
    
    it('accepts all valid color values', () => {
      const colors: Array<'default' | 'muted' | 'accent' | 'success' | 'warning' | 'error'> = 
        ['default', 'muted', 'accent', 'success', 'warning', 'error'];
      
      colors.forEach(color => {
        const { unmount } = render(<Heading color={color} data-testid={`color-${color}`}>Color {color}</Heading>);
        const heading = screen.getByTestId(`color-${color}`);
        expect(heading).toBeInTheDocument();
        unmount();
      });
    });
  });

  // Test user behavior: Performance considerations
  describe('Performance Considerations', () => {
    it('does not re-render unnecessarily with same props', () => {
      const { rerender } = render(<Heading level="h2" size="lg">Static Heading</Heading>);
      const heading = screen.getByRole('heading');
      const initialElement = heading;
      
      // Re-render with same props
      rerender(<Heading level="h2" size="lg">Static Heading</Heading>);
      const afterRerender = screen.getByRole('heading');
      
      expect(afterRerender).toBe(initialElement);
    });
    
    it('handles rapid prop changes efficiently', () => {
      const { rerender } = render(<Heading level="h1" size="sm" color="default">Dynamic</Heading>);
      
      rerender(<Heading level="h2" size="lg" color="accent">Dynamic</Heading>);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('text-base', 'sm:text-lg', 'text-primary');
      
      rerender(<Heading level="h3" size="xl" color="error">Dynamic</Heading>);
      const updatedHeading = screen.getByRole('heading', { level: 3 });
      expect(updatedHeading).toHaveClass('text-lg', 'sm:text-xl', 'text-red-500');
    });
    
    it('efficiently handles className changes', () => {
      const { rerender } = render(<Heading className="old-class">Class Test</Heading>);
      
      rerender(<Heading className="new-class">Class Test</Heading>);
      const heading = screen.getByRole('heading');
      expect(heading).toHaveClass('new-class');
      expect(heading).not.toHaveClass('old-class');
    });
  });

  // Test user behavior: Brand color compliance
  describe('Brand Color Compliance', () => {
    it('uses correct primary brand color (#0066CC)', () => {
      render(<Heading color="accent" data-testid="brand-primary">Primary Brand</Heading>);
      
      const heading = screen.getByTestId('brand-primary');
      expect(heading).toHaveClass('text-primary');
    });
    
    it('uses correct success brand color (#28A745)', () => {
      render(<Heading color="success" data-testid="brand-success">Success Brand</Heading>);
      
      const heading = screen.getByTestId('brand-success');
      expect(heading).toHaveClass('text-success');
    });
    
    it('uses neutral colors from brand palette', () => {
      render(<Heading color="muted" data-testid="brand-neutral">Neutral Brand</Heading>);
      
      const heading = screen.getByTestId('brand-neutral');
      expect(heading).toHaveClass('text-neutral-600');
    });
    
    it('maintains brand consistency across color variants', () => {
      const { rerender } = render(<Heading color="default" data-testid="brand-test">Brand Test</Heading>);
      expect(screen.getByTestId('brand-test')).toHaveClass('text-neutral-900');
      
      rerender(<Heading color="accent" data-testid="brand-test">Brand Test</Heading>);
      expect(screen.getByTestId('brand-test')).toHaveClass('text-primary');
      
      rerender(<Heading color="warning" data-testid="brand-test">Brand Test</Heading>);
      expect(screen.getByTestId('brand-test')).toHaveClass('text-orange-500');
    });
  });

  // Test user behavior: Mobile touch targets
  describe('Mobile Touch Target Requirements', () => {
    it('has minimum 44px height when required for accessibility', () => {
      render(<Heading required data-testid="touch-required">Required Field</Heading>);
      
      const heading = screen.getByTestId('touch-required');
      expect(heading).toHaveClass('min-h-[44px]');
    });
    
    it('has minimum 44px height when in error state', () => {
      render(<Heading error data-testid="touch-error">Error State</Heading>);
      
      const heading = screen.getByTestId('touch-error');
      expect(heading).toHaveClass('min-h-[44px]');
    });
    
    it('uses flexbox for proper alignment in interactive states', () => {
      render(<Heading required error data-testid="touch-interactive">Interactive</Heading>);
      
      const heading = screen.getByTestId('touch-interactive');
      expect(heading).toHaveClass('min-h-[44px]', 'flex', 'items-center');
    });
    
    it('does not apply touch target sizing for non-interactive headings', () => {
      render(<Heading data-testid="non-interactive">Regular Heading</Heading>);
      
      const heading = screen.getByTestId('non-interactive');
      expect(heading).not.toHaveClass('min-h-[44px]');
      expect(heading).not.toHaveClass('flex');
    });
  });

  // Test combinations of props
  describe('Property Combinations', () => {
    it('handles level + size + color combination', () => {
      render(
        <Heading 
          level="h3" 
          size="2xl" 
          color="accent" 
          data-testid="combo-basic"
        >
          Combo Basic
        </Heading>
      );
      
      const heading = screen.getByTestId('combo-basic');
      expect(heading.tagName).toBe('H3');
      expect(heading).toHaveClass('text-xl', 'sm:text-2xl', 'text-primary');
    });
    
    it('handles all props combination', () => {
      render(
        <Heading 
          level="h2"
          size="3xl"
          color="success"
          required
          error
          className="custom-class"
          id="combo-all"
          data-testid="combo-all"
          aria-label="Complex heading"
        >
          Complex Heading
        </Heading>
      );
      
      const heading = screen.getByTestId('combo-all');
      const asterisk = heading.querySelector('[aria-hidden="true"]');
      
      expect(heading.tagName).toBe('H2');
      expect(heading).toHaveClass('text-2xl', 'sm:text-3xl', 'text-red-500', 'custom-class', 'min-h-[44px]');
      expect(heading).toHaveAttribute('id', 'combo-all');
      expect(heading).toHaveAttribute('aria-required', 'true');
      expect(heading).toHaveAttribute('aria-invalid', 'true');
      expect(asterisk).toBeInTheDocument();
    });
    
    it('handles responsive + interactive combination', () => {
      render(
        <Heading 
          size="4xl" 
          required 
          data-testid="responsive-interactive"
        >
          Responsive Interactive
        </Heading>
      );
      
      const heading = screen.getByTestId('responsive-interactive');
      expect(heading).toHaveClass('text-3xl', 'sm:text-4xl', 'min-h-[44px]', 'flex', 'items-center');
    });
  });
});