import { useAuthContext } from '../context/AuthContext.jsx'

// ─── useAuth ──────────────────────────────────────────────────────────────────
// The one hook every component uses to access auth state.
// Import this — never import useAuthContext directly in pages or components.
//
// Returns:
//   session    — raw Supabase session object (or null)
//   user       — raw Supabase user object (or null)
//   profile    — { id, full_name, role, office } from our profiles table
//   loading    — true while checking session on first load
//   isAdmin    — boolean shorthand
//   isClerk    — boolean shorthand
//   isOfficer  — boolean shorthand
//   isViewer   — boolean shorthand
//   canCreate  — true for admin + clerk
//   canUpdate  — true for admin + clerk + officer
//
// Usage:
//   const { profile, canCreate, canUpdate } = useAuth()

export function useAuth() {
    return useAuthContext()
}