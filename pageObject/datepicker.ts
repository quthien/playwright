import { Page, Locator } from '@playwright/test';

export class datePicker {
    private readonly page: Page;
    private dropdownMenu: Locator;
    private datepickerDays: Locator
    
  constructor(page: Page) {
    this.page = page;
    this.dropdownMenu = page.locator(`.datepicker.dropdown-menu[style*="display: block"]`);
    this.datepickerDays= page.locator("datepicker dropdown-menu")
  }

  
  
}