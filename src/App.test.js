import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('SpidrForm Component', () => {
  // Basic rendering test
  test('renders contest entry form', () => {
    render(<App />);
    expect(screen.getByText('Contest Entry Form')).toBeInTheDocument();
    expect(screen.getByText('Fill out the form below to enter our air fryer giveaway')).toBeInTheDocument();
  });

  // Form fields rendering tests
  test('renders all form fields', () => {
    render(<App />);
    
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/guess the air fryer's cost/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/very, very secret 16-digit spidr pin/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit entry/i })).toBeInTheDocument();
  });

  // Required field validation tests
  test('shows validation errors for empty required fields', async () => {
    render(<App />);
    
    const submitButton = screen.getByRole('button', { name: /submit entry/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument();
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
      expect(screen.getByText('Phone number is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Air fryer cost guess is required')).toBeInTheDocument();
      expect(screen.getByText('Spidr PIN is required')).toBeInTheDocument();
    });
  });

  // Email validation tests
  describe('Email Validation', () => {
    test('shows error for invalid email format', async () => {
      render(<App />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      userEvent.type(emailInput, 'invalid-email');
      
      const submitButton = screen.getByRole('button', { name: /submit entry/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });
    });

    test('accepts valid email format', async () => {
      render(<App />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      userEvent.type(emailInput, 'test@example.com');
      
      const submitButton = screen.getByRole('button', { name: /submit entry/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
      });
    });

    test('clears email error when user starts typing', async () => {
      render(<App />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', { name: /submit entry/i });
      
      // First trigger the error
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
      
      // Then start typing to clear the error
      userEvent.type(emailInput, 't');
      await waitFor(() => {
        expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
      });
    });
  });

  // Phone number validation tests
  describe('Phone Number Validation', () => {
    test('formats phone number correctly', async () => {
      render(<App />);
      
      const phoneInput = screen.getByLabelText(/phone number/i);
      userEvent.type(phoneInput, '1234567890');
      
      await waitFor(() => {
        expect(phoneInput.value).toBe('(123) 456-7890');
      });
    });

    test('shows error for short phone number', async () => {
      render(<App />);
      
      const phoneInput = screen.getByLabelText(/phone number/i);
      userEvent.type(phoneInput, '123456');
      
      const submitButton = screen.getByRole('button', { name: /submit entry/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid phone number (at least 10 digits)')).toBeInTheDocument();
      });
    });

    test('accepts valid phone number', async () => {
      render(<App />);
      
      const phoneInput = screen.getByLabelText(/phone number/i);
      userEvent.type(phoneInput, '1234567890');
      
      const submitButton = screen.getByRole('button', { name: /submit entry/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Please enter a valid phone number (at least 10 digits)')).not.toBeInTheDocument();
      });
    });

    test('limits phone number length', async () => {
      render(<App />);
      
      const phoneInput = screen.getByLabelText(/phone number/i);
      userEvent.type(phoneInput, '12345678901234567890');
      
      await waitFor(() => {
        expect(phoneInput.value).toBe('(123) 456-7890');
      });
    });
  });

  // Spidr PIN validation tests
  describe('Spidr PIN Validation', () => {
    test('formats PIN with dashes', async () => {
      render(<App />);
      
      const pinInput = screen.getByLabelText(/very, very secret 16-digit spidr pin/i);
      userEvent.type(pinInput, '1234567890123456');
      
      await waitFor(() => {
        expect(pinInput.value).toBe('1234-5678-9012-3456');
      });
    });

    test('shows error for incomplete PIN', async () => {
      render(<App />);
      
      const pinInput = screen.getByLabelText(/very, very secret 16-digit spidr pin/i);
      userEvent.type(pinInput, '123456789012');
      
      const submitButton = screen.getByRole('button', { name: /submit entry/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Spidr PIN must be exactly 16 digits')).toBeInTheDocument();
      });
    });

    test('accepts valid 16-digit PIN', async () => {
      render(<App />);
      
      const pinInput = screen.getByLabelText(/very, very secret 16-digit spidr pin/i);
      userEvent.type(pinInput, '1234567890123456');
      
      const submitButton = screen.getByRole('button', { name: /submit entry/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Spidr PIN must be exactly 16 digits')).not.toBeInTheDocument();
      });
    });

    test('limits PIN length to 19 characters (with dashes)', async () => {
      render(<App />);
      
      const pinInput = screen.getByLabelText(/very, very secret 16-digit spidr pin/i);
      userEvent.type(pinInput, '12345678901234567890123456789');
      
      await waitFor(() => {
        expect(pinInput.value).toBe('1234-5678-9012-3456');
      });
    });
  });

  // PIN show/hide functionality tests
  describe('PIN Show/Hide Toggle', () => {
    test('toggles PIN visibility', async () => {
      render(<App />);
      
      const pinInput = screen.getByLabelText(/very, very secret 16-digit spidr pin/i);
      const toggleButton = screen.getByRole('button', { name: /show pin/i });
      
      // Initially should be password type
      expect(pinInput.type).toBe('password');
      
      // Click to show
      fireEvent.click(toggleButton);
      await waitFor(() => {
        expect(pinInput.type).toBe('text');
        expect(screen.getByRole('button', { name: /hide pin/i })).toBeInTheDocument();
      });
      
      // Click to hide again
      fireEvent.click(toggleButton);
      await waitFor(() => {
        expect(pinInput.type).toBe('password');
        expect(screen.getByRole('button', { name: /show pin/i })).toBeInTheDocument();
      });
    });
  });

  // Air fryer cost validation tests
  describe('Air Fryer Cost Validation', () => {
    test('allows only numbers and decimal point', async () => {
      render(<App />);
      
      const costInput = screen.getByLabelText(/guess the air fryer's cost/i);
      userEvent.type(costInput, 'abc123.45def');
      
      await waitFor(() => {
        expect(costInput.value).toBe('123.45');
      });
    });

    test('shows error for empty cost field', async () => {
      render(<App />);
      
      const submitButton = screen.getByRole('button', { name: /submit entry/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Air fryer cost guess is required')).toBeInTheDocument();
      });
    });
  });

  // Successful form submission test
  test('submits form successfully with valid data', async () => {
    // Mock console.log and alert
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
    
    render(<App />);
    
    // Fill out all fields with valid data
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const phoneInput = screen.getByLabelText(/phone number/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const costInput = screen.getByLabelText(/guess the air fryer's cost/i);
    const pinInput = screen.getByLabelText(/very, very secret 16-digit spidr pin/i);
    
    userEvent.type(firstNameInput, 'John');
    userEvent.type(lastNameInput, 'Doe');
    userEvent.type(phoneInput, '1234567890');
    userEvent.type(emailInput, 'john.doe@example.com');
    userEvent.type(costInput, '199.99');
    userEvent.type(pinInput, '1234567890123456');
    
    const submitButton = screen.getByRole('button', { name: /submit entry/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Form Data:', {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '(123) 456-7890',
        email: 'john.doe@example.com',
        airFryerCost: '199.99',
        spidrPin: '1234-5678-9012-3456'
      });
      expect(alertSpy).toHaveBeenCalledWith('Form submitted successfully! Check the console for your data.');
    });
    
    // Clean up mocks
    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });

  // Error styling tests
  test('applies error styling to invalid fields', async () => {
    render(<App />);
    
    const submitButton = screen.getByRole('button', { name: /submit entry/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      const firstNameInput = screen.getByLabelText(/first name/i);
      expect(firstNameInput).toHaveClass('spidr-input-error');
    });
  });
});
