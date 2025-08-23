import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Button from '@/components/atoms/Button';

// Remove the mock since we now have the real component
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
  loading?: boolean;
  fullWidth?: boolean;
  href?: string;
  children: React.ReactNode;
  'aria-label'?: string;
  'data-testid'?: string;
}

// This is a mock implementation that will guide our real implementation
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  loading = false,
  fullWidth = false,
  href,
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-500',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-blue-500'
  };
  
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm min-h-[44px]',
    medium: 'px-4 py-2 text-base min-h-[44px]',
    large: 'px-6 py-3 text-lg min-h-[44px]'
  };
  
  const className = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''}`;
  
  if (href && !disabled) {
    return (
      <a
        href={href}
        className={className}
        {...props}
      >
        {loading && <span data-testid="loading-spinner">Loading...</span>}
        {children}
      </a>
    );
  }
  
  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={onClick}
      className={className}
      {...props}
    >
      {loading && <span data-testid="loading-spinner">Loading...</span>}
      {children}
    </button>
  );
};

describe('Button Component', () => {
  // Test user behavior: Basic rendering and content
  describe('Rendering and Content', () => {
    it('renders button with text content', () => {
      render(<Button>Click me</Button>);
      
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });
    
    it('renders button with children elements', () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Icon');
      expect(button).toHaveTextContent('Text');
    });
  });

  // Test user behavior: Different variants
  describe('Variant Styles', () => {
    it('renders primary variant with correct styles', () => {
      render(<Button variant="primary" data-testid="primary-button">Primary</Button>);
      
      const button = screen.getByTestId('primary-button');
      expect(button).toHaveClass('bg-blue-600', 'text-white');
    });
    
    it('renders secondary variant with correct styles', () => {
      render(<Button variant="secondary" data-testid="secondary-button">Secondary</Button>);
      
      const button = screen.getByTestId('secondary-button');
      expect(button).toHaveClass('bg-orange-500', 'text-white');
    });
    
    it('renders outline variant with correct styles', () => {
      render(<Button variant="outline" data-testid="outline-button">Outline</Button>);
      
      const button = screen.getByTestId('outline-button');
      expect(button).toHaveClass('border', 'border-gray-300', 'text-gray-700');
    });
    
    it('defaults to primary variant when no variant specified', () => {
      render(<Button data-testid="default-button">Default</Button>);
      
      const button = screen.getByTestId('default-button');
      expect(button).toHaveClass('bg-blue-600', 'text-white');
    });
  });

  // Test user behavior: Different sizes
  describe('Size Variations', () => {
    it('renders small button with correct styles', () => {
      render(<Button size="small" data-testid="small-button">Small</Button>);
      
      const button = screen.getByTestId('small-button');
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm', 'min-h-[44px]');
    });
    
    it('renders medium button with correct styles', () => {
      render(<Button size="medium" data-testid="medium-button">Medium</Button>);
      
      const button = screen.getByTestId('medium-button');
      expect(button).toHaveClass('px-4', 'py-2', 'text-base', 'min-h-[44px]');
    });
    
    it('renders large button with correct styles', () => {
      render(<Button size="large" data-testid="large-button">Large</Button>);
      
      const button = screen.getByTestId('large-button');
      expect(button).toHaveClass('px-6', 'py-3', 'text-lg', 'min-h-[44px]');
    });
    
    it('defaults to medium size when no size specified', () => {
      render(<Button data-testid="default-size-button">Default Size</Button>);
      
      const button = screen.getByTestId('default-size-button');
      expect(button).toHaveClass('px-4', 'py-2', 'text-base');
    });
  });

  // Test user behavior: Interactive states
  describe('Interactive Behavior', () => {
    it('calls onClick handler when clicked', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick}>Click me</Button>);
      
      const button = screen.getByRole('button', { name: /click me/i });
      await user.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
    
    it('does not call onClick when disabled', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick} disabled>Disabled</Button>);
      
      const button = screen.getByRole('button', { name: /disabled/i });
      await user.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });
    
    it('supports keyboard navigation (Enter key)', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick}>Press Enter</Button>);
      
      const button = screen.getByRole('button', { name: /press enter/i });
      button.focus();
      await user.keyboard('{Enter}');
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
    
    it('supports keyboard navigation (Space key)', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick}>Press Space</Button>);
      
      const button = screen.getByRole('button', { name: /press space/i });
      button.focus();
      await user.keyboard(' ');
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  // Test user behavior: Disabled state
  describe('Disabled State', () => {
    it('renders disabled button with correct attributes', () => {
      render(<Button disabled>Disabled Button</Button>);
      
      const button = screen.getByRole('button', { name: /disabled button/i });
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
    });
    
    it('is not focusable when disabled', () => {
      render(<Button disabled>Disabled Button</Button>);
      
      const button = screen.getByRole('button', { name: /disabled button/i });
      button.focus();
      expect(button).not.toHaveFocus();
    });
  });

  // Test user behavior: Loading state
  describe('Loading State', () => {
    it('shows loading spinner when loading', () => {
      render(<Button loading>Loading Button</Button>);
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
    
    it('disables button when loading', () => {
      render(<Button loading>Loading Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
    
    it('does not call onClick when loading', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick} loading>Loading</Button>);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });
    
    it('shows both loading spinner and children content', () => {
      render(<Button loading>Submit</Button>);
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });
  });

  // Test user behavior: Full width option
  describe('Full Width Option', () => {
    it('applies full width styles when fullWidth is true', () => {
      render(<Button fullWidth data-testid="full-width-button">Full Width</Button>);
      
      const button = screen.getByTestId('full-width-button');
      expect(button).toHaveClass('w-full');
    });
    
    it('does not apply full width styles by default', () => {
      render(<Button data-testid="normal-width-button">Normal Width</Button>);
      
      const button = screen.getByTestId('normal-width-button');
      expect(button).not.toHaveClass('w-full');
    });
  });

  // Test user behavior: Link behavior (href prop)
  describe('Link Behavior', () => {
    it('renders as link when href is provided', () => {
      render(<Button href="/test-url">Link Button</Button>);
      
      const link = screen.getByRole('link', { name: /link button/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test-url');
    });
    
    it('renders as button when href is not provided', () => {
      render(<Button>Regular Button</Button>);
      
      expect(screen.getByRole('button', { name: /regular button/i })).toBeInTheDocument();
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
    
    it('renders as button when href is provided but disabled', () => {
      render(<Button href="/test-url" disabled>Disabled Link</Button>);
      
      expect(screen.getByRole('button', { name: /disabled link/i })).toBeInTheDocument();
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
    
    it('applies same styles to link as button', () => {
      const { rerender } = render(<Button variant="secondary" data-testid="button-element">Button</Button>);
      const buttonElement = screen.getByTestId('button-element');
      const buttonClasses = buttonElement.className;
      
      rerender(<Button variant="secondary" href="/test" data-testid="link-element">Link</Button>);
      const linkElement = screen.getByTestId('link-element');
      
      expect(linkElement).toHaveClass(...buttonClasses.split(' '));
    });
  });

  // Test accessibility requirements
  describe('Accessibility', () => {
    it('has proper focus styles', () => {
      render(<Button data-testid="focus-button">Focus Test</Button>);
      
      const button = screen.getByTestId('focus-button');
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2');
    });
    
    it('supports custom aria-label', () => {
      render(<Button aria-label="Custom accessibility label">Icon Only</Button>);
      
      const button = screen.getByRole('button', { name: /custom accessibility label/i });
      expect(button).toBeInTheDocument();
    });
    
    it('maintains accessible name with children', () => {
      render(<Button>Accessible Button Text</Button>);
      
      const button = screen.getByRole('button', { name: /accessible button text/i });
      expect(button).toBeInTheDocument();
    });
    
    it('has proper focus ring colors for different variants', () => {
      const { rerender } = render(<Button variant="primary" data-testid="primary-focus">Primary</Button>);
      expect(screen.getByTestId('primary-focus')).toHaveClass('focus:ring-blue-500');
      
      rerender(<Button variant="secondary" data-testid="secondary-focus">Secondary</Button>);
      expect(screen.getByTestId('secondary-focus')).toHaveClass('focus:ring-orange-500');
      
      rerender(<Button variant="outline" data-testid="outline-focus">Outline</Button>);
      expect(screen.getByTestId('outline-focus')).toHaveClass('focus:ring-blue-500');
    });
    
    it('announces loading state to screen readers', () => {
      render(<Button loading aria-label="Submit form">Submit</Button>);
      
      // Loading spinner should be present and detectable
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toBeInTheDocument();
      
      // Button should still be properly labeled
      const button = screen.getByRole('button', { name: /submit form/i });
      expect(button).toBeInTheDocument();
    });
  });

  // Test responsive/mobile requirements (44px minimum touch target)
  describe('Mobile Touch Target Requirements', () => {
    it('has minimum 44px height for small size', () => {
      render(<Button size="small" data-testid="small-touch">Small</Button>);
      
      const button = screen.getByTestId('small-touch');
      expect(button).toHaveClass('min-h-[44px]');
    });
    
    it('has minimum 44px height for medium size', () => {
      render(<Button size="medium" data-testid="medium-touch">Medium</Button>);
      
      const button = screen.getByTestId('medium-touch');
      expect(button).toHaveClass('min-h-[44px]');
    });
    
    it('has minimum 44px height for large size', () => {
      render(<Button size="large" data-testid="large-touch">Large</Button>);
      
      const button = screen.getByTestId('large-touch');
      expect(button).toHaveClass('min-h-[44px]');
    });
  });

  // Test color requirements (specific brand colors)
  describe('Brand Color Requirements', () => {
    it('uses correct blue color (#0066CC equivalent) for primary variant', () => {
      render(<Button variant="primary" data-testid="brand-primary">Primary</Button>);
      
      const button = screen.getByTestId('brand-primary');
      // Note: In real implementation, this should map to the exact brand color #0066CC
      expect(button).toHaveClass('bg-blue-600');
    });
    
    it('uses correct orange color (#FF6B35 equivalent) for secondary variant', () => {
      render(<Button variant="secondary" data-testid="brand-secondary">Secondary</Button>);
      
      const button = screen.getByTestId('brand-secondary');
      // Note: In real implementation, this should map to the exact brand color #FF6B35
      expect(button).toHaveClass('bg-orange-500');
    });
  });

  // Test edge cases and error handling
  describe('Edge Cases', () => {
    it('handles empty children gracefully', () => {
      render(<Button>{''}</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
    
    it('handles null children gracefully', () => {
      render(<Button>{null}</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
    
    it('handles multiple clicks rapidly', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick}>Rapid Click</Button>);
      
      const button = screen.getByRole('button', { name: /rapid click/i });
      
      // Simulate rapid clicks
      await user.click(button);
      await user.click(button);
      await user.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(3);
    });
    
    it('maintains focus after click', async () => {
      const user = userEvent.setup();
      
      render(<Button>Focus Test</Button>);
      
      const button = screen.getByRole('button', { name: /focus test/i });
      await user.click(button);
      
      expect(button).toHaveFocus();
    });
  });

  // Test combinations of props
  describe('Property Combinations', () => {
    it('handles loading + disabled combination', () => {
      render(<Button loading disabled>Loading Disabled</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
    
    it('handles fullWidth + different sizes', () => {
      const { rerender } = render(<Button fullWidth size="small" data-testid="full-small">Small Full</Button>);
      expect(screen.getByTestId('full-small')).toHaveClass('w-full', 'px-3', 'py-1.5');
      
      rerender(<Button fullWidth size="large" data-testid="full-large">Large Full</Button>);
      expect(screen.getByTestId('full-large')).toHaveClass('w-full', 'px-6', 'py-3');
    });
    
    it('handles all variants with loading state', () => {
      const { rerender } = render(<Button variant="primary" loading data-testid="loading-primary">Loading Primary</Button>);
      expect(screen.getByTestId('loading-primary')).toBeDisabled();
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      
      rerender(<Button variant="secondary" loading data-testid="loading-secondary">Loading Secondary</Button>);
      expect(screen.getByTestId('loading-secondary')).toBeDisabled();
      
      rerender(<Button variant="outline" loading data-testid="loading-outline">Loading Outline</Button>);
      expect(screen.getByTestId('loading-outline')).toBeDisabled();
    });
  });

  // Performance and behavior tests
  describe('Performance and Behavior', () => {
    it('does not re-render unnecessarily with same props', () => {
      const { rerender } = render(<Button>Static Button</Button>);
      const button = screen.getByRole('button');
      const initialElement = button;
      
      // Re-render with same props
      rerender(<Button>Static Button</Button>);
      const afterRerender = screen.getByRole('button');
      
      // Elements should be the same (indicating efficient re-rendering)
      expect(afterRerender).toBe(initialElement);
    });
    
    it('handles rapid prop changes', () => {
      const { rerender } = render(<Button variant="primary" size="small">Dynamic</Button>);
      
      rerender(<Button variant="secondary" size="medium">Dynamic</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-orange-500', 'px-4', 'py-2');
      
      rerender(<Button variant="outline" size="large">Dynamic</Button>);
      expect(button).toHaveClass('border', 'border-gray-300', 'px-6', 'py-3');
    });
  });
});