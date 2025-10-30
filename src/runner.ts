import { glob } from "glob";
import { readFileSync } from "fs";
import { createContext, runInContext, Script } from "vm";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import * as testContext from "./testContext.js";
import * as expectModule from "./expect.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function discoverTestFiles(pattern: string = "**/*.test.js"): Promise<string[]> {
  const files = await glob(pattern, {
    ignore: ["**/node_modules/**", "**/dist/**"],
  });
  return files.map((f) => resolve(process.cwd(), f));
}

function createSandbox(api: any) {
  const sandbox = createContext({
    console,
    setTimeout,
    setInterval,
    clearTimeout,
    clearInterval,
    Buffer,
    process,
    global: {},
    __dirname: process.cwd(),
    __filename: "",
    require: (module: string) => {
      if (module === "assertify") {
        return api;
      }
      throw new Error(`Module ${module} not available in sandbox`);
    },
  });
  return sandbox;
}

async function executeTestFile(filePath: string): Promise<void> {
  const code = readFileSync(filePath, "utf-8");
  
  const api = {
    describe: testContext.describe,
    it: testContext.it,
    expect: expectModule.expect,
    beforeEach: testContext.beforeEach,
    afterEach: testContext.afterEach,
  };

  const transformedCode = code
    .replace(/import\s+([^"']+)\s+from\s+["']assertify["']/g, 'const $1 = require("assertify")')
    .replace(/import\s+\{([^}]+)\}\s+from\s+["']assertify["']/g, (match, imports) => {
      return `const {${imports}} = require("assertify")`;
    });

  const sandbox = createSandbox(api);
  (sandbox as any).__filename = filePath;
  (sandbox as any).__dirname = dirname(filePath);

  try {
    const script = new Script(transformedCode, {
      filename: filePath,
      displayErrors: true,
    });
    runInContext(script, sandbox);
  } catch (e) {
    console.error(`Error executing ${filePath}:`, e);
    throw e;
  }
}

export async function run(testPattern?: string): Promise<number> {
  const files = testPattern
    ? [resolve(process.cwd(), testPattern)]
    : await discoverTestFiles();

  if (files.length === 0) {
    console.error("No test files found");
    return 1;
  }

  testContext.resetRootDescribe();
  const rootDescribe = testContext.getRootDescribe();

  for (const file of files) {
    await executeTestFile(file);
  }

  const { successes, failures } = await testContext.runTests(rootDescribe);

  if (failures.length > 0) {
    console.error("\nFailures:\n");
    for (const failure of failures) {
      const fullName = [
        ...failure.describeStack.map((d) => d.name),
        failure.name,
      ].join(" → ");
      console.error(fullName);
      for (const error of failure.errors) {
        console.error(error.message);
        if (error.stack) {
          console.error(error.stack);
        }
      }
      console.error("");
    }
  }

  console.log(`\n${successes} tests passed, ${failures.length} tests failed.`);

  return failures.length > 0 ? 1 : 0;
}