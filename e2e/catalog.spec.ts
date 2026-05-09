import { test, expect } from '@playwright/test'

test.describe('Home page', () => {
  test('loads and shows featured products', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Featured Products' })).toBeVisible()
    const cards = page.locator('a[href^="/products/"]')
    await expect(cards.first()).toBeVisible({ timeout: 10_000 })
  })

  test('header has nav links and search', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Products' })).toBeVisible()
    await expect(page.getByPlaceholder('Search products...')).toBeVisible()
  })
})

test.describe('Catalog page', () => {
  test('shows all products', async ({ page }) => {
    await page.goto('/products')
    await expect(page.getByRole('heading', { name: 'All Products' })).toBeVisible()
    const cards = page.locator('a[href^="/products/"]')
    await expect(cards.first()).toBeVisible({ timeout: 10_000 })
  })

  test('displays category badges', async ({ page }) => {
    await page.goto('/products')
    await page.waitForSelector('[href^="/products/"]', { timeout: 10_000 })
    await expect(page.getByText('electronics')).toBeVisible()
  })

  test('search results page', async ({ page }) => {
    await page.goto('/products?q=jacket')
    await expect(page.getByRole('heading', { name: /Results for "jacket"/ })).toBeVisible()
    await page.waitForLoadState('networkidle')
  })
})

test.describe('Product detail page', () => {
  test('shows product info', async ({ page }) => {
    await page.goto('/products/1')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText(/\$\d+\.\d{2}/)).toBeVisible()
  })

  test('shows back link', async ({ page }) => {
    await page.goto('/products/1')
    await expect(page.getByText('← Back to products')).toBeVisible({ timeout: 10_000 })
  })

  test('shows enquiry form', async ({ page }) => {
    await page.goto('/products/1')
    await expect(page.getByRole('heading', { name: 'Make an Enquiry' })).toBeVisible({
      timeout: 10_000,
    })
    await expect(page.getByLabel('Name')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Message')).toBeVisible()
  })

  test('enquiry form validates required fields', async ({ page }) => {
    await page.goto('/products/1')
    await page.waitForSelector('text=Make an Enquiry', { timeout: 10_000 })
    await page.getByRole('button', { name: 'Send Enquiry' }).click()
    await expect(page.getByText('Name is required')).toBeVisible()
    await expect(page.getByText('Invalid email')).toBeVisible()
  })

  test('enquiry form submits successfully', async ({ page }) => {
    await page.goto('/products/1')
    await page.waitForSelector('text=Make an Enquiry', { timeout: 10_000 })
    await page.getByLabel('Name').fill('Test User')
    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Message').fill('I am interested in this product')
    await page.getByRole('button', { name: 'Send Enquiry' }).click()
    await expect(page.getByText("Enquiry sent! We'll be in touch soon.")).toBeVisible({
      timeout: 10_000,
    })
  })
})

test.describe('Navigation', () => {
  test('header search navigates to /products?q=', async ({ page }) => {
    await page.goto('/')
    await page.getByPlaceholder('Search products...').fill('ring')
    await page.getByRole('button', { name: 'Search' }).click()
    await expect(page).toHaveURL(/\/products\?q=ring/)
    await expect(page.getByRole('heading', { name: /Results for "ring"/ })).toBeVisible()
  })

  test('product card links to detail page', async ({ page }) => {
    await page.goto('/products')
    const firstCard = page.locator('a[href^="/products/"]').first()
    await firstCard.waitFor({ timeout: 10_000 })
    const href = await firstCard.getAttribute('href')
    await firstCard.click()
    await expect(page).toHaveURL(href!)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10_000 })
  })

  test('back link returns to products page', async ({ page }) => {
    await page.goto('/products/1')
    await page.getByText('← Back to products').click({ timeout: 10_000 })
    await expect(page).toHaveURL('/products')
  })
})
