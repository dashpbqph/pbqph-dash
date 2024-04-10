import { expect, test, type Page } from '@playwright/test'

let page: Page

test.describe('User Management', () => {
  test.describe.configure({ mode: 'serial' })

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await page.goto('/', { waitUntil: 'networkidle' })

    await page.locator('[data-testid="login-button"]').click()
    await page.fill('[name="username"]', 'super.admin')
    await page.fill('[name="password"]', 'SADMIN@dashboard2023')
    await page.locator('[data-testid="login-form-submit-button"]').click()
    await page.waitForLoadState('networkidle')
    await expect(page.locator('[data-testid="user-button"]')).toBeVisible()
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('should display the users table', async ({ page }) => {
    await page.goto('/admin/usuarios', { waitUntil: 'networkidle' })
    await expect(page.locator('table')).toBeVisible()
    await expect(page.locator('table tbody tr').nth(0)).toBeVisible()
  })

  test('should filter users by name', async ({ page }) => {
    await page.goto('/admin/usuarios', { waitUntil: 'networkidle' })
    await page.locator('[placeholder="Buscar por nome..."]').fill('Super Admin')
    await expect(page.locator('table tbody tr')).toHaveCount(1)
    await expect(page.locator('table tbody tr').nth(0)).toContainText(
      'Super Admin',
    )
    await page.locator('[placeholder="Buscar por nome..."]').fill('')
    await expect(page.locator('table tbody tr').nth(0)).toBeVisible()
  })

  test('should create a new user', async ({ page }) => {
    await page.goto('/admin/usuarios', { waitUntil: 'networkidle' })
    await page.click('button:has-text("Criar usuário")')
    await page.waitForLoadState('networkidle')
    await page.fill('[name="username"]', 'usuario.teste')
    await page.fill('[name="firstName"]', 'Usuário')
    await page.fill('[name="lastName"]', 'Teste')
    await page.fill('[name="email"]', 'usuario.teste@email.com')
    await page.locator('[data-testid=role]').click()
    await page.getByLabel('Membro').click()
    await page.locator('[data-testid="generate-password-button"]').click()
    await page.locator('[data-testid="dialog-form-submit-button"]').click()

    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10000 })
    await page
      .locator('[placeholder="Buscar por nome..."]')
      .fill('Usuário Teste')
    await expect(page.locator('table tbody tr')).toHaveCount(1)
  })

  test('should edit a user', async ({ page }) => {
    await page.goto('/admin/usuarios', { waitUntil: 'networkidle' })
    await page
      .locator('[placeholder="Buscar por nome..."]')
      .fill('Usuário Teste')
    await expect(page.locator('table tbody tr')).toHaveCount(1)
    await page.locator('[data-testid="actions-menu-button"]').click()
    await page.locator('button:has-text("Editar usuário")').click()
    await page.waitForLoadState('networkidle')
    await page.fill('[name="firstName"]', 'Usuárioo')
    await page.locator('[data-testid="dialog-form-submit-button"]').click()

    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10000 })
    await page
      .locator('[placeholder="Buscar por nome..."]')
      .fill('Usuárioo Teste')
    await expect(page.locator('table tbody tr')).toHaveCount(1)
  })

  // test('should reset a user password', async ({ page }) => {
  //   await page.goto('/admin/users')
  //   await page.click('[aria-label="Redefinir senha"]')
  //   await page.click('button:has-text("Confirmar")')
  //   await expect(page.locator('[role="alert"]')).toContainText(
  //     'Senha redefinida com sucesso',
  //   )
  // })

  test('should remove a user', async ({ page }) => {
    await page.goto('/admin/usuarios', { waitUntil: 'networkidle' })
    await page
      .locator('[placeholder="Buscar por nome..."]')
      .fill('Usuárioo Teste')
    await expect(page.locator('table tbody tr')).toHaveCount(1)
    await page.locator('[data-testid="actions-menu-button"]').click()
    await page.locator('button:has-text("Remover usuário")').click()
    await page.locator('button:has-text("Confirmar")').click()
    await page.waitForLoadState('networkidle')
    await page
      .locator('[placeholder="Buscar por nome..."]')
      .fill('Usuárioo Teste')
    await expect(page.locator('table tbody tr')).toHaveCount(0)
  })
})
