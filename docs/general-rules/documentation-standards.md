# Documentation Standards

## Code Documentation
- Document public APIs, interfaces, and complex functions
- Use JSDoc for generating documentation
- Include examples for non-obvious usage
- Example:
  ```javascript
  /**
   * Calculates the total price including tax and discounts
   * 
   * @param {number} basePrice - The base price of the item
   * @param {number} taxRate - The tax rate as a decimal (e.g., 0.07 for 7%)
   * @param {Object} options - Additional calculation options
   * @param {number} [options.discount=0] - Discount amount to apply
   * @param {boolean} [options.roundToNearest=false] - Whether to round to the nearest cent
   * @returns {number} The calculated total price
   * 
   * @example
   * const total = calculatePrice(19.99, 0.07, { discount: 2 });
   * // Returns 19.39 (19.99 + 1.40 tax - 2.00 discount)
   */
  function calculatePrice(basePrice, taxRate, options = {}) {
    // Implementation...
  }
  ```