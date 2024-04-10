import { expect, test } from '@playwright/test'

let indicatorId: string | undefined

test.describe('Indicator details page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    const filter = page.locator('[placeholder="Buscar por código..."]')
    const tableRows = page.locator('table tbody tr')

    await filter.fill('NPNC')
    await expect(tableRows).toHaveCount(1)

    await tableRows.nth(0).click()
    await page.waitForURL('**/detalhes/**', { timeout: 6000 })
    indicatorId = page.url().split('/').pop()
  })

  test('should display the basic information correctly', async ({ page }) => {
    await page.goto(`/detalhes/${indicatorId}`, { waitUntil: 'networkidle' })
    await expect(page.locator('[data-testid="title"]')).toContainText('NPNC')
    await expect(page.locator('[data-testid="objective"]')).toBeVisible()
    await expect(page.locator('[data-testid="formula"]')).toContainText('NPNC')
    await expect(page.locator('[data-testid="unit"]')).toBeVisible()
    await expect(page.locator('[data-testid="polarity"]')).toBeVisible()
    await expect(page.locator('[data-testid="periodicity"]')).toBeVisible()
    await expect(page.locator('[data-testid="cumulative"]')).toBeVisible()
    await expect(page.locator('[data-testid="stratification"]')).toBeVisible()
  })

  // test('should display the statistics correctly', async ({ page }) => {
  //   await page.goto(`/detalhes/${indicatorId}`)
  //   await expect(page.locator('[data-testid="average"]')).toBeVisible()
  //   await expect(page.locator('[data-testid="median"]')).toBeVisible()
  //   await expect(page.locator('[data-testid="max"]')).toBeVisible()
  //   await expect(page.locator('[data-testid="min"]')).toBeVisible()
  // })

  test('should display the lines in the chart correctly', async ({ page }) => {
    await page.goto(`/detalhes/${indicatorId}`, { waitUntil: 'networkidle' })
    await expect(page.locator('[id="historical-chart"]')).toBeVisible()
    await expect(page.locator('[id="chart-legend"]')).toBeVisible()
    await expect(page.locator('[id^="chart-data-line-"]').nth(0)).toBeVisible()
  })
})
