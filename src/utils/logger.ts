// logger.ts
import { createLogger, transports, format } from "winston";

const { combine, timestamp, printf, colorize } = format;

const logger = createLogger({
  format: combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    }),
  ),
  transports: [
    new transports.Console(),
    // new transports.File({ filename: 'test-log.log' }),
  ],
});

export function loggerInfo(message: string) {
  logger.info(message);
}

export function loggerError(message: string) {
  logger.error(message);
}

export function logObject(obj: any, indent = 0): void {
  for (const key in obj) {
    if (typeof obj[key] === "object") {
      console.log(`${" ".repeat(indent)}- ${key}:`);
      logObject(obj[key], indent + 2);
    } else {
      console.log(`${" ".repeat(indent)}- ${key}: ${obj[key]}`);
    }
  }
}
