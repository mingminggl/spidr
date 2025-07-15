import React, { useState, useRef, useCallback } from 'react';
import './App.css';

const SpidrForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    airFryerCost: '',
    spidrPin: ''
  });
  
  const [showPin, setShowPin] = useState(false);
  const [errors, setErrors] = useState({});
  
  const containerRef = useRef(null);
  const webElementsRef = useRef([]);
  const lastNetworkTime = useRef(0);
  const isCreatingNetwork = useRef(false);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10; // At least 10 digits
  };

  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const phone = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (phone.length <= 3) {
      return phone;
    } else if (phone.length <= 6) {
      return `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
    } else if (phone.length <= 10) {
      return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
    } else {
      return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    if (name === 'spidrPin') {
      // Format PIN with dashes in groups of four
      const digitsOnly = value.replace(/\D/g, '');
      const formatted = digitsOnly.replace(/(\d{4})(?=\d)/g, '$1-');
      if (formatted.length <= 19) { // Max length with dashes
        setFormData(prev => ({ ...prev, [name]: formatted }));
      }
    } else if (name === 'phoneNumber') {
      // Format phone number
      const formatted = formatPhoneNumber(value);
      if (formatted.length <= 14) { // Max length with formatting
        setFormData(prev => ({ ...prev, [name]: formatted }));
      }
    } else if (name === 'airFryerCost') {
      // Allow only numbers and decimal point
      const cleanValue = value.replace(/[^0-9.]/g, '');
      setFormData(prev => ({ ...prev, [name]: cleanValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validations
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number (at least 10 digits)';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.airFryerCost.trim()) {
      newErrors.airFryerCost = 'Air fryer cost guess is required';
    }
    if (!formData.spidrPin.trim()) {
      newErrors.spidrPin = 'Spidr PIN is required';
    } else if (formData.spidrPin.replace(/\D/g, '').length !== 16) {
      newErrors.spidrPin = 'Spidr PIN must be exactly 16 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form Data:', formData);
      alert('Form submitted successfully! Check the console for your data.');
    } else {
      alert('Please fix the errors in the form before submitting.');
    }
  };

  // Optimized network creation function
  const createNetworkPattern = useCallback((centerX, centerY) => {
    if (!containerRef.current) return;
    
    // Further reduced time throttling for more frequent creation
    const now = Date.now();
    if (now - lastNetworkTime.current < 200) return; // Reduced to 200ms
    
    console.log('Creating network at:', centerX, centerY); // Debug log
    isCreatingNetwork.current = true;
    lastNetworkTime.current = now;

    const networkContainer = document.createElement('div');
    networkContainer.className = 'spidr-interactive-web spidr-network-container';

    // Simplified network - fewer nodes for better performance
    const nodeCount = 3 + Math.floor(Math.random() * 2); // 3-4 nodes only
    const nodes = [];
    const radius = 40 + Math.random() * 30; // Smaller radius

    // Get container bounds once
    const containerRect = containerRef.current.getBoundingClientRect();

    // Generate node positions more efficiently
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const distance = radius * (0.7 + Math.random() * 0.3);
      const nodeX = centerX + Math.cos(angle) * distance;
      const nodeY = centerY + Math.sin(angle) * distance;
      
      // Simpler bounds checking
      const boundedX = Math.max(10, Math.min(nodeX, containerRect.width - 10));
      const boundedY = Math.max(10, Math.min(nodeY, containerRect.height - 10));
      
      nodes.push({ x: boundedX, y: boundedY });
    }

    // Add center node
    nodes.push({ x: centerX, y: centerY });

    // Create nodes with minimal DOM manipulation
    const fragment = document.createDocumentFragment();
    
    nodes.forEach((node, index) => {
      const nodeElement = document.createElement('div');
      nodeElement.className = 'spidr-network-node';
      nodeElement.style.cssText = `left: ${node.x - 2}px; top: ${node.y - 2}px; animation-delay: ${index * 0.08}s;`;
      fragment.appendChild(nodeElement);
    });

    // Simplified connection creation - only center to outer nodes
    const centerNode = nodes[nodes.length - 1];
    nodes.slice(0, -1).forEach((node, index) => {
      const dx = node.x - centerNode.x;
      const dy = node.y - centerNode.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      const line = document.createElement('div');
      line.className = 'spidr-connection-line';
      line.style.cssText = `left: ${centerNode.x}px; top: ${centerNode.y}px; width: ${length}px; transform: rotate(${angle}deg); animation-delay: ${index * 0.1 + 0.2}s;`;
      fragment.appendChild(line);
    });

    // Add one or two connecting lines between outer nodes for variety
    if (nodes.length > 3) {
      const node1 = nodes[0];
      const node2 = nodes[1];
      const dx = node2.x - node1.x;
      const dy = node2.y - node1.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      const line = document.createElement('div');
      line.className = 'spidr-connection-line';
      line.style.cssText = `left: ${node1.x}px; top: ${node1.y}px; width: ${length}px; transform: rotate(${angle}deg); animation-delay: 0.5s;`;
      fragment.appendChild(line);
    }

    networkContainer.appendChild(fragment);
    containerRef.current.appendChild(networkContainer);
    webElementsRef.current.push(networkContainer);

    // Optimize visibility and cleanup timing
    requestAnimationFrame(() => {
      networkContainer.classList.add('visible');
      isCreatingNetwork.current = false; // Reset the flag after making visible
    });

    // Faster cleanup to prevent accumulation
    setTimeout(() => {
      if (networkContainer.parentNode) {
        networkContainer.classList.remove('visible');
        setTimeout(() => {
          if (networkContainer.parentNode) {
            networkContainer.parentNode.removeChild(networkContainer);
          }
          webElementsRef.current = webElementsRef.current.filter(el => el !== networkContainer);
        }, 400);
      }
    }, 2000); // Reduced from 3000ms to 2000ms
  }, []);

  // Optimized mouse movement handler
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    
    // Much more responsive triggering - increased chance significantly
    if (Math.random() > 0.9) { // Increased to 10% chance
      const now = Date.now();
      // Further reduced time throttling for more responsiveness
      if (now - lastNetworkTime.current < 200) return; // Reduced to 200ms
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Simplified form avoidance check
      const formElement = containerRef.current.querySelector('.spidr-form-wrapper');
      if (formElement) {
        const formRect = formElement.getBoundingClientRect();
        const relativeFormLeft = formRect.left - rect.left;
        const relativeFormRight = formRect.right - rect.left;
        const relativeFormTop = formRect.top - rect.top;
        const relativeFormBottom = formRect.bottom - rect.top;
        
        // Only create network if mouse is outside the form area with buffer
        if (x < relativeFormLeft - 30 || x > relativeFormRight + 30 || 
            y < relativeFormTop - 30 || y > relativeFormBottom + 30) {
          createNetworkPattern(x, y);
        }
      } else {
        createNetworkPattern(x, y);
      }
    }
  }, [createNetworkPattern]);

  // Handle mouse leave to clean up
  const handleMouseLeave = useCallback(() => {
    // Clean up any remaining web elements
    webElementsRef.current.forEach(element => {
      if (element.parentNode) {
        element.classList.remove('visible');
        setTimeout(() => {
          if (element.parentNode) {
            element.parentNode.removeChild(element);
          }
        }, 300);
      }
    });
    webElementsRef.current = [];
  }, []);

  return (
    <div 
      className="spidr-container" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Spider web background pattern */}
      <div className="spidr-background">
        <svg viewBox="0 0 1200 800">
          <defs>
            <pattern id="spiderweb" patternUnits="userSpaceOnUse" width="200" height="200">
              <g stroke="#2596be" strokeWidth="0.5" fill="none" opacity="0.3">
                <line x1="100" y1="0" x2="100" y2="200" />
                <line x1="0" y1="100" x2="200" y2="100" />
                <line x1="0" y1="0" x2="200" y2="200" />
                <line x1="200" y1="0" x2="0" y2="200" />
                <circle cx="100" cy="100" r="80" />
                <circle cx="100" cy="100" r="50" />
                <circle cx="100" cy="100" r="20" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#spiderweb)" />
        </svg>
      </div>

      <div className="spidr-form-wrapper">
        {/* Header with light blue accent */}
        <div className="spidr-header">
          <h2>Contest Entry Form</h2>
          <p>Fill out the form below to enter our air fryer giveaway</p>
        </div>

        <div className="spidr-form">
          {/* First Name */}
          <div className="spidr-field">
            <label htmlFor="firstName" className="spidr-label">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`spidr-input ${errors.firstName ? 'spidr-input-error' : ''}`}
              required
            />
            {errors.firstName && <p className="spidr-error-text">{errors.firstName}</p>}
          </div>

          {/* Last Name */}
          <div className="spidr-field">
            <label htmlFor="lastName" className="spidr-label">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`spidr-input ${errors.lastName ? 'spidr-input-error' : ''}`}
              required
            />
            {errors.lastName && <p className="spidr-error-text">{errors.lastName}</p>}
          </div>

          {/* Phone Number */}
          <div className="spidr-field">
            <label htmlFor="phoneNumber" className="spidr-label">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="(123) 456-7890"
              className={`spidr-input ${errors.phoneNumber ? 'spidr-input-error' : ''}`}
              required
            />
            {errors.phoneNumber && <p className="spidr-error-text">{errors.phoneNumber}</p>}
          </div>

          {/* Email Address */}
          <div className="spidr-field">
            <label htmlFor="email" className="spidr-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="example@email.com"
              className={`spidr-input ${errors.email ? 'spidr-input-error' : ''}`}
              required
            />
            {errors.email && <p className="spidr-error-text">{errors.email}</p>}
          </div>

          {/* Air Fryer Cost Guess */}
          <div className="spidr-field">
            <label htmlFor="airFryerCost" className="spidr-label">
              Guess the Air Fryer's Cost
            </label>
            <div className="spidr-cost-wrapper">
              <span className="spidr-cost-symbol">$</span>
              <input
                type="text"
                id="airFryerCost"
                name="airFryerCost"
                value={formData.airFryerCost}
                onChange={handleInputChange}
                placeholder="0.00"
                className={`spidr-input spidr-cost-input ${errors.airFryerCost ? 'spidr-input-error' : ''}`}
                required
              />
            </div>
            {errors.airFryerCost && <p className="spidr-error-text">{errors.airFryerCost}</p>}
          </div>

          {/* Secret Spidr PIN */}
          <div className="spidr-field">
            <label htmlFor="spidrPin" className="spidr-label">
              Very, Very Secret 16-digit Spidr PIN
            </label>
            <div className="spidr-pin-wrapper">
              <input
                type={showPin ? "text" : "password"}
                id="spidrPin"
                name="spidrPin"
                value={formData.spidrPin}
                onChange={handleInputChange}
                placeholder={showPin ? "####-####-####-####" : "••••-••••-••••-••••"}
                className={`spidr-input spidr-pin-input font-mono ${errors.spidrPin ? 'spidr-input-error' : ''}`}
                required
                maxLength="19"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="spidr-pin-toggle"
                aria-label={showPin ? "Hide PIN" : "Show PIN"}
              >
                {showPin ? "�" : "👁️"}
              </button>
            </div>
            <p className="spidr-help-text">Enter your 16-digit PIN (formatted automatically)</p>
            {errors.spidrPin && <p className="spidr-error-text">{errors.spidrPin}</p>}
          </div>

          {/* Submit Button */}
          <div className="spidr-submit-wrapper">
            <button
              type="button"
              onClick={handleSubmit}
              className="spidr-button"
            >
              Submit Entry
            </button>
          </div>
        </div>

        <div className="spidr-footer">
          <p>
            By submitting this form, you agree to our terms and conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpidrForm;