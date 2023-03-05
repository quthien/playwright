import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://phptravels.net/');
});


test.describe('New Todo', () => {
})