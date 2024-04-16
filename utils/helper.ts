import { Page, Locator } from "@playwright/test";

export class Helper {
  async randomItemInArray(array: string[]) {
    return array[Math.floor(Math.random() * array.length)];
  }
}
