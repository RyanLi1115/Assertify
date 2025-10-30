import { ExpectationError } from "./ExpectationError.js";
import { equals } from "./equals.js";

export function toBe(actual: any, expected: any): void {
  if (actual !== expected) {
    throw new ExpectationError("<actual> to be <expected>", {
      actual,
      expected,
    });
  }
}

export function toEqual(actual: any, expected: any): void {
  if (!equals(actual, expected)) {
    throw new ExpectationError("<actual> to equal <expected>", {
      actual,
      expected,
    });
  }
}

export function toBeTruthy(actual: any): void {
  if (!actual) {
    throw new ExpectationError("<actual> to be truthy", {
      actual,
    });
  }
}

export function toBeFalsy(actual: any): void {
  if (actual) {
    throw new ExpectationError("<actual> to be falsy", {
      actual,
    });
  }
}

export function toBeDefined(actual: any): void {
  if (actual === undefined) {
    throw new ExpectationError("<actual> to be defined", {
      actual,
    });
  }
}

export function toBeNull(actual: any): void {
  if (actual !== null) {
    throw new ExpectationError("<actual> to be null", {
      actual,
    });
  }
}

export function toThrow(fn: () => any, expectedError?: Error): void {
  try {
    fn();
    throw new ExpectationError(
      "<source> to throw an exception but it did not",
      { source: fn }
    );
  } catch (actual) {
    if (
      expectedError &&
      actual instanceof Error &&
      expectedError.message &&
      actual.message !== expectedError.message
    ) {
      throw new ExpectationError(
        "<source> to throw an exception with message <expected>, but got <actual>",
        {
          source: fn,
          actual: actual.message,
          expected: expectedError.message,
        }
      );
    }
  }
}

export function toHaveLength(actual: { length: number }, expected: number): void {
  if (actual.length !== expected) {
    throw new ExpectationError(
      "value to have length <expected> but it was <actual>",
      { actual: actual.length, expected }
    );
  }
}

export function toContain(actual: any[] | string, expected: any): void {
  if (!actual.includes(expected)) {
    throw new ExpectationError(
      "<actual> to contain <expected>",
      { actual, expected }
    );
  }
}

export function toBeCloseTo(actual: number, expected: number, precision: number = 2): void {
  const multiplier = Math.pow(10, precision);
  const actualRounded = Math.round(actual * multiplier) / multiplier;
  const expectedRounded = Math.round(expected * multiplier) / multiplier;
  if (actualRounded !== expectedRounded) {
    throw new ExpectationError(
      "<actual> to be close to <expected> (within <precision> decimal places)",
      { actual, expected, precision }
    );
  }
}
