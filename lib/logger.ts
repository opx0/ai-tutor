/**
 * Enhanced logging functionality for the Next.js backend
 * Console-only logging (no file I/O) for serverless compatibility
 */

// Define log levels
export enum LogLevel {
  DEBUG = 100,
  INFO = 200,
  WARNING = 300,
  ERROR = 400,
  CRITICAL = 500,
}

// Log level names
const LOG_LEVEL_NAMES: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: "DEBUG",
  [LogLevel.INFO]: "INFO",
  [LogLevel.WARNING]: "WARNING",
  [LogLevel.ERROR]: "ERROR",
  [LogLevel.CRITICAL]: "CRITICAL",
};

// Get the configured log level from environment or use default
const configuredLogLevel = process.env.NEXTJS_LOG_LEVEL || "INFO";
const currentLogLevel = getLogLevelValue(configuredLogLevel);

/**
 * Convert log level string to numeric value
 */
function getLogLevelValue(level: string): LogLevel {
  switch (level.toUpperCase()) {
    case "DEBUG":
      return LogLevel.DEBUG;
    case "INFO":
      return LogLevel.INFO;
    case "WARNING":
      return LogLevel.WARNING;
    case "ERROR":
      return LogLevel.ERROR;
    case "CRITICAL":
      return LogLevel.CRITICAL;
    default:
      return LogLevel.INFO;
  }
}

/**
 * Get the appropriate console method for the log level
 */
function getConsoleMethod(level: LogLevel): (message: string, ...args: unknown[]) => void {
  switch (level) {
    case LogLevel.DEBUG:
      return console.debug;
    case LogLevel.INFO:
      return console.info;
    case LogLevel.WARNING:
      return console.warn;
    case LogLevel.ERROR:
    case LogLevel.CRITICAL:
      return console.error;
    default:
      return console.log;
  }
}

/**
 * Generate a unique request ID
 */
function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Log a message with the specified level
 */
export function logMessage(
  message: string,
  level: LogLevel = LogLevel.INFO,
  context: Record<string, unknown> = {}
): void {
  if (level < currentLogLevel) {
    return;
  }

  const timestamp = new Date().toISOString();
  const levelName = LOG_LEVEL_NAMES[level];
  const requestId = (context.requestId as string) || generateRequestId();

  const contextStr =
    Object.keys(context).length > 0 ? " " + JSON.stringify(context) : "";

  const consoleMethod = getConsoleMethod(level);
  consoleMethod(
    `[${timestamp}] [${levelName}] [${requestId}] ${message}${contextStr}`
  );
}

/**
 * Log a debug message
 */
export function logDebug(
  message: string,
  context: Record<string, unknown> = {}
): void {
  logMessage(message, LogLevel.DEBUG, context);
}

/**
 * Log an info message
 */
export function logInfo(
  message: string,
  context: Record<string, unknown> = {}
): void {
  logMessage(message, LogLevel.INFO, context);
}

/**
 * Log a warning message
 */
export function logWarning(
  message: string,
  context: Record<string, unknown> = {}
): void {
  logMessage(message, LogLevel.WARNING, context);
}

/**
 * Log an error message
 */
export function logError(
  message: string,
  context: Record<string, unknown> = {}
): void {
  logMessage(message, LogLevel.ERROR, context);
}

/**
 * Log a critical message
 */
export function logCritical(
  message: string,
  context: Record<string, unknown> = {}
): void {
  logMessage(message, LogLevel.CRITICAL, context);
}

/**
 * Log API request details
 */
export function logApiRequest(req: Request): Record<string, unknown> {
  const url = new URL(req.url);
  const requestContext = {
    method: req.method,
    path: url.pathname,
    query: Object.fromEntries(url.searchParams.entries()),
    userAgent: req.headers.get("user-agent") || "UNKNOWN",
    requestId: req.headers.get("x-request-id") || generateRequestId(),
  };

  logInfo("API Request received", requestContext);
  return requestContext;
}

/**
 * Log API response details
 */
export function logApiResponse(
  statusCode: number,
  responseData: unknown = null,
  requestContext: Record<string, unknown> = {}
): void {
  const context: Record<string, unknown> = {
    ...requestContext,
    statusCode,
  };

  // Only include response data for errors to avoid logging sensitive information
  if (statusCode >= 400 && responseData) {
    context.response = responseData;
  }

  logInfo("API Response sent", context);
}

// Initialize logging
logInfo("Next.js Backend Logger initialized", {
  logLevel: configuredLogLevel,
});
