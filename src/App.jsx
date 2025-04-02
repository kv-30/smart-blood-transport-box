import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import StatsPage from './pages/StatsPage'
import MeetTeamPage from './pages/MeetTeamPage'
import { DeviceProvider } from './context/DeviceContext'
import { Cleanup } from './components/Cleanup'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <DeviceProvider>
      <Cleanup />
      <Router future={{ v7_startTransition: true }}>
        <div className="min-h-screen bg-white dark:bg-gray-900">
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <main className="pt-16">
            {/* Page Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/team" element={<MeetTeamPage />} />
                <Route path="*" element={<div>Page not found</div>} />
              </Routes>
            </div>
          </main>
          <Footer />
        </div>
      </Router>
    </DeviceProvider>
  )
}

export default App