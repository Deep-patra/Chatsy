import { expect, test } from '@playwright/test'

test('Should be the main page', async ({ page }) => {
  expect(page).toHaveURL('http://localhost:5000')
})

test('Should navigate to login page', async ({ page }) => {
  await page.screenshot({ path: 'tests/e2e/screenshots/screenshot.jpg' })

  await page.getByTestId('login').click()

  expect(page).toHaveURL('/login')
})
