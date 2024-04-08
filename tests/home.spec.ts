import { expect, test } from '@playwright/test'

test('should display the indicators table', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  await expect(page.locator('table')).toBeVisible()
})

test('should filter indicators by code', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  const filter = page.locator('[placeholder="Buscar por código..."]')
  const tableRows = page.locator('table tbody tr')

  await filter.fill('NPNC')
  await expect(tableRows).toHaveCount(1)

  await filter.fill('')
  await expect(tableRows.nth(1)).toBeVisible()
})

test('should filter indicators by system', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  const systemFilter = page.getByRole('button', { name: 'Sistema' })
  await systemFilter.click()

  await page.getByRole('option', { name: 'SiAC' }).locator('div').click()
  await expect(page.getByRole('main')).toContainText('5 de 31 indicadores.')

  await page.getByRole('option', { name: 'Limpar filtro' }).click()
  await expect(page.getByRole('main')).not.toContainText('5 de 31 indicadores.')
})

test('should filter indicators by category', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  const tableRows = page.locator('table tbody tr')

  const systemFilter = page.getByRole('button', { name: 'Categoria' })
  await systemFilter.click()

  await page.getByRole('option', { name: 'Estratégico' }).locator('div').click()
  await expect(tableRows.nth(4)).not.toBeVisible()

  await page.getByRole('option', { name: 'Limpar filtro' }).click()
  await expect(tableRows.nth(4)).toBeVisible()
})

test('should filter indicators by system and category', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  const tableRows = page.locator('table tbody tr')

  const systemFilter = page.getByRole('button', { name: 'Sistema' })
  await systemFilter.click()
  await page.getByRole('option', { name: 'SiAC' }).locator('div').click()
  const categoryFilter = page.getByRole('button', { name: 'Categoria' })
  await categoryFilter.click()
  await page.getByRole('option', { name: 'Estratégico' }).locator('div').click()

  await expect(tableRows).toHaveCount(1)

  await page.getByRole('button', { name: 'Limpar filtros' }).click()
  await expect(tableRows.nth(1)).toBeVisible()
})
