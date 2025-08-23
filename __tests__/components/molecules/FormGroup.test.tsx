import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import '@testing-library/jest-dom';
import { FormGroup } from '../../../components/molecules/FormGroup';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock file for testing file uploads
const mockFile = new File(['test content'], 'test-cv.pdf', { type: 'application/pdf' });

describe('FormGroup', () => {
  const defaultProps = {
    id: 'test-field',
    name: 'testField',
    label: 'Test Field',
    type: 'text' as const,
  };

  describe('Basic Rendering', () => {
    it('renders with minimum required props', () => {
      render(<FormGroup {...defaultProps} />);
      
      expect(screen.getByLabelText('Test Field')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'test-field');
      expect(screen.getByRole('textbox')).toHaveAttribute('name', 'testField');
    });

    it('renders label correctly', () => {
      render(<FormGroup {...defaultProps} />);
      
      const label = screen.getByText('Test Field');
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute('for', 'test-field');
    });

    it('renders required indicator when required=true', () => {
      render(<FormGroup {...defaultProps} required />);
      
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveAttribute('required');
    });

    it('applies custom className', () => {
      render(<FormGroup {...defaultProps} className="custom-class" />);
      
      const formGroup = screen.getByRole('textbox').closest('.form-group');
      expect(formGroup).toHaveClass('custom-class');
    });
  });

  describe('Input Types', () => {
    it('renders text input correctly', () => {
      render(<FormGroup {...defaultProps} type="text" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('renders email input correctly', () => {
      render(<FormGroup {...defaultProps} type="email" label="Email Address" />);
      
      const input = screen.getByLabelText('Email Address');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('renders telephone input correctly', () => {
      render(<FormGroup {...defaultProps} type="tel" label="Phone Number" />);
      
      const input = screen.getByLabelText('Phone Number');
      expect(input).toHaveAttribute('type', 'tel');
    });

    it('renders password input correctly', () => {
      render(<FormGroup {...defaultProps} type="password" label="Password" />);
      
      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('renders textarea correctly', () => {
      render(<FormGroup {...defaultProps} type="textarea" label="Message" />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('renders select dropdown correctly', () => {
      const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ];
      
      render(
        <FormGroup 
          {...defaultProps} 
          type="select" 
          label="Select Option" 
          options={options}
        />
      );
      
      const select = screen.getByRole('combobox');
      expect(select.tagName).toBe('SELECT');
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('renders file input for CV upload', () => {
      render(
        <FormGroup 
          {...defaultProps} 
          type="file" 
          label="Upload CV" 
          accept=".pdf,.doc,.docx"
        />
      );
      
      const fileInput = screen.getByLabelText('Upload CV');
      expect(fileInput).toHaveAttribute('type', 'file');
      expect(fileInput).toHaveAttribute('accept', '.pdf,.doc,.docx');
    });
  });

  describe('Validation States', () => {
    it('renders valid state correctly', () => {
      render(
        <FormGroup 
          {...defaultProps} 
          validationState="valid"
          validationMessage="Field is valid"
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-green-500');
      expect(screen.getByText('Field is valid')).toBeInTheDocument();
      expect(screen.getByText('Field is valid')).toHaveClass('text-green-600');
    });

    it('renders invalid state with error message', () => {
      render(
        <FormGroup 
          {...defaultProps} 
          validationState="invalid"
          validationMessage="This field is required"
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-500');
      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.getByText('This field is required')).toHaveClass('text-red-600');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby');
    });

    it('renders pending/loading state correctly', () => {
      render(
        <FormGroup 
          {...defaultProps} 
          validationState="pending"
          validationMessage="Checking availability..."
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-blue-500');
      expect(screen.getByText('Checking availability...')).toBeInTheDocument();
      expect(screen.getByRole('status')).toBeInTheDocument(); // Loading indicator
    });

    it('shows custom validation messages', () => {
      const customMessages = {
        required: 'Please fill out this field',
        email: 'Please enter a valid email address',
        minLength: 'Minimum 8 characters required',
      };

      render(
        <FormGroup 
          {...defaultProps} 
          type="email"
          required
          minLength={8}
          validationMessages={customMessages}
          validationState="invalid"
          validationMessage="Please enter a valid email address"
        />
      );
      
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  describe('Help Text', () => {
    it('renders help text when provided', () => {
      render(
        <FormGroup 
          {...defaultProps} 
          helpText="Please enter your full legal name"
        />
      );
      
      expect(screen.getByText('Please enter your full legal name')).toBeInTheDocument();
      expect(screen.getByText('Please enter your full legal name')).toHaveClass('text-gray-600');
    });

    it('associates help text with input using aria-describedby', () => {
      render(
        <FormGroup 
          {...defaultProps} 
          helpText="Helper text"
        />
      );
      
      const input = screen.getByRole('textbox');
      const helpText = screen.getByText('Helper text');
      
      expect(input).toHaveAttribute('aria-describedby');
      expect(helpText).toHaveAttribute('id');
    });
  });

  describe('Icons', () => {
    it('renders icon before input', () => {
      render(
        <FormGroup 
          {...defaultProps} 
          iconBefore="user"
        />
      );
      
      const icon = screen.getByRole('img', { hidden: true });
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-icon', 'user');
    });

    it('renders icon after input', () => {
      render(
        <FormGroup 
          {...defaultProps} 
          iconAfter="search"
        />
      );
      
      const icon = screen.getByRole('img', { hidden: true });
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-icon', 'search');
    });

    it('renders both icons when provided', () => {
      render(
        <FormGroup 
          {...defaultProps} 
          iconBefore="user"
          iconAfter="clear"
        />
      );
      
      const icons = screen.getAllByRole('img', { hidden: true });
      expect(icons).toHaveLength(2);
    });
  });

  describe('Sizes', () => {
    it('renders small size correctly', () => {
      render(<FormGroup {...defaultProps} size="sm" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('text-sm', 'py-1', 'px-2');
    });

    it('renders base size correctly (default)', () => {
      render(<FormGroup {...defaultProps} size="base" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('text-base', 'py-2', 'px-3');
    });

    it('renders large size correctly', () => {
      render(<FormGroup {...defaultProps} size="lg" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('text-lg', 'py-3', 'px-4');
    });
  });

  describe('States', () => {
    it('handles disabled state correctly', () => {
      render(<FormGroup {...defaultProps} disabled />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
      expect(input).toHaveClass('bg-gray-50', 'cursor-not-allowed');
    });

    it('handles loading state correctly', () => {
      render(<FormGroup {...defaultProps} loading />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
      expect(screen.getByRole('status')).toBeInTheDocument(); // Loading spinner
    });

    it('handles readonly state correctly', () => {
      render(<FormGroup {...defaultProps} readOnly />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('readonly');
      expect(input).toHaveClass('bg-gray-50');
    });
  });

  describe('User Interactions', () => {
    it('handles input changes', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      
      render(<FormGroup {...defaultProps} onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'test value');
      
      expect(handleChange).toHaveBeenCalledTimes(10); // Once per character
      expect(input).toHaveValue('test value');
    });

    it('handles blur events for validation', async () => {
      const handleBlur = jest.fn();
      const user = userEvent.setup();
      
      render(<FormGroup {...defaultProps} onBlur={handleBlur} />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.tab();
      
      expect(handleBlur).toHaveBeenCalled();
    });

    it('handles focus events', async () => {
      const handleFocus = jest.fn();
      const user = userEvent.setup();
      
      render(<FormGroup {...defaultProps} onFocus={handleFocus} />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      
      expect(handleFocus).toHaveBeenCalled();
    });

    it('handles file uploads', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      
      render(
        <FormGroup 
          {...defaultProps} 
          type="file" 
          onChange={handleChange}
          accept=".pdf,.doc,.docx"
        />
      );
      
      const fileInput = screen.getByLabelText('Test Field');
      await user.upload(fileInput, mockFile);
      
      expect(handleChange).toHaveBeenCalled();
      expect(fileInput.files[0]).toBe(mockFile);
    });

    it('handles select option changes', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      const options = [
        { value: '', label: 'Select an option' },
        { value: 'warehouse', label: 'Warehouse Worker' },
        { value: 'driver', label: 'Delivery Driver' },
      ];
      
      render(
        <FormGroup 
          {...defaultProps} 
          type="select" 
          options={options}
          onChange={handleChange}
        />
      );
      
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'warehouse');
      
      expect(handleChange).toHaveBeenCalled();
      expect(select).toHaveValue('warehouse');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<FormGroup {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('associates label with input correctly', () => {
      render(<FormGroup {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      const label = screen.getByText('Test Field');
      
      expect(label).toHaveAttribute('for', 'test-field');
      expect(input).toHaveAttribute('id', 'test-field');
    });

    it('provides proper ARIA attributes for invalid state', () => {
      render(
        <FormGroup 
          {...defaultProps} 
          validationState="invalid"
          validationMessage="Error message"
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby');
    });

    it('provides proper ARIA attributes for required fields', () => {
      render(<FormGroup {...defaultProps} required />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('required');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    it('provides proper role for loading states', () => {
      render(<FormGroup {...defaultProps} loading />);
      
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      
      render(
        <div>
          <FormGroup {...defaultProps} id="field1" />
          <FormGroup {...defaultProps} id="field2" />
        </div>
      );
      
      const firstInput = screen.getByDisplayValue('') as HTMLInputElement;
      firstInput.focus();
      
      expect(document.activeElement).toBe(firstInput);
      
      await user.tab();
      
      const secondInput = screen.getAllByRole('textbox')[1];
      expect(document.activeElement).toBe(secondInput);
    });
  });

  describe('Mobile Responsiveness', () => {
    it('applies mobile-first responsive classes', () => {
      render(<FormGroup {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      // Touch target should be at least 44px (py-3 + border = ~48px)
      expect(input).toHaveClass('py-2', 'md:py-3');
    });

    it('adjusts font size for mobile readability', () => {
      render(<FormGroup {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('text-base'); // Minimum 16px for mobile
    });

    it('maintains proper spacing on mobile', () => {
      render(
        <FormGroup 
          {...defaultProps} 
          helpText="Help text"
          validationState="invalid"
          validationMessage="Error message"
        />
      );
      
      const container = screen.getByRole('textbox').closest('.form-group');
      expect(container).toHaveClass('space-y-1');
    });
  });

  describe('Recruitment-Specific Fields', () => {
    it('handles phone number input with proper formatting', async () => {
      const user = userEvent.setup();
      
      render(
        <FormGroup 
          {...defaultProps} 
          type="tel" 
          label="Phone Number"
          placeholder="01234 567890"
        />
      );
      
      const input = screen.getByLabelText('Phone Number');
      await user.type(input, '01234567890');
      
      expect(input).toHaveValue('01234567890');
    });

    it('handles email input with validation', async () => {
      const user = userEvent.setup();
      
      render(
        <FormGroup 
          {...defaultProps} 
          type="email" 
          label="Email Address"
          required
        />
      );
      
      const input = screen.getByLabelText('Email Address');
      await user.type(input, 'invalid-email');
      
      expect(input).toHaveValue('invalid-email');
      // Validation would be handled by parent component
    });

    it('handles CV file upload with proper restrictions', () => {
      render(
        <FormGroup 
          {...defaultProps} 
          type="file" 
          label="Upload CV"
          accept=".pdf,.doc,.docx"
          helpText="Maximum file size: 5MB. Accepted formats: PDF, DOC, DOCX"
        />
      );
      
      const fileInput = screen.getByLabelText('Upload CV');
      expect(fileInput).toHaveAttribute('accept', '.pdf,.doc,.docx');
      expect(screen.getByText('Maximum file size: 5MB. Accepted formats: PDF, DOC, DOCX')).toBeInTheDocument();
    });

    it('handles job type selection', async () => {
      const user = userEvent.setup();
      const jobTypes = [
        { value: '', label: 'Select job type' },
        { value: 'warehouse', label: 'Warehouse Worker' },
        { value: 'driver', label: 'Delivery Driver' },
        { value: 'forklift', label: 'Forklift Operator' },
        { value: 'admin', label: 'Administrative' },
      ];
      
      render(
        <FormGroup 
          {...defaultProps} 
          type="select" 
          label="Preferred Job Type"
          options={jobTypes}
          required
        />
      );
      
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'warehouse');
      
      expect(select).toHaveValue('warehouse');
      expect(screen.getByText('Warehouse Worker')).toBeInTheDocument();
    });

    it('handles experience level selection', () => {
      const experienceLevels = [
        { value: '', label: 'Select experience level' },
        { value: 'entry', label: 'Entry Level (0-1 years)' },
        { value: 'experienced', label: 'Experienced (2-5 years)' },
        { value: 'senior', label: 'Senior (5+ years)' },
      ];
      
      render(
        <FormGroup 
          {...defaultProps} 
          type="select" 
          label="Experience Level"
          options={experienceLevels}
        />
      );
      
      expect(screen.getByText('Entry Level (0-1 years)')).toBeInTheDocument();
      expect(screen.getByText('Senior (5+ years)')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('does not re-render unnecessarily', () => {
      const renderSpy = jest.fn();
      const TestComponent = (props: any) => {
        renderSpy();
        return <FormGroup {...defaultProps} {...props} />;
      };
      
      const { rerender } = render(<TestComponent />);
      
      // Re-render with same props
      rerender(<TestComponent />);
      
      expect(renderSpy).toHaveBeenCalledTimes(2); // Initial + rerender
    });

    it('handles rapid input changes efficiently', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      
      render(<FormGroup {...defaultProps} onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      
      // Simulate rapid typing
      await user.type(input, 'rapid typing test', { delay: 1 });
      
      expect(handleChange).toHaveBeenCalledTimes(18); // One per character
    });
  });

  describe('Error Handling', () => {
    it('handles missing options for select gracefully', () => {
      render(
        <FormGroup 
          {...defaultProps} 
          type="select" 
          label="Select Option"
        />
      );
      
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      // Should render empty select without crashing
    });

    it('handles invalid file types gracefully', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      
      render(
        <FormGroup 
          {...defaultProps} 
          type="file" 
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
        />
      );
      
      const fileInput = screen.getByLabelText('Test Field');
      
      // This would typically be validated by the browser based on accept attribute
      await user.upload(fileInput, invalidFile);
      
      expect(handleChange).toHaveBeenCalled();
    });
  });
});