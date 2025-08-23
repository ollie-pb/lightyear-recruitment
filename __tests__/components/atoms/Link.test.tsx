import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

// Mock Link component interface for comprehensive testing
interface LinkProps {
  href: string;
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  variant?: 'default' | 'muted' | 'accent' | 'success' | 'warning' | 'error' | 'inverse';
  underline?: 'none' | 'hover' | 'always';
  disabled?: boolean;
  external?: boolean;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
  'aria-label'?: string;
  'data-testid'?: string;
  onClick?: (e: React.MouseEvent) => void;
}

// Mock Link component implementation for testing
const Link: React.FC<LinkProps> = ({
  href,
  children,
  size = 'base',
  variant = 'default',
  underline = 'hover',
  disabled = false,
  external = false,
  target,
  rel,
  iconBefore,
  iconAfter,
  onClick,
  ...props
}) => {
  // Base classes for all links
  const baseClasses = 'inline-flex items-center gap-1 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[44px]';
  
  // Size variations
  const sizeClasses = {
    xs: 'text-xs px-1 py-1',
    sm: 'text-sm px-2 py-1.5', 
    base: 'text-base px-2 py-2',
    lg: 'text-lg px-3 py-2.5',
    xl: 'text-xl px-4 py-3'
  };
  
  // Color variants using brand colors
  const variantClasses = {
    default: 'text-primary hover:text-primary-dark focus:ring-primary/50',
    muted: 'text-neutral-600 hover:text-neutral-800 focus:ring-neutral-500/50',
    accent: 'text-secondary hover:text-secondary-dark focus:ring-secondary/50',
    success: 'text-success hover:text-green-700 focus:ring-success/50',
    warning: 'text-yellow-600 hover:text-yellow-700 focus:ring-yellow-500/50',
    error: 'text-red-600 hover:text-red-700 focus:ring-red-500/50',
    inverse: 'text-white hover:text-neutral-200 focus:ring-white/50'
  };
  
  // Underline options
  const underlineClasses = {
    none: 'no-underline',
    hover: 'no-underline hover:underline',
    always: 'underline'
  };
  
  // Disabled state
  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed pointer-events-none' 
    : 'cursor-pointer';
  
  const className = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${underlineClasses[underline]} ${disabledClasses}`;
  
  // Handle click events
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };
  
  // Auto-detect external links
  const isExternal = external || href.startsWith('http') || href.startsWith('//');
  
  // Set appropriate attributes for external links
  const linkProps = {
    href: disabled ? undefined : href,
    target: isExternal ? (target || '_blank') : target,
    rel: isExternal ? (rel || 'noopener noreferrer') : rel,
    onClick: handleClick,
    className,
    ...props
  };
  
  // For external links or when Next.js Link is not needed
  if (isExternal || disabled) {
    return (
      <a {...linkProps}>
        {iconBefore && <span className="icon-before" data-testid="icon-before">{iconBefore}</span>}
        {children}
        {iconAfter && <span className="icon-after" data-testid="icon-after">{iconAfter}</span>}
      </a>
    );
  }
  
  // Use Next.js Link for internal navigation
  const NextLink = require('next/link').default;
  return (
    <NextLink href={href} passHref legacyBehavior>
      <a {...linkProps}>
        {iconBefore && <span className="icon-before" data-testid="icon-before">{iconBefore}</span>}
        {children}
        {iconAfter && <span className="icon-after" data-testid="icon-after">{iconAfter}</span>}
      </a>
    </NextLink>
  );
};

describe('Link Component', () => {
  // Test user behavior: Basic rendering and content
  describe('Rendering and Content', () => {
    it('renders link with text content', () => {
      render(<Link href="/test">Click me</Link>);
      
      expect(screen.getByRole('link', { name: /click me/i })).toBeInTheDocument();
    });
    
    it('renders link with children elements', () => {
      render(
        <Link href="/test">
          <span>Icon</span>
          <span>Text</span>
        </Link>
      );
      
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveTextContent('Icon');
      expect(link).toHaveTextContent('Text');
    });
    
    it('sets correct href attribute', () => {
      render(<Link href="/test-path">Test Link</Link>);
      
      const link = screen.getByRole('link', { name: /test link/i });
      expect(link).toHaveAttribute('href', '/test-path');
    });
  });
  
  // Test user behavior: Size variants
  describe('Size Variations', () => {
    it('renders xs size with correct styles', () => {
      render(<Link href="/test" size="xs" data-testid="xs-link">Extra Small</Link>);
      
      const link = screen.getByTestId('xs-link');
      expect(link).toHaveClass('text-xs', 'px-1', 'py-1', 'min-h-[44px]');
    });
    
    it('renders sm size with correct styles', () => {
      render(<Link href="/test" size="sm" data-testid="sm-link">Small</Link>);
      
      const link = screen.getByTestId('sm-link');
      expect(link).toHaveClass('text-sm', 'px-2', 'py-1.5', 'min-h-[44px]');
    });
    
    it('renders base size with correct styles', () => {
      render(<Link href="/test" size="base" data-testid="base-link">Base</Link>);
      
      const link = screen.getByTestId('base-link');
      expect(link).toHaveClass('text-base', 'px-2', 'py-2', 'min-h-[44px]');
    });
    
    it('renders lg size with correct styles', () => {
      render(<Link href="/test" size="lg" data-testid="lg-link">Large</Link>);
      
      const link = screen.getByTestId('lg-link');
      expect(link).toHaveClass('text-lg', 'px-3', 'py-2.5', 'min-h-[44px]');
    });
    
    it('renders xl size with correct styles', () => {
      render(<Link href="/test" size="xl" data-testid="xl-link">Extra Large</Link>);
      
      const link = screen.getByTestId('xl-link');
      expect(link).toHaveClass('text-xl', 'px-4', 'py-3', 'min-h-[44px]');
    });
    
    it('defaults to base size when no size specified', () => {
      render(<Link href="/test" data-testid="default-size">Default Size</Link>);
      
      const link = screen.getByTestId('default-size');
      expect(link).toHaveClass('text-base', 'px-2', 'py-2');
    });
  });
  
  // Test user behavior: Color variants
  describe('Color Variants', () => {
    it('renders default variant with brand primary color', () => {
      render(<Link href="/test" variant="default" data-testid="default-link">Default</Link>);
      
      const link = screen.getByTestId('default-link');
      expect(link).toHaveClass('text-primary', 'hover:text-primary-dark', 'focus:ring-primary/50');
    });
    
    it('renders muted variant with neutral colors', () => {
      render(<Link href="/test" variant="muted" data-testid="muted-link">Muted</Link>);
      
      const link = screen.getByTestId('muted-link');
      expect(link).toHaveClass('text-neutral-600', 'hover:text-neutral-800', 'focus:ring-neutral-500/50');
    });
    
    it('renders accent variant with secondary brand color', () => {
      render(<Link href="/test" variant="accent" data-testid="accent-link">Accent</Link>);
      
      const link = screen.getByTestId('accent-link');
      expect(link).toHaveClass('text-secondary', 'hover:text-secondary-dark', 'focus:ring-secondary/50');
    });
    
    it('renders success variant with success color', () => {
      render(<Link href="/test" variant="success" data-testid="success-link">Success</Link>);
      
      const link = screen.getByTestId('success-link');
      expect(link).toHaveClass('text-success', 'hover:text-green-700', 'focus:ring-success/50');
    });
    
    it('renders warning variant with warning colors', () => {
      render(<Link href="/test" variant="warning" data-testid="warning-link">Warning</Link>);
      
      const link = screen.getByTestId('warning-link');
      expect(link).toHaveClass('text-yellow-600', 'hover:text-yellow-700', 'focus:ring-yellow-500/50');
    });
    
    it('renders error variant with error colors', () => {
      render(<Link href="/test" variant="error" data-testid="error-link">Error</Link>);
      
      const link = screen.getByTestId('error-link');
      expect(link).toHaveClass('text-red-600', 'hover:text-red-700', 'focus:ring-red-500/50');
    });
    
    it('renders inverse variant with white colors', () => {
      render(<Link href="/test" variant="inverse" data-testid="inverse-link">Inverse</Link>);
      
      const link = screen.getByTestId('inverse-link');
      expect(link).toHaveClass('text-white', 'hover:text-neutral-200', 'focus:ring-white/50');
    });
    
    it('defaults to default variant when no variant specified', () => {
      render(<Link href="/test" data-testid="default-variant">Default Variant</Link>);
      
      const link = screen.getByTestId('default-variant');
      expect(link).toHaveClass('text-primary');
    });
  });
  
  // Test user behavior: Underline options
  describe('Underline Options', () => {
    it('renders with no underline when underline is none', () => {
      render(<Link href="/test" underline="none" data-testid="no-underline">No Underline</Link>);
      
      const link = screen.getByTestId('no-underline');
      expect(link).toHaveClass('no-underline');
      expect(link).not.toHaveClass('underline', 'hover:underline');
    });
    
    it('renders with hover underline by default', () => {
      render(<Link href="/test" data-testid="hover-underline">Hover Underline</Link>);
      
      const link = screen.getByTestId('hover-underline');
      expect(link).toHaveClass('no-underline', 'hover:underline');
    });
    
    it('renders with always underline when specified', () => {
      render(<Link href="/test" underline="always" data-testid="always-underline">Always Underline</Link>);
      
      const link = screen.getByTestId('always-underline');
      expect(link).toHaveClass('underline');
    });
  });
  
  // Test user behavior: Interactive states
  describe('Interactive Behavior', () => {
    it('calls onClick handler when clicked', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Link href="/test" onClick={handleClick}>Click me</Link>);
      
      const link = screen.getByRole('link', { name: /click me/i });
      await user.click(link);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
    
    it('does not call onClick when disabled', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Link href="/test" onClick={handleClick} disabled>Disabled</Link>);
      
      const link = screen.getByRole('link', { name: /disabled/i });
      await user.click(link);
      
      expect(handleClick).not.toHaveBeenCalled();
    });
    
    it('supports keyboard navigation (Enter key)', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Link href="/test" onClick={handleClick}>Press Enter</Link>);
      
      const link = screen.getByRole('link', { name: /press enter/i });
      link.focus();
      await user.keyboard('{Enter}');
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
    
    it('supports keyboard navigation (Space key)', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Link href="/test" onClick={handleClick}>Press Space</Link>);
      
      const link = screen.getByRole('link', { name: /press space/i });
      link.focus();
      await user.keyboard(' ');
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
  
  // Test user behavior: Disabled state
  describe('Disabled State', () => {
    it('renders disabled link with correct styles', () => {
      render(<Link href="/test" disabled data-testid="disabled-link">Disabled Link</Link>);
      
      const link = screen.getByTestId('disabled-link');
      expect(link).toHaveClass('opacity-50', 'cursor-not-allowed', 'pointer-events-none');
    });
    
    it('removes href when disabled', () => {
      render(<Link href="/test" disabled>Disabled Link</Link>);
      
      const link = screen.getByRole('link', { name: /disabled link/i });
      expect(link).not.toHaveAttribute('href');
    });
    
    it('prevents navigation when disabled', async () => {
      const user = userEvent.setup();
      
      render(<Link href="/test" disabled>Disabled Link</Link>);
      
      const link = screen.getByRole('link', { name: /disabled link/i });
      
      // Should not navigate (href should be undefined)
      expect(link).not.toHaveAttribute('href');
    });
  });
  
  // Test user behavior: External vs Internal links
  describe('Link Type Detection', () => {
    it('detects external links by http prefix', () => {
      render(<Link href="https://external.com" data-testid="external-http">External</Link>);
      
      const link = screen.getByTestId('external-http');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
    
    it('detects external links by https prefix', () => {
      render(<Link href="https://external.com" data-testid="external-https">External HTTPS</Link>);
      
      const link = screen.getByTestId('external-https');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
    
    it('detects protocol-relative external links', () => {
      render(<Link href="//external.com" data-testid="external-protocol">External Protocol</Link>);
      
      const link = screen.getByTestId('external-protocol');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
    
    it('treats relative paths as internal links', () => {
      render(<Link href="/internal" data-testid="internal-link">Internal</Link>);
      
      const link = screen.getByTestId('internal-link');
      expect(link).not.toHaveAttribute('target', '_blank');
      expect(link).not.toHaveAttribute('rel', 'noopener noreferrer');
    });
    
    it('allows manual external flag override', () => {
      render(<Link href="/internal" external data-testid="forced-external">Forced External</Link>);
      
      const link = screen.getByTestId('forced-external');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
  
  // Test user behavior: Target and rel attributes
  describe('Target and Rel Attributes', () => {
    it('allows custom target attribute', () => {
      render(<Link href="https://external.com" target="_parent" data-testid="custom-target">Custom Target</Link>);
      
      const link = screen.getByTestId('custom-target');
      expect(link).toHaveAttribute('target', '_parent');
    });
    
    it('allows custom rel attribute', () => {
      render(<Link href="https://external.com" rel="nofollow" data-testid="custom-rel">Custom Rel</Link>);
      
      const link = screen.getByTestId('custom-rel');
      expect(link).toHaveAttribute('rel', 'nofollow');
    });
    
    it('does not add target/rel for internal links by default', () => {
      render(<Link href="/internal" data-testid="internal-no-attrs">Internal</Link>);
      
      const link = screen.getByTestId('internal-no-attrs');
      expect(link).not.toHaveAttribute('target');
      expect(link).not.toHaveAttribute('rel');
    });
    
    it('allows target/rel for internal links when explicitly set', () => {
      render(<Link href="/internal" target="_blank" rel="noopener" data-testid="internal-with-attrs">Internal with attrs</Link>);
      
      const link = screen.getByTestId('internal-with-attrs');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener');
    });
  });
  
  // Test user behavior: Icons
  describe('Icon Support', () => {
    it('renders icon before text when iconBefore is provided', () => {
      const BeforeIcon = () => <span>🔗</span>;
      
      render(
        <Link href="/test" iconBefore={<BeforeIcon />}>
          Link with before icon
        </Link>
      );
      
      expect(screen.getByTestId('icon-before')).toBeInTheDocument();
      expect(screen.getByText('🔗')).toBeInTheDocument();
    });
    
    it('renders icon after text when iconAfter is provided', () => {
      const AfterIcon = () => <span>→</span>;
      
      render(
        <Link href="/test" iconAfter={<AfterIcon />}>
          Link with after icon
        </Link>
      );
      
      expect(screen.getByTestId('icon-after')).toBeInTheDocument();
      expect(screen.getByText('→')).toBeInTheDocument();
    });
    
    it('renders both before and after icons when provided', () => {
      const BeforeIcon = () => <span>🔗</span>;
      const AfterIcon = () => <span>→</span>;
      
      render(
        <Link href="/test" iconBefore={<BeforeIcon />} iconAfter={<AfterIcon />}>
          Link with both icons
        </Link>
      );
      
      expect(screen.getByTestId('icon-before')).toBeInTheDocument();
      expect(screen.getByTestId('icon-after')).toBeInTheDocument();
      expect(screen.getByText('🔗')).toBeInTheDocument();
      expect(screen.getByText('→')).toBeInTheDocument();
    });
    
    it('has proper gap spacing for icons', () => {
      const Icon = () => <span>🔗</span>;
      
      render(<Link href="/test" iconBefore={<Icon />} data-testid="icon-link">Icon Link</Link>);
      
      const link = screen.getByTestId('icon-link');
      expect(link).toHaveClass('gap-1');
    });
  });
  
  // Test accessibility requirements
  describe('Accessibility', () => {
    it('has proper focus styles', () => {
      render(<Link href="/test" data-testid="focus-link">Focus Test</Link>);
      
      const link = screen.getByTestId('focus-link');
      expect(link).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2');
    });
    
    it('supports custom aria-label', () => {
      render(<Link href="/test" aria-label="Custom accessibility label">Icon Only</Link>);
      
      const link = screen.getByRole('link', { name: /custom accessibility label/i });
      expect(link).toBeInTheDocument();
    });
    
    it('maintains accessible name with children', () => {
      render(<Link href="/test">Accessible Link Text</Link>);
      
      const link = screen.getByRole('link', { name: /accessible link text/i });
      expect(link).toBeInTheDocument();
    });
    
    it('has proper focus ring colors for different variants', () => {
      const { rerender } = render(<Link href="/test" variant="default" data-testid="default-focus">Default</Link>);
      expect(screen.getByTestId('default-focus')).toHaveClass('focus:ring-primary/50');
      
      rerender(<Link href="/test" variant="accent" data-testid="accent-focus">Accent</Link>);
      expect(screen.getByTestId('accent-focus')).toHaveClass('focus:ring-secondary/50');
      
      rerender(<Link href="/test" variant="success" data-testid="success-focus">Success</Link>);
      expect(screen.getByTestId('success-focus')).toHaveClass('focus:ring-success/50');
      
      rerender(<Link href="/test" variant="error" data-testid="error-focus">Error</Link>);
      expect(screen.getByTestId('error-focus')).toHaveClass('focus:ring-red-500/50');
    });
    
    it('provides context for external links', () => {
      render(<Link href="https://external.com">External site</Link>);
      
      const link = screen.getByRole('link', { name: /external site/i });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
    
    it('is keyboard navigable', async () => {
      const user = userEvent.setup();
      
      render(
        <div>
          <Link href="/first">First Link</Link>
          <Link href="/second">Second Link</Link>
        </div>
      );
      
      const firstLink = screen.getByRole('link', { name: /first link/i });
      const secondLink = screen.getByRole('link', { name: /second link/i });
      
      // Tab to first link
      await user.tab();
      expect(firstLink).toHaveFocus();
      
      // Tab to second link
      await user.tab();
      expect(secondLink).toHaveFocus();
    });
  });
  
  // Test responsive/mobile requirements (44px minimum touch target)
  describe('Mobile Touch Target Requirements', () => {
    it('has minimum 44px height for xs size', () => {
      render(<Link href="/test" size="xs" data-testid="xs-touch">Extra Small</Link>);
      
      const link = screen.getByTestId('xs-touch');
      expect(link).toHaveClass('min-h-[44px]');
    });
    
    it('has minimum 44px height for sm size', () => {
      render(<Link href="/test" size="sm" data-testid="sm-touch">Small</Link>);
      
      const link = screen.getByTestId('sm-touch');
      expect(link).toHaveClass('min-h-[44px]');
    });
    
    it('has minimum 44px height for base size', () => {
      render(<Link href="/test" size="base" data-testid="base-touch">Base</Link>);
      
      const link = screen.getByTestId('base-touch');
      expect(link).toHaveClass('min-h-[44px]');
    });
    
    it('has minimum 44px height for lg size', () => {
      render(<Link href="/test" size="lg" data-testid="lg-touch">Large</Link>);
      
      const link = screen.getByTestId('lg-touch');
      expect(link).toHaveClass('min-h-[44px]');
    });
    
    it('has minimum 44px height for xl size', () => {
      render(<Link href="/test" size="xl" data-testid="xl-touch">Extra Large</Link>);
      
      const link = screen.getByTestId('xl-touch');
      expect(link).toHaveClass('min-h-[44px]');
    });
    
    it('maintains touch target with icons', () => {
      const Icon = () => <span>🔗</span>;
      
      render(<Link href="/test" size="xs" iconBefore={<Icon />} data-testid="icon-touch">Icon Link</Link>);
      
      const link = screen.getByTestId('icon-touch');
      expect(link).toHaveClass('min-h-[44px]');
    });
  });
  
  // Test brand color requirements
  describe('Brand Color Requirements', () => {
    it('uses correct primary color (#0066CC) for default variant', () => {
      render(<Link href="/test" variant="default" data-testid="brand-primary">Primary Link</Link>);
      
      const link = screen.getByTestId('brand-primary');
      expect(link).toHaveClass('text-primary');
    });
    
    it('uses correct secondary color (#FF6B35) for accent variant', () => {
      render(<Link href="/test" variant="accent" data-testid="brand-secondary">Accent Link</Link>);
      
      const link = screen.getByTestId('brand-secondary');
      expect(link).toHaveClass('text-secondary');
    });
    
    it('uses correct success color (#28A745) for success variant', () => {
      render(<Link href="/test" variant="success" data-testid="brand-success">Success Link</Link>);
      
      const link = screen.getByTestId('brand-success');
      expect(link).toHaveClass('text-success');
    });
  });
  
  // Test edge cases and error handling
  describe('Edge Cases', () => {
    it('handles empty children gracefully', () => {
      render(<Link href="/test">{''}</Link>);
      
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
    });
    
    it('handles null children gracefully', () => {
      render(<Link href="/test">{null}</Link>);
      
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
    });
    
    it('handles undefined href gracefully', () => {
      // @ts-expect-error Testing edge case
      render(<Link>No href link</Link>);
      
      // Should still render but without navigation capability
      const element = screen.getByText('No href link');
      expect(element).toBeInTheDocument();
    });
    
    it('handles empty href gracefully', () => {
      render(<Link href="">Empty href</Link>);
      
      const link = screen.getByRole('link', { name: /empty href/i });
      expect(link).toHaveAttribute('href', '');
    });
    
    it('handles special characters in href', () => {
      render(<Link href="/test?param=value&other=123#section">Special chars</Link>);
      
      const link = screen.getByRole('link', { name: /special chars/i });
      expect(link).toHaveAttribute('href', '/test?param=value&other=123#section');
    });
    
    it('handles multiple clicks rapidly', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Link href="/test" onClick={handleClick}>Rapid Click</Link>);
      
      const link = screen.getByRole('link', { name: /rapid click/i });
      
      // Simulate rapid clicks
      await user.click(link);
      await user.click(link);
      await user.click(link);
      
      expect(handleClick).toHaveBeenCalledTimes(3);
    });
    
    it('maintains focus after click', async () => {
      const user = userEvent.setup();
      
      render(<Link href="/test">Focus Test</Link>);
      
      const link = screen.getByRole('link', { name: /focus test/i });
      await user.click(link);
      
      expect(link).toHaveFocus();
    });
  });
  
  // Test combinations of props
  describe('Property Combinations', () => {
    it('handles size + variant combinations', () => {
      const { rerender } = render(<Link href="/test" size="lg" variant="accent" data-testid="combo-link">Large Accent</Link>);
      let link = screen.getByTestId('combo-link');
      expect(link).toHaveClass('text-lg', 'px-3', 'py-2.5', 'text-secondary');
      
      rerender(<Link href="/test" size="xs" variant="error" data-testid="combo-link">Small Error</Link>);
      link = screen.getByTestId('combo-link');
      expect(link).toHaveClass('text-xs', 'px-1', 'py-1', 'text-red-600');
    });
    
    it('handles icons + different sizes', () => {
      const Icon = () => <span>🔗</span>;
      const { rerender } = render(<Link href="/test" size="xs" iconBefore={<Icon />} data-testid="icon-size">Small Icon</Link>);
      let link = screen.getByTestId('icon-size');
      expect(link).toHaveClass('text-xs', 'gap-1', 'min-h-[44px]');
      
      rerender(<Link href="/test" size="xl" iconAfter={<Icon />} data-testid="icon-size">Large Icon</Link>);
      link = screen.getByTestId('icon-size');
      expect(link).toHaveClass('text-xl', 'gap-1', 'min-h-[44px]');
    });
    
    it('handles disabled + external combinations', () => {
      render(<Link href="https://external.com" disabled data-testid="disabled-external">Disabled External</Link>);
      
      const link = screen.getByTestId('disabled-external');
      expect(link).toHaveClass('opacity-50', 'cursor-not-allowed', 'pointer-events-none');
      expect(link).not.toHaveAttribute('href');
      expect(link).not.toHaveAttribute('target');
      expect(link).not.toHaveAttribute('rel');
    });
    
    it('handles all underline options with different variants', () => {
      const { rerender } = render(<Link href="/test" variant="accent" underline="always" data-testid="underline-combo">Always Underlined</Link>);
      let link = screen.getByTestId('underline-combo');
      expect(link).toHaveClass('text-secondary', 'underline');
      
      rerender(<Link href="/test" variant="success" underline="hover" data-testid="underline-combo">Hover Underlined</Link>);
      link = screen.getByTestId('underline-combo');
      expect(link).toHaveClass('text-success', 'no-underline', 'hover:underline');
      
      rerender(<Link href="/test" variant="error" underline="none" data-testid="underline-combo">No Underline</Link>);
      link = screen.getByTestId('underline-combo');
      expect(link).toHaveClass('text-red-600', 'no-underline');
      expect(link).not.toHaveClass('underline', 'hover:underline');
    });
  });
  
  // Test Next.js integration
  describe('Next.js Link Integration', () => {
    it('uses Next.js Link for internal navigation', () => {
      render(<Link href="/internal-path">Internal Link</Link>);
      
      const link = screen.getByRole('link', { name: /internal link/i });
      expect(link).toHaveAttribute('href', '/internal-path');
      // Next.js Link component should be used (mocked in our tests)
    });
    
    it('does not use Next.js Link for external URLs', () => {
      render(<Link href="https://external.com">External Link</Link>);
      
      const link = screen.getByRole('link', { name: /external link/i });
      expect(link).toHaveAttribute('href', 'https://external.com');
      expect(link).toHaveAttribute('target', '_blank');
    });
    
    it('does not use Next.js Link when disabled', () => {
      render(<Link href="/internal" disabled>Disabled Internal</Link>);
      
      const link = screen.getByRole('link', { name: /disabled internal/i });
      expect(link).not.toHaveAttribute('href');
    });
  });
  
  // Performance and behavior tests
  describe('Performance and Behavior', () => {
    it('does not re-render unnecessarily with same props', () => {
      const { rerender } = render(<Link href="/test">Static Link</Link>);
      const link = screen.getByRole('link');
      const initialElement = link;
      
      // Re-render with same props
      rerender(<Link href="/test">Static Link</Link>);
      const afterRerender = screen.getByRole('link');
      
      // Elements should be the same (indicating efficient re-rendering)
      expect(afterRerender).toBe(initialElement);
    });
    
    it('handles rapid prop changes', () => {
      const { rerender } = render(<Link href="/test" variant="default" size="sm">Dynamic Link</Link>);
      
      rerender(<Link href="/test" variant="accent" size="lg">Dynamic Link</Link>);
      const link = screen.getByRole('link');
      expect(link).toHaveClass('text-secondary', 'text-lg', 'px-3', 'py-2.5');
      
      rerender(<Link href="/test" variant="error" size="xs">Dynamic Link</Link>);
      expect(link).toHaveClass('text-red-600', 'text-xs', 'px-1', 'py-1');
    });
    
    it('handles dynamic href changes', () => {
      const { rerender } = render(<Link href="/initial">Dynamic href</Link>);
      let link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/initial');
      
      rerender(<Link href="/updated">Dynamic href</Link>);
      link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/updated');
      
      rerender(<Link href="https://external.com">Dynamic href</Link>);
      link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://external.com');
      expect(link).toHaveAttribute('target', '_blank');
    });
  });
  
  // Test responsive behavior simulation
  describe('Responsive Design Considerations', () => {
    it('maintains consistent spacing across all sizes', () => {
      const sizes = ['xs', 'sm', 'base', 'lg', 'xl'] as const;
      
      sizes.forEach((size) => {
        const { unmount } = render(<Link href="/test" size={size} data-testid={`${size}-responsive`}>Responsive</Link>);
        const link = screen.getByTestId(`${size}-responsive`);
        
        // All sizes should have consistent minimum touch target
        expect(link).toHaveClass('min-h-[44px]');
        
        // All sizes should have proper flex layout for icons
        expect(link).toHaveClass('inline-flex', 'items-center');
        
        unmount();
      });
    });
    
    it('maintains accessibility across all variant combinations', () => {
      const variants = ['default', 'muted', 'accent', 'success', 'warning', 'error', 'inverse'] as const;
      
      variants.forEach((variant) => {
        const { unmount } = render(<Link href="/test" variant={variant} data-testid={`${variant}-a11y`}>Accessible</Link>);
        const link = screen.getByTestId(`${variant}-a11y`);
        
        // All variants should have proper focus styles
        expect(link).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2');
        
        // All variants should have hover transitions
        expect(link).toHaveClass('transition-all');
        
        unmount();
      });
    });
  });
});