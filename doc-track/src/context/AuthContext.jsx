import { createContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    async function fetchProfile(userId) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()
            if (!error && data) setProfile(data)
        } catch (e) {
            console.error('Profile fetch error:', e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        async function init() {
            const { data: { session } } = await supabase.auth.getSession()

            setSession(session)

            if (session?.user) {
                fetchProfile(session.user.id)
            }

            setLoading(false)
        }

        init()

        const { data: { subscription } } =
            supabase.auth.onAuthStateChange(async (_, session) => {

                setSession(session)

                if (session?.user) {
                    fetchProfile(session.user.id)
                } else {
                    setProfile(null)
                }

                setLoading(false)
            })

        return () => subscription.unsubscribe()

    }, [])

    const value = {
        session,
        user: session?.user ?? null,
        profile,
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