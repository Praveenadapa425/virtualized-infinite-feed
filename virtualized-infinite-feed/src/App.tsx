import { BrowserRouter } from 'react-router-dom'
import Feed from './components/Feed'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <Feed />
      </div>
    </BrowserRouter>
  )
}

export default App