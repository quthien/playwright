import { Page, Locator } from "@playwright/test";

export class Helper {
  async randomItemInArray(array: string[]) {
    return array[Math.floor(Math.random() * array.length)];
  }

  async verifyItemsContainKeywords(items: string, keywords: string[]): Promise<boolean> {
    // Create a regex pattern by joining all keywords with the '|' (OR) operator
    const pattern = new RegExp(keywords.join('|'), 'i'); // 'i' flag for case-insensitive matching  
       if(!pattern.test(items))
        {
          console.log(`The item ${items} does not contain any of the keywords: ${keywords}`)
          return false
        }
      
    return true;
}
}
