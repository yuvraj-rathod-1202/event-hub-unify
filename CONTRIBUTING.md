# Contributing to Event Hub Unify

Thank you for your interest in contributing to Event Hub Unify! We welcome contributions from everyone. This document outlines the process for contributing to this project.

## Table of Contents
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/event-hub-unify.git
   cd event-hub-unify
   ```
3. **Create a new branch** for your feature or bug fix:
   ```bash
   git checkout -b your-feature-name
   ```

## How to Contribute

### Types of Contributions

We welcome various types of contributions:
- **Bug fixes**: Help us identify and fix issues
- **New features**: Add functionality to improve the application
- **Documentation**: Improve existing docs or add new ones
- **UI/UX improvements**: Enhance the user experience
- **Performance optimizations**: Make the app faster and more efficient
- **Testing**: Add or improve test coverage

## Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Firebase:**
   - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database and Authentication
   - Create a `.env.local` file in the root directory (copy from `.env.example`):
     ```bash
     cp .env.example .env.local
     ```
   - Fill in your Firebase configuration values in `.env.local` with your actual Firebase project credentials
   - The Firebase configuration will be automatically loaded from environment variables

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173`

## Coding Standards

### General Guidelines
- Write clean, readable, and maintainable code
- Follow the existing code style and patterns
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### JavaScript/React Guidelines
- Use functional components with hooks
- Prefer arrow functions for component definitions
- Use destructuring for props and state
- Follow React best practices for state management
- Use proper error boundaries where appropriate

### CSS/Styling Guidelines
- Use Tailwind CSS classes for styling
- Follow the existing component structure
- Ensure responsive design for all screen sizes
- Use semantic HTML elements
- Maintain accessibility standards (ARIA labels, etc.)

### File Organization
- Place components in the appropriate folders under `src/components/`
- Keep related files together
- Use descriptive file and folder names
- Follow the existing directory structure

## Submitting Changes

### Before Submitting
1. **Test your changes thoroughly**
2. **Ensure code follows the coding standards**
3. **Update documentation** if necessary
4. **Add or update tests** for new functionality

### Pull Request Process
1. **Push your changes** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub with:
   - A clear title describing your changes
   - A detailed description of what you've changed and why
   - Screenshots (if applicable) showing UI changes
   - Reference to any related issues

3. **Respond to feedback** from reviewers promptly
4. **Make requested changes** if needed

### Pull Request Template
When creating a pull request, please include:

```markdown
## Description
Brief description of changes made

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement

## Testing
- [ ] I have tested this change locally
- [ ] I have added/updated tests as needed
- [ ] All existing tests pass

## Screenshots (if applicable)
Add screenshots to help explain your changes

## Checklist
- [ ] My code follows the project's coding standards
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation accordingly
```

## Reporting Issues

### Before Reporting an Issue
1. **Search existing issues** to avoid duplicates
2. **Check if the issue exists** in the latest version
3. **Gather relevant information** about your environment

### Issue Template
When reporting a bug, please include:

- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed steps to reproduce the problem
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Environment**: Browser, OS, device information
- **Screenshots**: If applicable, add screenshots
- **Additional Context**: Any other relevant information

## Feature Requests

We welcome feature requests! When suggesting a new feature:

1. **Check existing issues** to see if it's already been suggested
2. **Describe the problem** your feature would solve
3. **Explain your proposed solution** in detail
4. **Consider alternatives** and mention why your approach is best
5. **Provide mockups or examples** if applicable

## Development Tips

### Useful Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Firebase Development
- Use Firebase emulators for local development when possible
- Be mindful of Firebase usage limits
- Test authentication flows thoroughly
- Ensure proper security rules are in place
- Keep your `.env.local` file secure and never commit it to version control
- Use the provided `.env.example` as a template for required environment variables

### PWA Features
- Test offline functionality
- Verify service worker updates
- Check install prompt behavior
- Test push notifications


Thank you for contributing to Event Hub Unify! 🎉
