import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient.js'

// Fetches all documents from Supabase, ordered by date submitted (newest first).
// Returns { documents, loading, error, refetch }
// Usage: const { documents, loading, error } = useDocuments()

export function useDocuments() {
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    async function fetchDocuments() {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase
            .from('documents')
            .select('*')
            .order('date_submitted', { ascending: false })

        if (error) {
            setError(error.message)
        } else {
            // Map snake_case DB columns to camelCase to match the rest of the app
            setDocuments(data.map(mapDocument))
        }

        setLoading(false)
    }

    useEffect(() => {
        fetchDocuments()
    }, [])

    return { documents, loading, error, refetch: fetchDocuments }
}

// ─── Column mapper ────────────────────────────────────────────────────────────
// Supabase returns snake_case column names. This converts them to camelCase
// so the rest of the app (Dashboard, DocumentDetail) works without changes.

export function mapDocument(row) {
    return {
        id: row.id,
        title: row.title,
        requester: row.requester,
        contact: row.contact,
        type: row.type,
        status: row.status,
        currentHandler: row.current_handler,
        office: row.office,
        dateSubmitted: row.date_submitted,
        lastUpdated: row.last_updated,
        priority: row.priority,
        notes: row.notes,
    }
}