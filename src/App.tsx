import { Route, Routes, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import Settings from './pages/Settings'
import Investments from './pages/Investments'
import PiggyBank from './pages/PiggyBank'
import Info from './pages/Info'
import NavBar from './components/NavBar'
import AuthGuard from './components/AuthGuard'
import AdminGuard from './components/AdminGuard'
import Home from './pages/Home'
import History from './pages/History'
import Profile from './pages/Profile'

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
        <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />
        <Route path="/investments" element={<AuthGuard><Investments /></AuthGuard>} />
        <Route path="/piggy" element={<AuthGuard><PiggyBank /></AuthGuard>} />
        <Route path="/history" element={<AuthGuard><History /></AuthGuard>} />
        <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
        <Route path="/info" element={<Info />} />
        <Route path="/admin" element={<AdminGuard><Admin /></AdminGuard>} />
      </Routes>
    </div>
  )
}
