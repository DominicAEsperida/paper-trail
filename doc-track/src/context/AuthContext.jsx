import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'

const AuthContext = createContext(null)

// ─── AuthProvider ─────────────────────────────────────────────────────────────
// Wrap the whole app with this in App.jsx.
// Listens to Supabase auth state changes and fetches the user's profile (role).
// Any component can call useAuthContext() to get session, user, profile, loading.

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    // Fetch profile row (full_name, role, office) for the logged-in user
    async function fetchProfile(userId) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()

        if (!error) setProfile(data)
    }

    useEffect(() => {
        // 1. Get the current session on first load
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            if (session) fetchProfile(session.user.id)
            else setLoading(false)
        })

        // 2. Listen for login / logout events
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setSession(session)
                if (session) {
                    await fetchProfile(session.user.id)
                } else {
                    setProfile(null)
                }
                setLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    // Stop showing a blank screen while we check if the user is logged in
    useEffect(() => {
        if (profile) setLoading(false)
    }, [profile])

    const value = {
        session,
        user: session?.user ?? null,
        profile,                          // { id, full_name, role, office }
        loading,
        isAdmin: profile?.role === 'admin',
        isClerk: profile?.role === 'clerk',
        isOfficer: profile?.role === 'officer',
        isViewer: profile?.role === 'viewer',
        canCreate: ['admin', 'clerk'].includes(profile?.role),
        canUpdate: ['admin', 'clerk', 'officer'].includes(profile?.role),
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

// ─── Internal hook (used only by useAuth.js) ──────────────────────────────────
export function useAuthContext() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider')
    return ctx
}