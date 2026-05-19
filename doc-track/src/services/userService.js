import { supabase } from '../lib/supabaseClient.js'

// ─── getUsers ─────────────────────────────────────────────────────────────────
// Fetches all staff profiles ordered by role then name.
// Used by Users.jsx to populate the staff table.

export async function getUsers() {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, office, created_at')
        .order('role', { ascending: true })
        .order('full_name', { ascending: true })

    if (error) throw new Error(error.message)
    return data
}

// ─── createUser ───────────────────────────────────────────────────────────────
// Calls the Edge Function to create a new auth user + profile row.
// Only admins can call this — the Edge Function enforces it server-side.

export async function createUser({ email, password, full_name, role, office }) {
    const { data: { session } } = await supabase.auth.getSession()

    const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-user`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ email, password, full_name, role, office }),
        }
    )

    const result = await response.json()
    if (!response.ok) throw new Error(result.error || 'Failed to create user')
    return result
}

// ─── updateUserRole ───────────────────────────────────────────────────────────
// Updates a user's role and/or office directly in the profiles table.
// Admin only — RLS will enforce this once enabled.

export async function updateUserRole(userId, { role, office }) {
    const updates = {}
    if (role) updates.role = role
    if (office !== undefined) updates.office = office

    const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)

    if (error) throw new Error(error.message)
}