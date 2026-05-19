# Style Guidelines

## Formatting
- Use consistent indentation (2 or 4 spaces, as per project standards)
- Limit line length to 80-120 characters
- Use proper spacing around operators and after commas
- Use consistent line breaks between blocks

## Code Style
- Follow a consistent brace style
- Use meaningful whitespace to improve readability
- Keep related code together
- Avoid deeply nested code (more than 3-4 levels)

## Linting and Formatting Tools
- Use ESLint for JavaScript/TypeScript code quality
- For backend components (which are inside *-server directory) respect eslint rules defined in file node_modules/uu_appg01_devkit/src/config/.eslintrc-nodejs.js

## Comments
- Write comments that explain "why", not "what"
- Keep comments up-to-date with code changes
- Use JSDoc for public APIs and complex functions
- Example of good commenting:
  ```javascript
  // BAD: This function adds two numbers
  function add(a, b) {
    return a + b;
  }

  // GOOD: Handles special addition logic for negative numbers
  function add(a, b) {
    return a + b;
  }
  ```

## Language-Specific Guidelines
- Follow language-specific idioms and best practices
- Use modern language features when appropriate
- Avoid deprecated APIs and patterns
- Examples:
    - JavaScript: Prefer const over let, use template literals
    - React: Use functional components with hooks
    - CSS: Use CSS variables for theming, prefer flexbox/grid

## CSS/SCSS Style
- Use consistent naming convention (BEM, SMACSS, etc.)
- Organize CSS properties in logical groups
- Use CSS variables for common values (colors, spacing)
- Prefer composable styles over deep specificity