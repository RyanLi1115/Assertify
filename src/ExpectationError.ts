export class ExpectationError extends Error {
  constructor(
    message: string,
    public context?: { actual?: any; expected?: any; source?: any }
  ) {
    super(formatMessage(message, context));
    this.name = "ExpectationError";
  }
}

function formatMessage(
  message: string,
  context?: { actual?: any; expected?: any; source?: any }
): string {
  let formatted = message;
  if (context) {
    if (context.actual !== undefined) {
      formatted = formatted.replace(
        /<actual>/g,
        formatValue(context.actual)
      );
    }
    if (context.expected !== undefined) {
      formatted = formatted.replace(
        /<expected>/g,
        formatValue(context.expected)
      );
    }
    if (context.source !== undefined) {
      formatted = formatted.replace(
        /<source>/g,
        String(context.source)
      );
    }
  }
  return `Expected ${formatted}`;
}

function formatValue(value: any): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  return String(value);
}
