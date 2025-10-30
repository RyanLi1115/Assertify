import { describe, it, expect } from "assertify";

describe("Math operations", () => {
  it("should add two numbers correctly", () => {
    expect(2 + 2).toBe(4);
  });

  it("should multiply numbers", () => {
    expect(3 * 4).toBe(12);
  });

  describe("Division", () => {
    it("should divide numbers", () => {
      expect(10 / 2).toBe(5);
    });

    it("should handle floating point comparison", () => {
      expect(0.1 + 0.2).toBeCloseTo(0.3);
    });
  });
});

describe("Array operations", () => {
  it("should check array length", () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
  });

  it("should check array contents", () => {
    const arr = [1, 2, 3];
    expect(arr).toContain(2);
  });

  it("should check deep equality", () => {
    const obj1 = { a: 1, b: { c: 2 } };
    const obj2 = { a: 1, b: { c: 2 } };
    expect(obj1).toEqual(obj2);
  });
});

describe("Truthiness", () => {
  it("should check truthy values", () => {
    expect(1).toBeTruthy();
    expect("hello").toBeTruthy();
    expect([]).toBeTruthy();
  });

  it("should check falsy values", () => {
    expect(0).toBeFalsy();
    expect("").toBeFalsy();
    expect(null).toBeFalsy();
    expect(undefined).toBeFalsy();
  });

  it("should check for defined values", () => {
    const value = 42;
    expect(value).toBeDefined();
  });

  it("should check for null", () => {
    const value = null;
    expect(value).toBeNull();
  });
});
