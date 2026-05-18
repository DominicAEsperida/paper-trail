import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { FileStack } from 'lucide-react'

// ─── ProtectedRoute ───────────────────────────────────────────────────────────
// Wrap any route you want to protect with this component.
// - While auth is loading → show a centered spinner
// - If no session → redirect to /login (remembers where they were going)
// - If session exists → render the page normally
//
// Usage in App.jsx:
//   <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

export default function ProtectedRoute({ children }) {
    const { session, loading } = useAuth()
    const location = useLocation()

    // Still checking session — show a neutral loading screen
    if (loading) {
        return (
            <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center">
                    <FileStack size={18} strokeWidth={1.75} className="text-white" />
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        )
    }

    // Not logged in → redirect to login, remember the page they tried to visit
    if (!session) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // Logged in → render the protected page
    return children
}