# Assertify

A lightweight TypeScript test runner built from scratch to understand the core principles of Jest/Vitest.

## Overview

Assertify is a minimal test framework that demonstrates the fundamental concepts of test runners:
- **Test Discovery**: Automatically finds and runs `*.test.ts` files using glob patterns
- **Sandboxed Execution**: Uses Node.js `vm` module to isolate test execution contexts
- **Async Support**: Full support for `async/await` in test cases
- **Concise API**: Core implementation under 500 lines of code

## Features

### Core APIs

- `describe(name, fn)` - Group related tests
- `it(name, fn)` - Define a test case
- `expect(actual)` - Make assertions
- `beforeEach(fn)` - Setup before each test
- `afterEach(fn)` - Teardown after each test

### Assertion Matchers

1. `toBe(expected)` - Strict equality (`===`)
2. `toEqual(expected)` - Deep equality for objects and arrays
3. `toBeTruthy()` - Check if value is truthy
4. `toBeFalsy()` - Check if value is falsy
5. `toBeDefined()` - Check if value is not undefined
6. `toBeNull()` - Check if value is null
7. `toThrow(error?)` - Check if function throws
8. `toHaveLength(expected)` - Check array/string length
9. `toContain(expected)` - Check if array/string contains value
10. `toBeCloseTo(expected, precision?)` - Check floating point equality

## Installation

```bash
npm install
npm run build
```

## Usage

### Writing Tests

Create test files with the pattern `*.test.ts`:

```typescript
import { describe, it, expect } from "assertify";

describe("Math operations", () => {
  it("should add two numbers", () => {
    expect(2 + 2).toBe(4);
  });

  it("should handle async operations", async () => {
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  });
});
```

### Running Tests

Run all tests:
```bash
npm run test
# or
node bin/assertify.js
```

Run a specific test file:
```bash
node bin/assertify.js examples/math.test.js
```

**Note**: The test runner executes JavaScript files. If writing tests in TypeScript, compile them first:
```bash
tsc --outDir test --target ES2022 --module ES2022 test/**/*.test.ts
```

## Project Structure

```
assertify/
├── src/
│   ├── index.ts        # Main entry (exports describe, it, expect)
│   ├── runner.ts       # Test discovery and execution (uses glob and vm)
│   ├── testContext.ts  # Test context management
│   ├── expect.ts       # Expect implementation with Proxy
│   ├── matchers.ts     # Assertion matchers (toBe, toEqual, etc.)
│   ├── equals.ts       # Deep equality comparison
│   └── ExpectationError.ts  # Custom error class
├── bin/
│   └── assertify.js    # CLI entry point
├── examples/           # Example test files
│   ├── math.test.ts
│   └── async.test.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Core Implementation Details

### Test Discovery

Uses the `glob` package to find all `*.test.ts` files recursively, ignoring `node_modules` and `dist` directories.

### Sandboxed Execution

Leverages Node.js `vm` module to create isolated execution contexts for each test file, preventing test contamination:

```typescript
const sandbox = createContext({
  console,
  setTimeout,
  // ... other globals
  require: (module) => {
    if (module === "assertify") return api;
    // ...
  }
});
```

### Async Support

Test functions can return Promises, which are automatically awaited:

```typescript
it("async test", async () => {
  const result = await someAsyncOperation();
  expect(result).toBe(expected);
});
```

## Metrics

- **5 Core APIs**: `describe`, `it`, `expect`, `beforeEach`, `afterEach`
- **10+ Matchers**: `toBe`, `toEqual`, `toBeTruthy`, `toBeFalsy`, `toBeDefined`, `toBeNull`, `toThrow`, `toHaveLength`, `toContain`, `toBeCloseTo`
- **Core Implementation**: ~400 lines of code
- **Key Technologies**: Node.js `vm` module, `glob` for file discovery, TypeScript

## Example Test Files

See the `examples/` directory for complete examples:

- `math.test.ts` - Basic math operations and assertions
- `async.test.ts` - Async/await tests with setup/teardown

## Development

Build TypeScript:
```bash
npm run build
```

Run tests:
```bash
npm run test
```

## License

MIT
