import { Page, Locator } from "@playwright/test";

export class Logger {
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
