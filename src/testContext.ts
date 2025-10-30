import { expect } from "./expect.js";

export interface Describe {
  name: string;
  befores: (() => void | Promise<void>)[];
  afters: (() => void | Promise<void>)[];
  children: (Describe | Test)[];
  skip?: boolean;
}

export interface Test {
  name: string;
  body: () => void | Promise<void>;
  errors: Error[];
  describeStack: Describe[];
  skip?: boolean;
}

let rootDescribe: Describe = {
  name: "root",
  befores: [],
  afters: [],
  children: [],
};

let currentDescribe: Describe = rootDescribe;

export function getRootDescribe(): Describe {
  return rootDescribe;
}

export function resetRootDescribe(): void {
  rootDescribe = {
    name: "root",
    befores: [],
    afters: [],
    children: [],
  };
  currentDescribe = rootDescribe;
}

export function describe(name: string, body: () => void): void {
  const parentDescribe = currentDescribe;
  currentDescribe = {
    name,
    befores: [],
    afters: [],
    children: [],
  };
  body();
  parentDescribe.children.push(currentDescribe);
  currentDescribe = parentDescribe;
}

export function it(name: string, body: () => void | Promise<void>): void {
  currentDescribe.children.push({
    name,
    body,
    errors: [],
    describeStack: [],
  });
}

export function beforeEach(fn: () => void | Promise<void>): void {
  currentDescribe.befores.push(fn);
}

export function afterEach(fn: () => void | Promise<void>): void {
  currentDescribe.afters.push(fn);
}

let describeStack: Describe[] = [];

async function invokeBefores(): Promise<void> {
  for (const describe of describeStack) {
    for (const before of describe.befores) {
      const result = before();
      if (result instanceof Promise) {
        await result;
      }
    }
  }
}

async function invokeAfters(): Promise<void> {
  for (const describe of describeStack) {
    for (const after of describe.afters) {
      const result = after();
      if (result instanceof Promise) {
        await result;
      }
    }
  }
}

async function runIt(test: Test): Promise<void> {
  if (test.skip || !test.body) return;
  test.describeStack = [...describeStack];
  globalThis.currentTest = test;
  try {
    await invokeBefores();
    const result = test.body();
    if (result instanceof Promise) {
      await result;
    }
    await invokeAfters();
  } catch (e) {
    test.errors.push(e as Error);
  } finally {
    globalThis.currentTest = null;
  }
}

async function runDescribe(describe: Describe): Promise<void> {
  if (describe.skip) return;
  console.log("  ".repeat(describeStack.length) + describe.name);
  describeStack.push(describe);
  for (const child of describe.children) {
    if ("body" in child) {
      await runIt(child);
    } else {
      await runDescribe(child);
    }
  }
  describeStack.pop();
}

export async function runTests(root: Describe): Promise<{
  successes: number;
  failures: Test[];
}> {
  const failures: Test[] = [];
  let successes = 0;

  async function collectResults(describe: Describe | Test): Promise<void> {
    if ("body" in describe) {
      if (describe.errors.length > 0) {
        failures.push(describe);
      } else if (!describe.skip) {
        successes++;
        console.log(
          "  ".repeat(describe.describeStack.length) +
          `✓ ${describe.name}`
        );
      }
    } else {
      if (!describe.skip) {
        for (const child of describe.children) {
          await collectResults(child);
        }
      }
    }
  }

  await runDescribe(root);
  await collectResults(root);

  return { successes, failures };
}
