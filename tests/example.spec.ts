import { test, expect } from '@playwright/test';


test('has title', async ({ page }) => {
  await page.goto('https://phptravels.net/');

  const tabName = 'flights'
  const button = page.getByRole('tab', { name: tabName });

  await button.click();


  await page.waitForTimeout(5000); 
});
