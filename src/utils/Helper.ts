import { Page, Locator } from "@playwright/test";
const crypto = require("crypto-js");

export class Helper {
  async randomItemInArray(array: string[]) {
    return array[Math.floor(Math.random() * array.length)];
  }

  async verifyItemsContainKeywords(
    items: string,
    keywords: string[],
  ): Promise<boolean> {
    // Create a regex pattern by joining all keywords with the '|' (OR) operator
    const pattern = new RegExp(keywords.join("|"), "i"); // 'i' flag for case-insensitive matching
    if (!pattern.test(items)) {
      console.log(
        `The item ${items} does not contain any of the keywords: ${keywords}`,
      );
      return false;
    }

    return true;
  }

  async mapData<T, U extends object>(source: T, destination: U): Promise<U> {
    Object.assign(destination, source);
    return destination;
  }

  async generateCSRFToken() {
    const randomBytes = crypto.lib.WordArray.random(32);

    // Convert random bytes to hexadecimal string
    const token = randomBytes.toString(crypto.enc.Hex);

    return token;
  }
}
