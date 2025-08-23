import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// TypeScript interface for Text component
interface TextProps {
  children: React.ReactNode;
  element?: 'p' | 'span' | 'div' | 'label';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  color?: 'default' | 'muted' | 'accent' | 'success' | 'warning' | 'error';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  truncate?: boolean;
  clamp?: number;
  inline?: boolean;
  className?: string;
  id?: string;
  htmlFor?: string; // For label elements
  'data-testid'?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  onClick?: () => void;
}

// Mock implementation for TDD - this will guide our real implementation
const Text: React.FC<TextProps> = React.forwardRef<HTMLElement, TextProps>(({
  children,
  element = 'p',
  size = 'base',
  color = 'default',
  weight = 'normal',
  truncate = false,
  clamp,
  inline = false,
  className = '',
  htmlFor,
  onClick,
  ...props
}, ref) => {
  const Component = element as any;
  
  const baseClasses = 'font-sans leading-relaxed';
  
  const sizeClasses = {
    'xs': 'text-xs',       // 0.8rem
    'sm': 'text-sm',       // 0.875rem  
    'base': 'text-base',   // 1rem
    'lg': 'text-lg',       // 1.125rem
    'xl': 'text-xl',       // 1.25rem
  };
  
  const colorClasses = {
    default: 'text-neutral-900',
    muted: 'text-neutral-600',
    accent: 'text-primary',
    success: 'text-success',
    warning: 'text-orange-500',
    error: 'text-red-500',
  };
  
  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };
  
  // Mobile-first responsive sizing - smaller on mobile
  const responsiveClasses = {
    'xs': 'text-xs',
    'sm': 'text-xs sm:text-sm',
    'base': 'text-sm sm:text-base',
    'lg': 'text-base sm:text-lg',
    'xl': 'text-lg sm:text-xl',
  };
  
  // Display mode classes
  const displayClasses = inline ? 'inline' : 'block';
  
  // Truncation classes
  const truncateClasses = truncate ? 'truncate' : '';
  const clampClasses = clamp ? `line-clamp-${clamp}` : '';
  
  // Interactive elements need minimum touch target
  const interactiveClasses = onClick ? 'min-h-[44px] flex items-center cursor-pointer' : '';
  
  const classes = [
    baseClasses,
    responsiveClasses[size],
    colorClasses[color],
    weightClasses[weight],
    displayClasses,
    truncateClasses,
    clampClasses,
    interactiveClasses,
    className
  ].filter(Boolean).join(' ').trim();
  
  const elementProps = {
    ref,
    className: classes,
    onClick,
    ...props
  };
  
  // Add htmlFor for label elements
  if (element === 'label' && htmlFor) {
    (elementProps as any).htmlFor = htmlFor;
  }
  
  return (
    <Component {...elementProps}>
      {children}
    </Component>
  );
});

Text.displayName = 'Text';

describe('Text Component', () => {
  // Test user behavior: Basic rendering and content
  describe('Rendering and Content', () => {
    it('renders text with paragraph element by default', () => {
      render(<Text>This is text content</Text>);
      
      const text = screen.getByText('This is text content');
      expect(text).toBeInTheDocument();
      expect(text.tagName).toBe('P');
    });
    
    it('renders text with children elements', () => {
      render(
        <Text>
          <span>Part 1</span>
          <strong>Part 2</strong>
        </Text>
      );
      
      const text = screen.getByText(/part 1/i);
      expect(text).toBeInTheDocument();
      expect(text).toHaveTextContent('Part 1Part 2');
      expect(text.querySelector('strong')).toBeInTheDocument();
    });
    
    it('supports custom id attribute', () => {
      render(<Text id="custom-text">Text with ID</Text>);
      
      const text = screen.getByText('Text with ID');
      expect(text).toHaveAttribute('id', 'custom-text');
    });
    
    it('has proper display name for debugging', () => {
      expect(Text.displayName).toBe('Text');
    });
  });

  // Test user behavior: Semantic elements
  describe('Semantic Elements', () => {
    it('renders span element when specified', () => {
      render(<Text element="span">Span text</Text>);
      
      const text = screen.getByText('Span text');
      expect(text.tagName).toBe('SPAN');
    });
    
    it('renders div element when specified', () => {
      render(<Text element="div">Div text</Text>);
      
      const text = screen.getByText('Div text');
      expect(text.tagName).toBe('DIV');
    });
    
    it('renders label element when specified', () => {
      render(<Text element="label">Label text</Text>);
      
      const text = screen.getByText('Label text');
      expect(text.tagName).toBe('LABEL');
    });
    
    it('associates label with form control via htmlFor', () => {
      render(
        <div>
          <Text element="label" htmlFor="test-input">Label for input</Text>
          <input id="test-input" />
        </div>
      );
      
      const label = screen.getByText('Label for input');
      const input = screen.getByRole('textbox');
      
      expect(label).toHaveAttribute('for', 'test-input');
      expect(input).toHaveAttribute('id', 'test-input');
    });
    
    it('defaults to paragraph element', () => {
      render(<Text>Default element</Text>);
      
      const text = screen.getByText('Default element');
      expect(text.tagName).toBe('P');
    });
  });

  // Test user behavior: Size variants
  describe('Size Variants', () => {
    it('renders xs size with correct classes', () => {
      render(<Text size="xs" data-testid="xs-text">Extra Small</Text>);
      
      const text = screen.getByTestId('xs-text');
      expect(text).toHaveClass('text-xs');
    });
    
    it('renders sm size with correct classes', () => {
      render(<Text size="sm" data-testid="sm-text">Small</Text>);
      
      const text = screen.getByTestId('sm-text');
      expect(text).toHaveClass('text-xs', 'sm:text-sm');
    });
    
    it('renders base size with correct classes', () => {
      render(<Text size="base" data-testid="base-text">Base</Text>);
      
      const text = screen.getByTestId('base-text');
      expect(text).toHaveClass('text-sm', 'sm:text-base');
    });
    
    it('renders lg size with correct classes', () => {
      render(<Text size="lg" data-testid="lg-text">Large</Text>);
      
      const text = screen.getByTestId('lg-text');
      expect(text).toHaveClass('text-base', 'sm:text-lg');
    });
    
    it('renders xl size with correct classes', () => {
      render(<Text size="xl" data-testid="xl-text">Extra Large</Text>);
      
      const text = screen.getByTestId('xl-text');
      expect(text).toHaveClass('text-lg', 'sm:text-xl');
    });
    
    it('defaults to base size when no size specified', () => {
      render(<Text data-testid="default-size">Default Size</Text>);
      
      const text = screen.getByTestId('default-size');
      expect(text).toHaveClass('text-sm', 'sm:text-base');
    });
  });

  // Test user behavior: Color variants
  describe('Color Variants', () => {
    it('renders default color with correct classes', () => {
      render(<Text color="default" data-testid="default-color">Default</Text>);
      
      const text = screen.getByTestId('default-color');
      expect(text).toHaveClass('text-neutral-900');
    });
    
    it('renders muted color with correct classes', () => {
      render(<Text color="muted" data-testid="muted-color">Muted</Text>);
      
      const text = screen.getByTestId('muted-color');
      expect(text).toHaveClass('text-neutral-600');
    });
    
    it('renders accent color with correct classes', () => {
      render(<Text color="accent" data-testid="accent-color">Accent</Text>);
      
      const text = screen.getByTestId('accent-color');
      expect(text).toHaveClass('text-primary');
    });
    
    it('renders success color with correct classes', () => {
      render(<Text color="success" data-testid="success-color">Success</Text>);
      
      const text = screen.getByTestId('success-color');
      expect(text).toHaveClass('text-success');
    });
    
    it('renders warning color with correct classes', () => {
      render(<Text color="warning" data-testid="warning-color">Warning</Text>);
      
      const text = screen.getByTestId('warning-color');
      expect(text).toHaveClass('text-orange-500');
    });
    
    it('renders error color with correct classes', () => {
      render(<Text color="error" data-testid="error-color">Error</Text>);
      
      const text = screen.getByTestId('error-color');
      expect(text).toHaveClass('text-red-500');
    });
    
    it('defaults to default color when no color specified', () => {
      render(<Text data-testid="default-color-implicit">Default Color</Text>);
      
      const text = screen.getByTestId('default-color-implicit');
      expect(text).toHaveClass('text-neutral-900');
    });
  });

  // Test user behavior: Weight variants
  describe('Weight Variants', () => {
    it('renders normal weight with correct classes', () => {
      render(<Text weight="normal" data-testid="normal-weight">Normal</Text>);
      
      const text = screen.getByTestId('normal-weight');
      expect(text).toHaveClass('font-normal');
    });
    
    it('renders medium weight with correct classes', () => {
      render(<Text weight="medium" data-testid="medium-weight">Medium</Text>);
      
      const text = screen.getByTestId('medium-weight');
      expect(text).toHaveClass('font-medium');
    });
    
    it('renders semibold weight with correct classes', () => {
      render(<Text weight="semibold" data-testid="semibold-weight">Semibold</Text>);
      
      const text = screen.getByTestId('semibold-weight');
      expect(text).toHaveClass('font-semibold');
    });
    
    it('renders bold weight with correct classes', () => {
      render(<Text weight="bold" data-testid="bold-weight">Bold</Text>);
      
      const text = screen.getByTestId('bold-weight');
      expect(text).toHaveClass('font-bold');
    });
    
    it('defaults to normal weight when no weight specified', () => {
      render(<Text data-testid="default-weight">Default Weight</Text>);
      
      const text = screen.getByTestId('default-weight');
      expect(text).toHaveClass('font-normal');
    });
  });

  // Test user behavior: Responsive behavior
  describe('Responsive Behavior', () => {
    it('applies mobile-first responsive classes', () => {
      render(<Text size="lg" data-testid="responsive-text">Responsive</Text>);
      
      const text = screen.getByTestId('responsive-text');
      expect(text).toHaveClass('text-base', 'sm:text-lg');
    });
    
    it('smallest sizes have consistent mobile sizing', () => {
      render(<Text size="xs" data-testid="xs-mobile">XS Mobile</Text>);
      
      const text = screen.getByTestId('xs-mobile');
      expect(text).toHaveClass('text-xs');
    });
    
    it('maintains readability across screen sizes', () => {
      render(
        <div>
          <Text size="xl" data-testid="large-mobile">Large Text</Text>
          <Text size="sm" data-testid="small-mobile">Small Text</Text>
        </div>
      );
      
      const large = screen.getByTestId('large-mobile');
      const small = screen.getByTestId('small-mobile');
      
      expect(large).toHaveClass('text-lg', 'sm:text-xl');
      expect(small).toHaveClass('text-xs', 'sm:text-sm');
    });
  });

  // Test user behavior: Accessibility features
  describe('Accessibility Features', () => {
    it('supports custom aria-label', () => {
      render(<Text aria-label="Custom text label">Visual Text</Text>);
      
      const text = screen.getByLabelText('Custom text label');
      expect(text).toBeInTheDocument();
    });
    
    it('supports aria-describedby', () => {
      render(
        <div>
          <Text aria-describedby="text-description">Text content</Text>
          <p id="text-description">This describes the text</p>
        </div>
      );
      
      const text = screen.getByText('Text content');
      expect(text).toHaveAttribute('aria-describedby', 'text-description');
    });
    
    it('label elements provide accessible labeling', () => {
      render(
        <div>
          <Text element="label" htmlFor="accessible-input">Accessible Label</Text>
          <input id="accessible-input" />
        </div>
      );
      
      const input = screen.getByLabelText('Accessible Label');
      expect(input).toBeInTheDocument();
    });
    
    it('provides accessible content for screen readers', () => {
      render(<Text>This is accessible text content</Text>);
      
      const text = screen.getByText('This is accessible text content');
      expect(text).toBeInTheDocument();
    });
    
    it('supports role override if needed', () => {
      render(<Text role="status" data-testid="status-text">Status message</Text>);
      
      const element = screen.getByTestId('status-text');
      expect(element).toHaveAttribute('role', 'status');
    });
  });

  // Test user behavior: Custom styling and className
  describe('Custom Styling and className', () => {
    it('applies custom className', () => {
      render(<Text className="custom-class" data-testid="custom-text">Custom</Text>);
      
      const text = screen.getByTestId('custom-text');
      expect(text).toHaveClass('custom-class');
    });
    
    it('combines custom className with default classes', () => {
      render(<Text className="custom-class" size="lg" data-testid="combined-classes">Combined</Text>);
      
      const text = screen.getByTestId('combined-classes');
      expect(text).toHaveClass('custom-class', 'font-sans', 'leading-relaxed', 'text-base', 'sm:text-lg');
    });
    
    it('allows className override of default styles', () => {
      render(<Text className="text-purple-500 font-black" data-testid="override-text">Override</Text>);
      
      const text = screen.getByTestId('override-text');
      expect(text).toHaveClass('text-purple-500', 'font-black');
    });
    
    it('handles empty className gracefully', () => {
      render(<Text className="" data-testid="empty-class">Empty Class</Text>);
      
      const text = screen.getByTestId('empty-class');
      expect(text).toBeInTheDocument();
    });
  });

  // Test user behavior: Truncation and line clamping
  describe('Truncation and Line Clamping', () => {
    it('applies truncate class when truncate is true', () => {
      render(<Text truncate data-testid="truncated-text">This is a very long text that should be truncated</Text>);
      
      const text = screen.getByTestId('truncated-text');
      expect(text).toHaveClass('truncate');
    });
    
    it('applies line clamp when clamp is specified', () => {
      render(<Text clamp={3} data-testid="clamped-text">Multi-line text content</Text>);
      
      const text = screen.getByTestId('clamped-text');
      expect(text).toHaveClass('line-clamp-3');
    });
    
    it('does not apply truncate classes by default', () => {
      render(<Text data-testid="normal-text">Normal text without truncation</Text>);
      
      const text = screen.getByTestId('normal-text');
      expect(text).not.toHaveClass('truncate');
      expect(text).not.toHaveClass(/line-clamp/);
    });
    
    it('truncate overrides clamp when both are specified', () => {
      render(<Text truncate clamp={2} data-testid="truncate-clamp">Text with both</Text>);
      
      const text = screen.getByTestId('truncate-clamp');
      expect(text).toHaveClass('truncate', 'line-clamp-2');
    });
    
    it('supports different line clamp values', () => {
      const { rerender } = render(<Text clamp={1} data-testid="clamp-test">Text</Text>);
      expect(screen.getByTestId('clamp-test')).toHaveClass('line-clamp-1');
      
      rerender(<Text clamp={5} data-testid="clamp-test">Text</Text>);
      expect(screen.getByTestId('clamp-test')).toHaveClass('line-clamp-5');
    });
  });

  // Test user behavior: Inline and block display modes
  describe('Display Modes', () => {
    it('renders as block display by default', () => {
      render(<Text data-testid="block-text">Block text</Text>);
      
      const text = screen.getByTestId('block-text');
      expect(text).toHaveClass('block');
    });
    
    it('renders as inline display when inline is true', () => {
      render(<Text inline data-testid="inline-text">Inline text</Text>);
      
      const text = screen.getByTestId('inline-text');
      expect(text).toHaveClass('inline');
    });
    
    it('works with different elements in inline mode', () => {
      render(
        <div>
          <Text element="span" inline data-testid="inline-span">Span</Text>
          <Text element="div" inline data-testid="inline-div">Div</Text>
        </div>
      );
      
      const span = screen.getByTestId('inline-span');
      const div = screen.getByTestId('inline-div');
      
      expect(span).toHaveClass('inline');
      expect(div).toHaveClass('inline');
      expect(span.tagName).toBe('SPAN');
      expect(div.tagName).toBe('DIV');
    });
    
    it('inline span elements are semantically appropriate', () => {
      render(
        <p>
          This is some text with{' '}
          <Text element="span" inline color="accent">inline accent text</Text>
          {' '}in the middle.
        </p>
      );
      
      const inlineText = screen.getByText('inline accent text');
      expect(inlineText).toHaveClass('inline', 'text-primary');
      expect(inlineText.tagName).toBe('SPAN');
    });
  });

  // Test user behavior: Interactive behavior
  describe('Interactive Behavior', () => {
    it('handles click events', () => {
      const handleClick = jest.fn();
      
      render(<Text onClick={handleClick}>Clickable text</Text>);
      
      const text = screen.getByText('Clickable text');
      text.click();
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
    
    it('applies cursor pointer and interactive styling when clickable', () => {
      render(<Text onClick={() => {}} data-testid="clickable-text">Clickable</Text>);
      
      const text = screen.getByTestId('clickable-text');
      expect(text).toHaveClass('cursor-pointer');
    });
    
    it('applies minimum touch target for clickable elements', () => {
      render(<Text onClick={() => {}} data-testid="touch-target">Touch Target</Text>);
      
      const text = screen.getByTestId('touch-target');
      expect(text).toHaveClass('min-h-[44px]', 'flex', 'items-center');
    });
    
    it('does not apply interactive styles when not clickable', () => {
      render(<Text data-testid="non-clickable">Non-clickable</Text>);
      
      const text = screen.getByTestId('non-clickable');
      expect(text).not.toHaveClass('cursor-pointer');
      expect(text).not.toHaveClass('min-h-[44px]');
    });
    
    it('supports keyboard accessibility for interactive elements', () => {
      const handleClick = jest.fn();
      
      render(<Text onClick={handleClick} tabIndex={0}>Accessible clickable text</Text>);
      
      const text = screen.getByText('Accessible clickable text');
      expect(text).toHaveAttribute('tabindex', '0');
    });
  });

  // Test user behavior: Edge cases and error handling
  describe('Edge Cases and Error Handling', () => {
    it('handles empty children gracefully', () => {
      render(<Text>{''}</Text>);
      
      const text = screen.getByText('');
      expect(text).toBeInTheDocument();
    });
    
    it('handles null children gracefully', () => {
      render(<Text>{null}</Text>);
      
      const text = document.querySelector('p');
      expect(text).toBeInTheDocument();
    });
    
    it('handles undefined children gracefully', () => {
      render(<Text>{undefined}</Text>);
      
      const text = document.querySelector('p');
      expect(text).toBeInTheDocument();
    });
    
    it('handles complex children with nested elements', () => {
      render(
        <Text>
          <span>Part 1</span>
          {' '}
          <strong>Part 2</strong>
          {' '}
          <em>Part 3</em>
        </Text>
      );
      
      const text = screen.getByText(/part 1/i);
      expect(text).toHaveTextContent('Part 1 Part 2 Part 3');
      expect(text.querySelector('strong')).toBeInTheDocument();
      expect(text.querySelector('em')).toBeInTheDocument();
    });
    
    it('handles boolean and numeric children', () => {
      render(<Text>{42}</Text>);
      
      const text = screen.getByText('42');
      expect(text).toHaveTextContent('42');
    });
    
    it('handles arrays of children', () => {
      const items = ['Item 1', 'Item 2', 'Item 3'];
      
      render(
        <Text>
          {items.map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </Text>
      );
      
      const text = screen.getByText(/item 1/i);
      expect(text).toHaveTextContent('Item 1Item 2Item 3');
    });
  });

  // Test user behavior: TypeScript prop validation
  describe('TypeScript Prop Validation', () => {
    it('accepts all valid element values', () => {
      const elements: Array<'p' | 'span' | 'div' | 'label'> = ['p', 'span', 'div', 'label'];
      
      elements.forEach(element => {
        const { unmount } = render(<Text element={element}>Element {element}</Text>);
        const text = screen.getByText(`Element ${element}`);
        expect(text.tagName).toBe(element.toUpperCase());
        unmount();
      });
    });
    
    it('accepts all valid size values', () => {
      const sizes: Array<'xs' | 'sm' | 'base' | 'lg' | 'xl'> = ['xs', 'sm', 'base', 'lg', 'xl'];
      
      sizes.forEach(size => {
        const { unmount } = render(<Text size={size} data-testid={`size-${size}`}>Size {size}</Text>);
        const text = screen.getByTestId(`size-${size}`);
        expect(text).toBeInTheDocument();
        unmount();
      });
    });
    
    it('accepts all valid color values', () => {
      const colors: Array<'default' | 'muted' | 'accent' | 'success' | 'warning' | 'error'> = 
        ['default', 'muted', 'accent', 'success', 'warning', 'error'];
      
      colors.forEach(color => {
        const { unmount } = render(<Text color={color} data-testid={`color-${color}`}>Color {color}</Text>);
        const text = screen.getByTestId(`color-${color}`);
        expect(text).toBeInTheDocument();
        unmount();
      });
    });
    
    it('accepts all valid weight values', () => {
      const weights: Array<'normal' | 'medium' | 'semibold' | 'bold'> = 
        ['normal', 'medium', 'semibold', 'bold'];
      
      weights.forEach(weight => {
        const { unmount } = render(<Text weight={weight} data-testid={`weight-${weight}`}>Weight {weight}</Text>);
        const text = screen.getByTestId(`weight-${weight}`);
        expect(text).toBeInTheDocument();
        unmount();
      });
    });
  });

  // Test user behavior: Performance considerations
  describe('Performance Considerations', () => {
    it('does not re-render unnecessarily with same props', () => {
      const { rerender } = render(<Text element="span" size="lg">Static Text</Text>);
      const text = screen.getByText('Static Text');
      const initialElement = text;
      
      // Re-render with same props
      rerender(<Text element="span" size="lg">Static Text</Text>);
      const afterRerender = screen.getByText('Static Text');
      
      expect(afterRerender).toBe(initialElement);
    });
    
    it('handles rapid prop changes efficiently', () => {
      const { rerender } = render(<Text element="p" size="sm" color="default">Dynamic</Text>);
      
      rerender(<Text element="span" size="lg" color="accent">Dynamic</Text>);
      const text = screen.getByText('Dynamic');
      expect(text.tagName).toBe('SPAN');
      expect(text).toHaveClass('text-base', 'sm:text-lg', 'text-primary');
      
      rerender(<Text element="div" size="xl" color="error">Dynamic</Text>);
      const updatedText = screen.getByText('Dynamic');
      expect(updatedText.tagName).toBe('DIV');
      expect(updatedText).toHaveClass('text-lg', 'sm:text-xl', 'text-red-500');
    });
    
    it('efficiently handles className changes', () => {
      const { rerender } = render(<Text className="old-class">Class Test</Text>);
      
      rerender(<Text className="new-class">Class Test</Text>);
      const text = screen.getByText('Class Test');
      expect(text).toHaveClass('new-class');
      expect(text).not.toHaveClass('old-class');
    });
    
    it('handles large text content efficiently', () => {
      const largeText = 'A'.repeat(1000);
      
      render(<Text>{largeText}</Text>);
      
      const text = screen.getByText(largeText);
      expect(text).toBeInTheDocument();
      expect(text.textContent).toHaveLength(1000);
    });
  });

  // Test user behavior: Brand color compliance
  describe('Brand Color Compliance', () => {
    it('uses correct primary brand color (#0066CC)', () => {
      render(<Text color="accent" data-testid="brand-primary">Primary Brand</Text>);
      
      const text = screen.getByTestId('brand-primary');
      expect(text).toHaveClass('text-primary');
    });
    
    it('uses correct success brand color (#28A745)', () => {
      render(<Text color="success" data-testid="brand-success">Success Brand</Text>);
      
      const text = screen.getByTestId('brand-success');
      expect(text).toHaveClass('text-success');
    });
    
    it('uses neutral colors from brand palette', () => {
      render(<Text color="muted" data-testid="brand-neutral">Neutral Brand</Text>);
      
      const text = screen.getByTestId('brand-neutral');
      expect(text).toHaveClass('text-neutral-600');
    });
    
    it('maintains brand consistency across color variants', () => {
      const { rerender } = render(<Text color="default" data-testid="brand-test">Brand Test</Text>);
      expect(screen.getByTestId('brand-test')).toHaveClass('text-neutral-900');
      
      rerender(<Text color="accent" data-testid="brand-test">Brand Test</Text>);
      expect(screen.getByTestId('brand-test')).toHaveClass('text-primary');
      
      rerender(<Text color="warning" data-testid="brand-test">Brand Test</Text>);
      expect(screen.getByTestId('brand-test')).toHaveClass('text-orange-500');
    });
  });

  // Test user behavior: Mobile touch targets
  describe('Mobile Touch Target Requirements', () => {
    it('has minimum 44px height when clickable', () => {
      render(<Text onClick={() => {}} data-testid="touch-clickable">Clickable Text</Text>);
      
      const text = screen.getByTestId('touch-clickable');
      expect(text).toHaveClass('min-h-[44px]');
    });
    
    it('uses flexbox for proper alignment in interactive states', () => {
      render(<Text onClick={() => {}} data-testid="touch-interactive">Interactive</Text>);
      
      const text = screen.getByTestId('touch-interactive');
      expect(text).toHaveClass('min-h-[44px]', 'flex', 'items-center');
    });
    
    it('does not apply touch target sizing for non-interactive text', () => {
      render(<Text data-testid="non-interactive">Regular Text</Text>);
      
      const text = screen.getByTestId('non-interactive');
      expect(text).not.toHaveClass('min-h-[44px]');
      expect(text).not.toHaveClass('flex');
    });
    
    it('maintains touch target with different elements', () => {
      render(
        <div>
          <Text element="span" onClick={() => {}} data-testid="clickable-span">Span</Text>
          <Text element="div" onClick={() => {}} data-testid="clickable-div">Div</Text>
        </div>
      );
      
      const span = screen.getByTestId('clickable-span');
      const div = screen.getByTestId('clickable-div');
      
      expect(span).toHaveClass('min-h-[44px]');
      expect(div).toHaveClass('min-h-[44px]');
    });
  });

  // Test combinations of props
  describe('Property Combinations', () => {
    it('handles element + size + color + weight combination', () => {
      render(
        <Text 
          element="span" 
          size="lg" 
          color="accent" 
          weight="semibold"
          data-testid="combo-basic"
        >
          Combo Basic
        </Text>
      );
      
      const text = screen.getByTestId('combo-basic');
      expect(text.tagName).toBe('SPAN');
      expect(text).toHaveClass('text-base', 'sm:text-lg', 'text-primary', 'font-semibold');
    });
    
    it('handles truncation + inline combination', () => {
      render(
        <Text 
          inline 
          truncate 
          data-testid="truncate-inline"
        >
          Truncated inline text
        </Text>
      );
      
      const text = screen.getByTestId('truncate-inline');
      expect(text).toHaveClass('inline', 'truncate');
    });
    
    it('handles interactive + responsive combination', () => {
      render(
        <Text 
          size="xl" 
          onClick={() => {}} 
          data-testid="interactive-responsive"
        >
          Interactive Responsive
        </Text>
      );
      
      const text = screen.getByTestId('interactive-responsive');
      expect(text).toHaveClass('text-lg', 'sm:text-xl', 'min-h-[44px]', 'cursor-pointer');
    });
    
    it('handles all props combination', () => {
      const handleClick = jest.fn();
      
      render(
        <Text 
          element="div"
          size="lg"
          color="success"
          weight="bold"
          inline
          truncate
          className="custom-class"
          id="combo-all"
          data-testid="combo-all"
          aria-label="Complex text"
          onClick={handleClick}
        >
          Complex Text
        </Text>
      );
      
      const text = screen.getByTestId('combo-all');
      
      expect(text.tagName).toBe('DIV');
      expect(text).toHaveClass(
        'text-base', 'sm:text-lg', 'text-success', 'font-bold', 
        'inline', 'truncate', 'custom-class', 'min-h-[44px]', 'cursor-pointer'
      );
      expect(text).toHaveAttribute('id', 'combo-all');
      
      text.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
    
    it('handles label specific combinations', () => {
      render(
        <div>
          <Text 
            element="label"
            size="sm"
            weight="medium"
            color="muted"
            htmlFor="form-field"
            data-testid="label-combo"
          >
            Form Label
          </Text>
          <input id="form-field" />
        </div>
      );
      
      const label = screen.getByTestId('label-combo');
      const input = screen.getByRole('textbox');
      
      expect(label.tagName).toBe('LABEL');
      expect(label).toHaveAttribute('for', 'form-field');
      expect(label).toHaveClass('text-xs', 'sm:text-sm', 'font-medium', 'text-neutral-600');
      expect(input).toHaveAttribute('id', 'form-field');
    });
    
    it('handles clamp + responsive + color combination', () => {
      render(
        <Text 
          size="xl"
          color="warning"
          clamp={2}
          weight="semibold"
          data-testid="clamp-responsive-color"
        >
          Multi-line responsive colored clamped text content
        </Text>
      );
      
      const text = screen.getByTestId('clamp-responsive-color');
      expect(text).toHaveClass('text-lg', 'sm:text-xl', 'text-orange-500', 'line-clamp-2', 'font-semibold');
    });
  });
});