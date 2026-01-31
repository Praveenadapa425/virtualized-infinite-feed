import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Feed from './components/Feed'
import Profile from './components/Profile'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/profile/:userId" element={<Profile />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App