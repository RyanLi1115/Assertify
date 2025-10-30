import { ExpectationError } from "./ExpectationError.js";
import * as matchers from "./matchers.js";

declare global {
  var currentTest: Test | null | undefined;
}

interface Test {
  errors: Error[];
}

export function expect(actual: any) {
  const handler = {
    get(_target: any, name: string) {
      const matcher = (matchers as any)[name];
      if (!matcher) {
        throw new Error(`Matcher "${name}" not found`);
      }
      return (...args: any[]) => {
        try {
          matcher(actual, ...args);
        } catch (e) {
          if (e instanceof ExpectationError) {
            const test = globalThis.currentTest;
            if (test) {
              test.errors.push(e);
            } else {
              throw e;
            }
          } else {
            throw e;
          }
        }
      };
    },
  };
  return new Proxy({}, handler);
}
