import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Footer } from '@/components/layout/Footer'
import { HomePage } from '@/pages/HomePage'
import { CatalogPage } from '@/pages/CatalogPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { CategoryPage } from '@/pages/CategoryPage'
import { CategoriesPage } from '@/pages/CategoriesPage'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<CatalogPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/:category" element={<CategoryPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}
