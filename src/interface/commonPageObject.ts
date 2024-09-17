import { Page, Locator } from "@playwright/test";

export interface CommonPageObject {
  navigateToPage(pageName: string): Promise<void>;
}
