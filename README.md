# 🕷️ Spidr Contest Entry Form

A React-based contest entry form for an air fryer giveaway, featuring an interactive spider web-themed background with dynamic network effects.

## ✨ Features

### 🎨 Visual Design
- **Interactive Spider Web Background**: Dynamic network visualization that responds to mouse movement
- **Modern Glass-morphism UI**: Beautiful translucent form with backdrop blur effects
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Custom Animations**: Smooth transitions and hover effects throughout

### 📋 Form Functionality
- **Comprehensive Validation**: Real-time validation for all form fields
- **Smart Input Formatting**: Auto-formatting for phone numbers and PIN codes
- **PIN Security**: Masked PIN input with show/hide toggle functionality
- **Error Handling**: Clear, user-friendly error messages with visual feedback
- **Accessibility**: Full keyboard navigation and screen reader support

### 🔧 Technical Features
- **React Hooks**: Built with modern React functional components and hooks
- **Performance Optimized**: Throttled animations and efficient re-rendering
- **Custom CSS**: No external UI libraries - pure custom styling
- **Comprehensive Testing**: 19 test cases covering all functionality

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/spidr-contest-form.git
cd spidr-contest-form
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## 🧪 Testing

Run the comprehensive test suite:
```bash
npm test
```

The test suite includes:
- Form rendering and field validation
- Input formatting (phone numbers, PIN codes)
- Error message display and clearing
- PIN show/hide toggle functionality
- Successful form submission
- Error styling application

## 📱 Form Fields

### Required Fields
- **First Name**: Text input with validation
- **Last Name**: Text input with validation
- **Phone Number**: Auto-formatted to (XXX) XXX-XXXX format
- **Email Address**: Validated email format
- **Air Fryer Cost Guess**: Numeric input for contest entry
- **Spidr PIN**: 16-digit PIN with dashes (XXXX-XXXX-XXXX-XXXX format)

### Validation Rules
- All fields are required
- Email must be in valid format (contains @ and domain)
- Phone number must be at least 10 digits
- PIN must be exactly 16 digits
- Cost guess accepts only numbers and decimal points

## 🎯 Interactive Features

### Spider Web Network
- **Dynamic Visualization**: Creates animated connections between nodes
- **Mouse Interaction**: Network responds to cursor movement
- **Performance Optimized**: Throttled updates for smooth performance
- **Responsive**: Adapts to different screen sizes

### PIN Security
- **Masked Input**: PIN is hidden by default for security
- **Toggle Visibility**: Eye icon button to show/hide PIN
- **Formatted Display**: Automatically adds dashes for readability

## 🛠️ Built With

- **React 18**: Modern React with hooks and functional components
- **Create React App**: Zero-configuration React setup
- **Custom CSS**: Hand-crafted styles with CSS Grid and Flexbox
- **React Testing Library**: Comprehensive testing framework
- **Jest**: JavaScript testing framework

## 📁 Project Structure

```
src/
├── App.js              # Main application component
├── App.css             # Custom styling and animations
├── App.test.js         # Comprehensive test suite
├── index.js            # Application entry point
├── index.css           # Global styles
└── ...

public/
├── index.html          # HTML template with font imports
├── favicon.ico         # Application favicon
└── ...
```

## 🎨 Styling Approach

- **CSS Custom Properties**: Consistent color scheme and spacing
- **Responsive Design**: Mobile-first approach with media queries
- **Glass-morphism**: Modern translucent design with backdrop filters
- **Smooth Animations**: CSS transitions for enhanced user experience
- **Accessibility**: High contrast ratios and focus indicators

## 🔒 Security Considerations

- **PIN Masking**: Sensitive PIN data is masked by default
- **Client-side Validation**: Immediate feedback for better UX
- **No Data Storage**: Form data is only logged to console (demo purposes)

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized production build in the `build` folder, ready for deployment to any static hosting service.

### Deployment Options
- **Netlify**: Drag and drop the build folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Use `gh-pages` package
- **AWS S3**: Upload build folder to S3 bucket

## 🧩 Customization

### Changing Colors
Update the CSS custom properties in `App.css`:
```css
:root {
  --primary-purple: #8b5cf6;
  --secondary-purple: #a78bfa;
  --accent-pink: #ec4899;
  /* ... more variables */
}
```

### Modifying Spider Web
Adjust network parameters in `App.js`:
```javascript
const NETWORK_CONFIG = {
  nodeCount: 50,
  connectionDistance: 100,
  animationSpeed: 0.5
};
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Spider web inspiration from nature's perfect networks
- Modern web design trends and glass-morphism effects
- React community for excellent development tools and practices

## 📞 Contact

For questions or suggestions, please open an issue or contact the development team.

---

**Happy coding and may the best air fryer guess win! 🍟✨**
