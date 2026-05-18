import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Sidebar from './components/Sidebar.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import DocumentDetail from './pages/DocumentDetail.jsx'
import NewDocument from './pages/NewDocument.jsx'

// ─── Layout ───────────────────────────────────────────────────────────────────
// Wraps all protected pages with the sidebar shell.
// Only rendered when the user is logged in.

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

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Public route — login page, no sidebar */}
          <Route path="/login" element={<Login />} />

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected routes — require login, show sidebar */}
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

          {/* Catch-all → dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}