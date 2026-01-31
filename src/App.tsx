import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Feed from './components/Feed'
import { Toaster } from 'react-hot-toast'

// Lazy load the Profile component
const Profile = lazy(() => import('./components/Profile'))

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route 
            path="/profile/:userId" 
            element={
              <Suspense fallback={
                <div className="max-w-2xl mx-auto p-4">
                  <div className="text-center py-8">Loading profile...</div>
                </div>
              }>
                <Profile />
              </Suspense>
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App