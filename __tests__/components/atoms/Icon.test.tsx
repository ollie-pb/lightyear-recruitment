import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock Icon component for testing - this guides the real implementation
interface IconProps {
  // Size variants: xs (16px), sm (20px), base (24px), lg (32px), xl (40px)
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  
  // Brand color variants
  color?: 'default' | 'muted' | 'accent' | 'success' | 'warning' | 'error' | 'inverse' | 'current';
  
  // Icon sources
  name?: string; // Icon name/string identifier
  src?: string;  // External URL
  icon?: React.ComponentType<any>; // SVG component
  
  // Accessibility
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  alt?: string;
  
  // Interactive states
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  disabled?: boolean;
  tabIndex?: number;
  
  // Performance
  loading?: boolean;
  lazy?: boolean;
  
  // SVG properties
  viewBox?: string;
  preserveAspectRatio?: string;
  
  // Transformations
  rotation?: 0 | 90 | 180 | 270;
  flipX?: boolean;
  flipY?: boolean;
  
  // Custom properties
  className?: string;
  style?: React.CSSProperties;
  'data-testid'?: string;
}

// Mock SVG component for testing
const MockSvgIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} data-testid="mock-svg-icon">
    <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z" />
  </svg>
);

// This is a mock implementation that will guide our real implementation
const Icon: React.FC<IconProps> = ({
  size = 'base',
  color = 'default',
  name,
  src,
  icon: IconComponent,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  alt,
  onClick,
  onKeyDown,
  disabled = false,
  tabIndex,
  loading = false,
  lazy = false,
  viewBox = '0 0 24 24',
  preserveAspectRatio = 'xMidYMid meet',
  rotation = 0,
  flipX = false,
  flipY = false,
  className,
  style,
  ...props
}) => {
  // Size mapping (includes 44px touch target for interactive icons)
  const sizeClasses = {
    xs: onClick ? 'min-w-[44px] min-h-[44px] p-[14px]' : 'w-4 h-4', // 16px icon, 44px touch target
    sm: onClick ? 'min-w-[44px] min-h-[44px] p-[12px]' : 'w-5 h-5', // 20px icon, 44px touch target
    base: onClick ? 'min-w-[44px] min-h-[44px] p-[10px]' : 'w-6 h-6', // 24px icon, 44px touch target
    lg: onClick ? 'min-w-[44px] min-h-[44px] p-[6px]' : 'w-8 h-8',   // 32px icon, 44px touch target
    xl: onClick ? 'min-w-[44px] min-h-[44px] p-[2px]' : 'w-10 h-10', // 40px icon, 44px touch target
  };

  // Brand color mapping based on requirements
  const colorClasses = {
    default: 'text-gray-900',
    muted: 'text-gray-500',
    accent: 'text-blue-600', // Primary brand color #0066CC
    success: 'text-green-600', // Success color #28A745
    warning: 'text-yellow-500',
    error: 'text-red-600',
    inverse: 'text-white',
    current: 'text-current',
  };

  // Interactive state classes
  const interactiveClasses = onClick && !disabled ? 
    'cursor-pointer hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200' : 
    '';

  // Disabled state classes
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  // Transform classes
  const transformClasses = [];
  if (rotation !== 0) transformClasses.push(`rotate-${rotation}`);
  if (flipX) transformClasses.push('scale-x-[-1]');
  if (flipY) transformClasses.push('scale-y-[-1]');

  const allClasses = [
    'inline-block',
    sizeClasses[size],
    colorClasses[color],
    interactiveClasses,
    disabledClasses,
    transformClasses.length > 0 ? `transform ${transformClasses.join(' ')}` : '',
    className,
  ].filter(Boolean).join(' ');

  // Handle keyboard events for interactive icons
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && !disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
    onKeyDown?.(e);
  };

  // Handle click for interactive icons
  const handleClick = () => {
    if (onClick && !disabled) {
      onClick();
    }
  };

  // Determine ARIA properties
  const ariaProps: any = {};
  if (ariaLabel) ariaProps['aria-label'] = ariaLabel;
  if (ariaLabelledBy) ariaProps['aria-labelledby'] = ariaLabelledBy;
  if (ariaDescribedBy) ariaProps['aria-describedby'] = ariaDescribedBy;
  
  // Set role and tabIndex for interactive icons
  if (onClick) {
    ariaProps.role = 'button';
    ariaProps.tabIndex = disabled ? -1 : (tabIndex ?? 0);
  }

  // Common props for all icon types
  const commonProps = {
    className: allClasses,
    style,
    onClick: onClick ? handleClick : undefined,
    onKeyDown: onClick ? handleKeyDown : undefined,
    ...ariaProps,
    ...props,
  };

  // Loading state
  if (loading) {
    return (
      <div 
        {...commonProps}
        data-testid="icon-loading"
        aria-label={ariaLabel || "Loading icon"}
      >
        <div className="animate-spin w-full h-full border-2 border-current border-t-transparent rounded-full" />
      </div>
    );
  }

  // SVG Component icon
  if (IconComponent) {
    return (
      <div {...commonProps}>
        <IconComponent 
          className="w-full h-full"
          viewBox={viewBox}
          preserveAspectRatio={preserveAspectRatio}
          aria-hidden={!ariaLabel}
        />
      </div>
    );
  }

  // External URL icon
  if (src) {
    return (
      <img
        {...commonProps}
        src={src}
        alt={alt || ariaLabel || ''}
        loading={lazy ? 'lazy' : 'eager'}
        onError={(e) => {
          // Fallback for broken images
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  // Named icon (string identifier)
  if (name) {
    return (
      <div 
        {...commonProps}
        data-icon-name={name}
        aria-label={ariaLabel || `${name} icon`}
      >
        <svg 
          className="w-full h-full" 
          viewBox={viewBox}
          preserveAspectRatio={preserveAspectRatio}
          fill="currentColor"
          aria-hidden={!ariaLabel}
        >
          {/* Mock path based on icon name */}
          <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z" />
        </svg>
      </div>
    );
  }

  // Fallback - empty icon container
  return (
    <div 
      {...commonProps}
      aria-label={ariaLabel || "Icon"}
    />
  );
};

describe('Icon Component', () => {
  // Test basic rendering and content
  describe('Rendering and Content', () => {
    it('renders icon with SVG component', () => {
      render(<Icon icon={MockSvgIcon} aria-label="Test icon" />);
      
      expect(screen.getByLabelText(/test icon/i)).toBeInTheDocument();
      expect(screen.getByTestId('mock-svg-icon')).toBeInTheDocument();
    });
    
    it('renders icon with name identifier', () => {
      render(<Icon name="shield" data-testid="named-icon" />);
      
      const icon = screen.getByTestId('named-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-icon-name', 'shield');
      expect(icon).toHaveAttribute('aria-label', 'shield icon');
    });
    
    it('renders icon with external URL', () => {
      render(<Icon src="https://example.com/icon.svg" alt="External icon" />);
      
      const img = screen.getByRole('img', { name: /external icon/i });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/icon.svg');
    });
    
    it('renders fallback icon container when no source provided', () => {
      render(<Icon aria-label="Empty icon" data-testid="empty-icon" />);
      
      const icon = screen.getByTestId('empty-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-label', 'Empty icon');
    });
  });

  // Test size variants with touch targets
  describe('Size Variations', () => {
    it('renders xs size (16px) with correct dimensions', () => {
      render(<Icon name="test" size="xs" data-testid="xs-icon" />);
      
      const icon = screen.getByTestId('xs-icon');
      expect(icon).toHaveClass('w-4', 'h-4');
    });
    
    it('renders sm size (20px) with correct dimensions', () => {
      render(<Icon name="test" size="sm" data-testid="sm-icon" />);
      
      const icon = screen.getByTestId('sm-icon');
      expect(icon).toHaveClass('w-5', 'h-5');
    });
    
    it('renders base size (24px) with correct dimensions', () => {
      render(<Icon name="test" size="base" data-testid="base-icon" />);
      
      const icon = screen.getByTestId('base-icon');
      expect(icon).toHaveClass('w-6', 'h-6');
    });
    
    it('renders lg size (32px) with correct dimensions', () => {
      render(<Icon name="test" size="lg" data-testid="lg-icon" />);
      
      const icon = screen.getByTestId('lg-icon');
      expect(icon).toHaveClass('w-8', 'h-8');
    });
    
    it('renders xl size (40px) with correct dimensions', () => {
      render(<Icon name="test" size="xl" data-testid="xl-icon" />);
      
      const icon = screen.getByTestId('xl-icon');
      expect(icon).toHaveClass('w-10', 'h-10');
    });
    
    it('defaults to base size when no size specified', () => {
      render(<Icon name="test" data-testid="default-size-icon" />);
      
      const icon = screen.getByTestId('default-size-icon');
      expect(icon).toHaveClass('w-6', 'h-6');
    });
  });

  // Test 44px touch targets for interactive icons (mobile-first)
  describe('Mobile Touch Target Requirements', () => {
    it('provides 44px touch target for interactive xs icon', () => {
      render(<Icon name="test" size="xs" onClick={() => {}} data-testid="touch-xs" />);
      
      const icon = screen.getByTestId('touch-xs');
      expect(icon).toHaveClass('min-w-[44px]', 'min-h-[44px]');
    });
    
    it('provides 44px touch target for interactive sm icon', () => {
      render(<Icon name="test" size="sm" onClick={() => {}} data-testid="touch-sm" />);
      
      const icon = screen.getByTestId('touch-sm');
      expect(icon).toHaveClass('min-w-[44px]', 'min-h-[44px]');
    });
    
    it('provides 44px touch target for interactive base icon', () => {
      render(<Icon name="test" size="base" onClick={() => {}} data-testid="touch-base" />);
      
      const icon = screen.getByTestId('touch-base');
      expect(icon).toHaveClass('min-w-[44px]', 'min-h-[44px]');
    });
    
    it('provides 44px touch target for interactive lg icon', () => {
      render(<Icon name="test" size="lg" onClick={() => {}} data-testid="touch-lg" />);
      
      const icon = screen.getByTestId('touch-lg');
      expect(icon).toHaveClass('min-w-[44px]', 'min-h-[44px]');
    });
    
    it('provides 44px touch target for interactive xl icon', () => {
      render(<Icon name="test" size="xl" onClick={() => {}} data-testid="touch-xl" />);
      
      const icon = screen.getByTestId('touch-xl');
      expect(icon).toHaveClass('min-w-[44px]', 'min-h-[44px]');
    });
    
    it('does not apply touch target to non-interactive icons', () => {
      render(<Icon name="test" size="xs" data-testid="non-touch" />);
      
      const icon = screen.getByTestId('non-touch');
      expect(icon).not.toHaveClass('min-w-[44px]', 'min-h-[44px]');
      expect(icon).toHaveClass('w-4', 'h-4');
    });
  });

  // Test brand color variants
  describe('Color Variations', () => {
    it('renders default color', () => {
      render(<Icon name="test" color="default" data-testid="default-color" />);
      
      const icon = screen.getByTestId('default-color');
      expect(icon).toHaveClass('text-gray-900');
    });
    
    it('renders muted color', () => {
      render(<Icon name="test" color="muted" data-testid="muted-color" />);
      
      const icon = screen.getByTestId('muted-color');
      expect(icon).toHaveClass('text-gray-500');
    });
    
    it('renders accent color (brand primary #0066CC)', () => {
      render(<Icon name="test" color="accent" data-testid="accent-color" />);
      
      const icon = screen.getByTestId('accent-color');
      expect(icon).toHaveClass('text-blue-600');
    });
    
    it('renders success color (#28A745)', () => {
      render(<Icon name="test" color="success" data-testid="success-color" />);
      
      const icon = screen.getByTestId('success-color');
      expect(icon).toHaveClass('text-green-600');
    });
    
    it('renders warning color', () => {
      render(<Icon name="test" color="warning" data-testid="warning-color" />);
      
      const icon = screen.getByTestId('warning-color');
      expect(icon).toHaveClass('text-yellow-500');
    });
    
    it('renders error color', () => {
      render(<Icon name="test" color="error" data-testid="error-color" />);
      
      const icon = screen.getByTestId('error-color');
      expect(icon).toHaveClass('text-red-600');
    });
    
    it('renders inverse color', () => {
      render(<Icon name="test" color="inverse" data-testid="inverse-color" />);
      
      const icon = screen.getByTestId('inverse-color');
      expect(icon).toHaveClass('text-white');
    });
    
    it('renders current color', () => {
      render(<Icon name="test" color="current" data-testid="current-color" />);
      
      const icon = screen.getByTestId('current-color');
      expect(icon).toHaveClass('text-current');
    });
    
    it('defaults to default color when no color specified', () => {
      render(<Icon name="test" data-testid="default-color-fallback" />);
      
      const icon = screen.getByTestId('default-color-fallback');
      expect(icon).toHaveClass('text-gray-900');
    });
  });

  // Test interactive behavior
  describe('Interactive Behavior', () => {
    it('calls onClick handler when clicked', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Icon name="test" onClick={handleClick} aria-label="Clickable icon" />);
      
      const icon = screen.getByRole('button', { name: /clickable icon/i });
      await user.click(icon);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
    
    it('supports keyboard navigation (Enter key)', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Icon name="test" onClick={handleClick} aria-label="Keyboard icon" />);
      
      const icon = screen.getByRole('button', { name: /keyboard icon/i });
      icon.focus();
      await user.keyboard('{Enter}');
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
    
    it('supports keyboard navigation (Space key)', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Icon name="test" onClick={handleClick} aria-label="Space icon" />);
      
      const icon = screen.getByRole('button', { name: /space icon/i });
      icon.focus();
      await user.keyboard(' ');
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
    
    it('does not call onClick when disabled', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Icon name="test" onClick={handleClick} disabled aria-label="Disabled icon" />);
      
      const icon = screen.getByLabelText(/disabled icon/i);
      await user.click(icon);
      
      expect(handleClick).not.toHaveBeenCalled();
    });
    
    it('applies interactive styles when clickable', () => {
      render(<Icon name="test" onClick={() => {}} data-testid="interactive-icon" />);
      
      const icon = screen.getByTestId('interactive-icon');
      expect(icon).toHaveClass('cursor-pointer', 'hover:opacity-75', 'focus:outline-none', 'focus:ring-2');
    });
    
    it('does not apply interactive styles when not clickable', () => {
      render(<Icon name="test" data-testid="static-icon" />);
      
      const icon = screen.getByTestId('static-icon');
      expect(icon).not.toHaveClass('cursor-pointer', 'hover:opacity-75');
    });
  });

  // Test disabled state
  describe('Disabled State', () => {
    it('applies disabled styles', () => {
      render(<Icon name="test" onClick={() => {}} disabled data-testid="disabled-icon" />);
      
      const icon = screen.getByTestId('disabled-icon');
      expect(icon).toHaveClass('opacity-50', 'cursor-not-allowed');
    });
    
    it('is not focusable when disabled', () => {
      render(<Icon name="test" onClick={() => {}} disabled aria-label="Disabled focus test" />);
      
      const icon = screen.getByLabelText(/disabled focus test/i);
      expect(icon).toHaveAttribute('tabIndex', '-1');
    });
    
    it('does not prevent keyboard events when disabled', async () => {
      const handleKeyDown = jest.fn();
      const user = userEvent.setup();
      
      render(<Icon name="test" onKeyDown={handleKeyDown} disabled aria-label="Disabled key test" />);
      
      const icon = screen.getByLabelText(/disabled key test/i);
      await user.type(icon, '{Enter}');
      
      expect(handleKeyDown).toHaveBeenCalled();
    });
  });

  // Test loading state
  describe('Loading State', () => {
    it('shows loading spinner when loading', () => {
      render(<Icon loading data-testid="loading-icon" />);
      
      const loadingIcon = screen.getByTestId('icon-loading');
      expect(loadingIcon).toBeInTheDocument();
      expect(loadingIcon).toHaveAttribute('aria-label', 'Loading icon');
    });
    
    it('shows loading spinner with custom aria-label', () => {
      render(<Icon loading aria-label="Loading content" />);
      
      const loadingIcon = screen.getByLabelText(/loading content/i);
      expect(loadingIcon).toBeInTheDocument();
    });
    
    it('applies loading animation styles', () => {
      render(<Icon loading data-testid="loading-icon" />);
      
      const loadingSpinner = screen.getByTestId('loading-icon').querySelector('.animate-spin');
      expect(loadingSpinner).toBeInTheDocument();
      expect(loadingSpinner).toHaveClass('animate-spin', 'border-2', 'border-current', 'border-t-transparent', 'rounded-full');
    });
    
    it('maintains interactive behavior when loading', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Icon loading onClick={handleClick} aria-label="Loading clickable" />);
      
      const icon = screen.getByRole('button', { name: /loading clickable/i });
      await user.click(icon);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  // Test SVG properties
  describe('SVG Properties', () => {
    it('applies custom viewBox to SVG icons', () => {
      render(<Icon name="test" viewBox="0 0 48 48" data-testid="custom-viewbox" />);
      
      const svg = screen.getByTestId('custom-viewbox').querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 48 48');
    });
    
    it('applies custom preserveAspectRatio to SVG icons', () => {
      render(<Icon name="test" preserveAspectRatio="none" data-testid="custom-aspect" />);
      
      const svg = screen.getByTestId('custom-aspect').querySelector('svg');
      expect(svg).toHaveAttribute('preserveAspectRatio', 'none');
    });
    
    it('uses default viewBox when not specified', () => {
      render(<Icon name="test" data-testid="default-viewbox" />);
      
      const svg = screen.getByTestId('default-viewbox').querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });
    
    it('uses default preserveAspectRatio when not specified', () => {
      render(<Icon name="test" data-testid="default-aspect" />);
      
      const svg = screen.getByTestId('default-aspect').querySelector('svg');
      expect(svg).toHaveAttribute('preserveAspectRatio', 'xMidYMid meet');
    });
  });

  // Test transformations
  describe('Transformations', () => {
    it('applies rotation transformation', () => {
      render(<Icon name="test" rotation={90} data-testid="rotated-icon" />);
      
      const icon = screen.getByTestId('rotated-icon');
      expect(icon).toHaveClass('transform', 'rotate-90');
    });
    
    it('applies horizontal flip transformation', () => {
      render(<Icon name="test" flipX data-testid="flipped-x-icon" />);
      
      const icon = screen.getByTestId('flipped-x-icon');
      expect(icon).toHaveClass('transform', 'scale-x-[-1]');
    });
    
    it('applies vertical flip transformation', () => {
      render(<Icon name="test" flipY data-testid="flipped-y-icon" />);
      
      const icon = screen.getByTestId('flipped-y-icon');
      expect(icon).toHaveClass('transform', 'scale-y-[-1]');
    });
    
    it('applies multiple transformations', () => {
      render(<Icon name="test" rotation={180} flipX flipY data-testid="multi-transform" />);
      
      const icon = screen.getByTestId('multi-transform');
      expect(icon).toHaveClass('transform', 'rotate-180', 'scale-x-[-1]', 'scale-y-[-1]');
    });
    
    it('does not apply transform class when no transformations', () => {
      render(<Icon name="test" data-testid="no-transform" />);
      
      const icon = screen.getByTestId('no-transform');
      expect(icon).not.toHaveClass('transform');
    });
  });

  // Test accessibility
  describe('Accessibility', () => {
    it('supports custom aria-label', () => {
      render(<Icon name="test" aria-label="Custom accessible label" />);
      
      const icon = screen.getByLabelText(/custom accessible label/i);
      expect(icon).toBeInTheDocument();
    });
    
    it('supports aria-labelledby', () => {
      render(
        <div>
          <h2 id="icon-title">Icon Title</h2>
          <Icon name="test" aria-labelledby="icon-title" data-testid="labelledby-icon" />
        </div>
      );
      
      const icon = screen.getByTestId('labelledby-icon');
      expect(icon).toHaveAttribute('aria-labelledby', 'icon-title');
    });
    
    it('supports aria-describedby', () => {
      render(
        <div>
          <p id="icon-description">Icon description</p>
          <Icon name="test" aria-describedby="icon-description" data-testid="describedby-icon" />
        </div>
      );
      
      const icon = screen.getByTestId('describedby-icon');
      expect(icon).toHaveAttribute('aria-describedby', 'icon-description');
    });
    
    it('generates default aria-label for named icons', () => {
      render(<Icon name="home" />);
      
      const icon = screen.getByLabelText(/home icon/i);
      expect(icon).toBeInTheDocument();
    });
    
    it('has proper focus styles for interactive icons', () => {
      render(<Icon name="test" onClick={() => {}} data-testid="focus-icon" />);
      
      const icon = screen.getByTestId('focus-icon');
      expect(icon).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500', 'focus:ring-offset-2');
    });
    
    it('sets role="button" for interactive icons', () => {
      render(<Icon name="test" onClick={() => {}} aria-label="Button icon" />);
      
      const icon = screen.getByRole('button', { name: /button icon/i });
      expect(icon).toBeInTheDocument();
    });
    
    it('sets appropriate tabIndex for interactive icons', () => {
      render(<Icon name="test" onClick={() => {}} data-testid="tab-icon" />);
      
      const icon = screen.getByTestId('tab-icon');
      expect(icon).toHaveAttribute('tabIndex', '0');
    });
    
    it('supports custom tabIndex', () => {
      render(<Icon name="test" onClick={() => {}} tabIndex={-1} data-testid="custom-tab-icon" />);
      
      const icon = screen.getByTestId('custom-tab-icon');
      expect(icon).toHaveAttribute('tabIndex', '-1');
    });
    
    it('sets aria-hidden on SVG when no explicit label', () => {
      render(<Icon name="test" data-testid="hidden-svg-icon" />);
      
      const svg = screen.getByTestId('hidden-svg-icon').querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
    
    it('does not set aria-hidden on SVG when explicit label provided', () => {
      render(<Icon name="test" aria-label="Visible icon" data-testid="visible-svg-icon" />);
      
      const svg = screen.getByTestId('visible-svg-icon').querySelector('svg');
      expect(svg).not.toHaveAttribute('aria-hidden', 'true');
    });
  });

  // Test performance and optimization
  describe('Performance and Optimization', () => {
    it('supports lazy loading for external images', () => {
      render(<Icon src="https://example.com/icon.svg" lazy alt="Lazy icon" />);
      
      const img = screen.getByRole('img', { name: /lazy icon/i });
      expect(img).toHaveAttribute('loading', 'lazy');
    });
    
    it('uses eager loading by default for external images', () => {
      render(<Icon src="https://example.com/icon.svg" alt="Eager icon" />);
      
      const img = screen.getByRole('img', { name: /eager icon/i });
      expect(img).toHaveAttribute('loading', 'eager');
    });
    
    it('handles broken image gracefully', async () => {
      render(<Icon src="https://example.com/broken.svg" alt="Broken icon" data-testid="broken-image" />);
      
      const img = screen.getByTestId('broken-image');
      
      // Simulate image error
      const errorEvent = new Event('error');
      Object.defineProperty(errorEvent, 'currentTarget', {
        value: { style: { display: 'none' } },
        writable: false
      });
      
      img.dispatchEvent(errorEvent);
      
      await waitFor(() => {
        expect(img.style.display).toBe('none');
      });
    });
    
    it('does not re-render unnecessarily with same props', () => {
      const { rerender } = render(<Icon name="test" />);
      const icon = screen.getByLabelText(/test icon/i);
      const initialElement = icon;
      
      // Re-render with same props
      rerender(<Icon name="test" />);
      const afterRerender = screen.getByLabelText(/test icon/i);
      
      expect(afterRerender).toBe(initialElement);
    });
  });

  // Test edge cases and error handling
  describe('Edge Cases', () => {
    it('handles missing icon source gracefully', () => {
      render(<Icon aria-label="Empty icon" data-testid="no-source" />);
      
      const icon = screen.getByTestId('no-source');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-label', 'Empty icon');
    });
    
    it('handles multiple icon sources (prioritizes SVG component)', () => {
      render(<Icon icon={MockSvgIcon} name="test" src="https://example.com/icon.svg" />);
      
      // Should render SVG component, not name or src
      expect(screen.getByTestId('mock-svg-icon')).toBeInTheDocument();
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
    
    it('handles multiple clicks rapidly', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Icon name="test" onClick={handleClick} aria-label="Rapid click" />);
      
      const icon = screen.getByRole('button', { name: /rapid click/i });
      
      // Simulate rapid clicks
      await user.click(icon);
      await user.click(icon);
      await user.click(icon);
      
      expect(handleClick).toHaveBeenCalledTimes(3);
    });
    
    it('maintains focus after click', async () => {
      const user = userEvent.setup();
      
      render(<Icon name="test" onClick={() => {}} aria-label="Focus test" />);
      
      const icon = screen.getByRole('button', { name: /focus test/i });
      await user.click(icon);
      
      expect(icon).toHaveFocus();
    });
    
    it('handles invalid rotation values gracefully', () => {
      // @ts-ignore - Testing runtime behavior with invalid value
      render(<Icon name="test" rotation={45} data-testid="invalid-rotation" />);
      
      const icon = screen.getByTestId('invalid-rotation');
      expect(icon).toHaveClass('transform', 'rotate-45');
    });
    
    it('handles empty alt text for images', () => {
      render(<Icon src="https://example.com/icon.svg" alt="" />);
      
      const img = screen.getByRole('img', { name: '' });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('alt', '');
    });
  });

  // Test property combinations
  describe('Property Combinations', () => {
    it('handles interactive + disabled combination', () => {
      render(<Icon name="test" onClick={() => {}} disabled data-testid="interactive-disabled" />);
      
      const icon = screen.getByTestId('interactive-disabled');
      expect(icon).toHaveClass('opacity-50', 'cursor-not-allowed');
      expect(icon).toHaveAttribute('tabIndex', '-1');
    });
    
    it('handles loading + interactive combination', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Icon loading onClick={handleClick} aria-label="Loading interactive" />);
      
      const icon = screen.getByRole('button', { name: /loading interactive/i });
      await user.click(icon);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
    
    it('handles all transformations together', () => {
      render(<Icon name="test" rotation={270} flipX flipY data-testid="all-transforms" />);
      
      const icon = screen.getByTestId('all-transforms');
      expect(icon).toHaveClass('transform', 'rotate-270', 'scale-x-[-1]', 'scale-y-[-1]');
    });
    
    it('handles custom className with built-in classes', () => {
      render(<Icon name="test" className="custom-class" data-testid="custom-class-icon" />);
      
      const icon = screen.getByTestId('custom-class-icon');
      expect(icon).toHaveClass('custom-class', 'inline-block', 'w-6', 'h-6', 'text-gray-900');
    });
    
    it('handles all size variants with interactive state', () => {
      const sizes: Array<'xs' | 'sm' | 'base' | 'lg' | 'xl'> = ['xs', 'sm', 'base', 'lg', 'xl'];
      
      sizes.forEach(size => {
        const { unmount } = render(
          <Icon name="test" size={size} onClick={() => {}} data-testid={`${size}-interactive`} />
        );
        
        const icon = screen.getByTestId(`${size}-interactive`);
        expect(icon).toHaveClass('min-w-[44px]', 'min-h-[44px]', 'cursor-pointer');
        
        unmount();
      });
    });
  });

  // Test brand guidelines compliance
  describe('Brand Guidelines Compliance', () => {
    it('uses correct primary brand color (#0066CC equivalent)', () => {
      render(<Icon name="test" color="accent" data-testid="brand-primary" />);
      
      const icon = screen.getByTestId('brand-primary');
      expect(icon).toHaveClass('text-blue-600');
    });
    
    it('uses correct success color (#28A745 equivalent)', () => {
      render(<Icon name="test" color="success" data-testid="brand-success" />);
      
      const icon = screen.getByTestId('brand-success');
      expect(icon).toHaveClass('text-green-600');
    });
    
    it('maintains brand consistency across different sizes', () => {
      const { rerender } = render(<Icon name="test" color="accent" size="xs" data-testid="brand-xs" />);
      expect(screen.getByTestId('brand-xs')).toHaveClass('text-blue-600');
      
      rerender(<Icon name="test" color="accent" size="xl" data-testid="brand-xl" />);
      expect(screen.getByTestId('brand-xl')).toHaveClass('text-blue-600');
    });
  });

  // Test performance behavior
  describe('Performance Behavior', () => {
    it('handles rapid prop changes efficiently', () => {
      const { rerender } = render(<Icon name="test" size="xs" color="default" />);
      
      rerender(<Icon name="test" size="lg" color="accent" />);
      const icon = screen.getByLabelText(/test icon/i);
      expect(icon).toHaveClass('w-8', 'h-8', 'text-blue-600');
      
      rerender(<Icon name="test" size="sm" color="error" />);
      expect(icon).toHaveClass('w-5', 'h-5', 'text-red-600');
    });
    
    it('handles loading state transitions smoothly', async () => {
      const { rerender } = render(<Icon name="test" loading={false} />);
      expect(screen.getByLabelText(/test icon/i)).toBeInTheDocument();
      
      rerender(<Icon name="test" loading={true} />);
      expect(screen.getByTestId('icon-loading')).toBeInTheDocument();
      
      rerender(<Icon name="test" loading={false} />);
      expect(screen.getByLabelText(/test icon/i)).toBeInTheDocument();
      expect(screen.queryByTestId('icon-loading')).not.toBeInTheDocument();
    });
  });
});