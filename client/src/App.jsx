import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { getCurrentUser } from './services/api'
import { useDispatch, useSelector } from 'react-redux'
import History from './pages/History'
import Notes from './pages/Notes'
import Pricing from './pages/Pricing'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailed from './pages/PaymentFailed'

export const serverUrl = "https://ai-exam-notes-generator-backend.onrender.com"

function App() {
  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.user)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentUser(dispatch).finally(() => {
      setLoading(false)
    })
  }, [dispatch])

  // 🔥 IMPORTANT: wait until user loads
 if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

  return (
    <Routes>
      <Route path='/' element={userData ? <Home /> : <Navigate to="/auth" replace />} />
      <Route path='/auth' element={userData ? <Navigate to="/" replace /> : <Auth />} />
      <Route path='/history' element={userData ? <History /> : <Navigate to="/auth" replace />} />
      <Route path='/notes' element={userData ? <Notes /> : <Navigate to="/auth" replace />} />
      <Route path='/pricing' element={userData ? <Pricing /> : <Navigate to="/auth" replace />} />

      {/* ✅ FIXED: duplicate route removed */}
      <Route path='/payment-success' element={<PaymentSuccess />} />
      <Route path='/payment-failed' element={<PaymentFailed />} />
    </Routes>
  )
}

export default App
