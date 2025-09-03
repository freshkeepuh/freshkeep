# Typescript and ESLint Checklist

Best practices for Typescript and ESLint.

## Typescript

### TS-01: Name constructs appropriately.

Do variables/functions/modules conform to our naming standards? (Consistent casing, descriptive names, etc.)

### TS-03: Use the spread operator when appropriate.

Can you use the spread operator?

### TS-04: Use object deconstruction when appropriate.

Can you use object deconstruction?

### TS-05: Use arrow functions when appropriate.

Can you use arrow functions? Note that arrow functions are normally better, except in Mocha tests.

### TS-06: Avoid lodash or underscore map, filter, etc.

ES6 includes many of the lodash or underscore functions. Use the built-in function rather than the lodash or underscore version when possible.

### TS-07: Avoid console.logs

Get rid of console.log.

### TS-08: Use TSDoc comments appropriately.

When a comment starts with '/**', it will be processed by TSDoc. Please ensure those comments are appropriate for inclusion.

## ESLint

### ES-01: No errors, avoid warnings.

Are there ESLint errors or warnings that should be removed?

### ES-02: Consider modifying our standards.

Based upon your review of code, should we be modifying the set of ESLint rules?


