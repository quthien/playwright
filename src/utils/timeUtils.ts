import { Page, Locator } from "@playwright/test";
const crypto = require("crypto-js");

export class TimeUltils {
  static getCurentTimeByFormat(format = "YYYY-MM-DD HH:mm:ss.SSS") {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const milliseconds = date.getMilliseconds().toString().padStart(3, "0");

    return format
      .replace("YYYY", year.toString())
      .replace("MM", month)
      .replace("DD", day)
      .replace("HH", hours)
      .replace("mm", minutes)
      .replace("ss", seconds)
      .replace("SSS", milliseconds);
  }
}
