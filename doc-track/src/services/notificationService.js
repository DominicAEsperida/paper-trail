import { supabase } from '../lib/supabaseClient.js'

// ─── sendPickupNotification ───────────────────────────────────────────────────
// Calls the send-notification Edge Function when a document reaches
// "Ready for Pickup" status. Works for both email and phone contacts.
//
// Usage:
//   await sendPickupNotification({
//     id: 'DOC-2025-0001',
//     title: 'Business Permit Application',
//     requester: 'Juan dela Cruz',
//     contact: 'juandc@email.com',   // or '09171234567'
//   })

export async function sendPickupNotification({ id, title, requester, contact }) {
    const { data: { session } } = await supabase.auth.getSession()

    const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-notification`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
                requester,
                contact,
                documentId: id,
                documentTitle: title,
            }),
        }
    )

    const result = await response.json()
    if (!response.ok) throw new Error(result.error || 'Notification failed')
    return result
}