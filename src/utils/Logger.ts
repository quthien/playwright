import { createLogger, transports, format } from "winston";

const { combine, timestamp, printf, colorize } = format;
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});
export class Logger {
  private logger;

  constructor() {
    this.logger = createLogger({
      format: combine(
        colorize(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat,
      ),
      transports: [
        new transports.Console(),
        // new transports.File({ filename: "test-log.log" }),
      ],
    });
  }

  info(message: string) {
    this.logger.info(message);
  }

  error(message: string) {
    this.logger.error(message);
  }

  async logObject(obj, indent = 0) {
    for (const key in obj) {
      if (typeof obj[key] === "object") {
        console.log(`${" ".repeat(indent)}- ${key}:`);
        this.logObject(obj[key], indent + 2);
      } else {
        console.log(`${" ".repeat(indent)}- ${key}: ${obj[key]}`);
      }
    }
  }
}
