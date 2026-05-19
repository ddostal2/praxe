# Naming Conventions

## Variables and Functions
- Use descriptive names that reveal intent
- Avoid abbreviations unless they're universally understood
- Functions should be verbs or verb phrases (e.g., `fetchUser`, `calculateTotal`)
- Variables should be nouns or noun phrases (e.g., `userProfile`, `orderItems`)
- Use camelCase for variables and functions in JavaScript/TypeScript

## Classes and Components
- Use PascalCase for classes and components
- Class names should be nouns (e.g., `UserRepository`, `ProductList`)
- Component names should describe what they render (e.g., `LoginForm`, `ProductCard`)

## Constants
- Use UPPER_SNAKE_CASE for constants
- Group related constants in objects or enums
- Examples: `MAX_RETRY_COUNT`, `DEFAULT_TIMEOUT`

## File Naming
- Use consistent casing (kebab-case)
- Match component names to their filenames
- Use specialized extensions for different file types (e.g., `.test.js`)
- Examples:
    - Tests: `user-profile.test.js`

## Avoid Magic Values
- Extract magic numbers and strings into named constants
- Use enums or constant objects for related values
- Example: `const MAX_USERS = 50;` instead of using `50` directly in code