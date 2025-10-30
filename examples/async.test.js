const { describe, it, expect, beforeEach, afterEach } = require("assertify");

describe("Async operations", () => {
  let counter = 0;

  beforeEach(async () => {
    counter = 0;
    await new Promise((resolve) => setTimeout(resolve, 10));
  });

  afterEach(() => {
    counter = 0;
  });

  it("should handle async test functions", async () => {
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  });

  it("should work with setTimeout", async () => {
    const promise = new Promise((resolve) => {
      setTimeout(() => resolve(100), 50);
    });
    const value = await promise;
    expect(value).toBe(100);
  });

  it("should test promise rejection", async () => {
    const failingPromise = Promise.reject(new Error("Test error"));
    try {
      await failingPromise;
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      expect(error.message).toBe("Test error");
    }
  });

  describe("with setup/teardown", () => {
    it("should use beforeEach", async () => {
      counter++;
      expect(counter).toBe(1);
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    it("should reset counter between tests", () => {
      expect(counter).toBe(0);
    });
  });
});

describe("Error handling", () => {
  it("should test that functions throw", () => {
    const throwError = () => {
      throw new Error("Expected error");
    };
    expect(() => throwError()).toThrow();
  });

  it("should test specific error messages", () => {
    const throwError = () => {
      throw new Error("Specific message");
    };
    expect(() => throwError()).toThrow(new Error("Specific message"));
  });
});
