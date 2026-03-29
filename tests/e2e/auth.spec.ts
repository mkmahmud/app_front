import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login')
  })

  test('redirects to login when accessing protected route unauthenticated', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/auth\/login/)
    await expect(page.getByText('Welcome back')).toBeVisible()
  })

  test('shows validation errors on empty form submission', async ({ page }) => {
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByText(/email is required/i)).toBeVisible()
  })

  test('shows error for invalid credentials', async ({ page }) => {
    await page.getByLabel(/email/i).fill('wrong@example.com')
    await page.getByLabel(/password/i).fill('wrongpassword')
    await page.getByRole('button', { name: /sign in/i }).click()

    // Expect error message (depends on API response)
    await expect(page.getByRole('alert')).toBeVisible({ timeout: 5000 })
  })

  test('navigates to register page', async ({ page }) => {
    await page.getByRole('link', { name: /create account/i }).click()
    await expect(page).toHaveURL(/\/auth\/register/)
    await expect(page.getByText('Create an account')).toBeVisible()
  })

  test('navigates to forgot password', async ({ page }) => {
    await page.getByRole('link', { name: /forgot password/i }).click()
    await expect(page).toHaveURL(/\/auth\/forgot-password/)
  })

  test('password visibility toggle works', async ({ page }) => {
    const passwordInput = page.getByLabel(/password/i)
    await expect(passwordInput).toHaveAttribute('type', 'password')

    await page.getByLabel(/show password/i).click()
    await expect(passwordInput).toHaveAttribute('type', 'text')

    await page.getByLabel(/hide password/i).click()
    await expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('register form validates all fields', async ({ page }) => {
    await page.goto('/auth/register')

    await page.getByRole('button', { name: /create account/i }).click()
    await expect(page.getByText(/name must be at least/i)).toBeVisible()
  })

  test('register shows password strength requirements', async ({ page }) => {
    await page.goto('/auth/register')

    await page.getByLabel(/password/i).first().fill('weak')

    // Requirements list should appear
    await expect(page.getByText(/at least 8 characters/i)).toBeVisible()
    await expect(page.getByText(/one uppercase letter/i)).toBeVisible()
  })
})
