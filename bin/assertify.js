#!/usr/bin/env node

import { run } from "../dist/runner.js";

const testPattern = process.argv[2];
process.exit(await run(testPattern));
