import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { useAuth } from './hooks/useAuth.js'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Sidebar from './components/Sidebar.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import DocumentDetail from './pages/DocumentDetail.jsx'
import NewDocument from './pages/NewDocument.jsx'
import Users from './pages/Users.jsx'

// ─── Layout shell ─────────────────────────────────────────────────────────────
function AppLayout({ children }) {
  return (
    <div className="flex h-screen bg-stone-100 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

// ─── Admin-only route guard ───────────────────────────────────────────────────
// Redirects non-admins to the dashboard instead of showing a blank/error page.
function AdminRoute({ children }) {
  const { isAdmin, loading } = useAuth()
  if (loading) return null
  if (!isAdmin) return <Navigate to="/dashboard" replace />
  return children
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Routes>

          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected — all logged-in users */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AppLayout><Dashboard /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/documents/:id" element={
            <ProtectedRoute>
              <AppLayout><DocumentDetail /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/new" element={
            <ProtectedRoute>
              <AppLayout><NewDocument /></AppLayout>
            </ProtectedRoute>
          } />

          {/* Admin only */}
          <Route path="/users" element={
            <ProtectedRoute>
              <AdminRoute>
                <AppLayout><Users /></AppLayout>
              </AdminRoute>
            </ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}