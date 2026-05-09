import { Routes, Route } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-background p-8">
            <h1 className="text-3xl font-bold tracking-tight">Catalog</h1>
            <p className="mt-2 text-muted-foreground">Shell ready — pages coming in Task 7.</p>
            <Button className="mt-4">Get started</Button>
          </div>
        }
      />
    </Routes>
  )
}
