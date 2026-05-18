import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { mapDocument } from './useDocuments.js'

// Fetches one document by ID, plus its full audit trail ordered by date.
// Returns { document, loading, error, refetch }
// Usage: const { document, loading, error } = useDocument('DOC-2025-0001')

export function useDocument(id) {
    const [document, setDocument] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    async function fetchDocument() {
        if (!id) return
        setLoading(true)
        setError(null)

        // Fetch the document row
        const { data: docData, error: docError } = await supabase
            .from('documents')
            .select('*')
            .eq('id', id)
            .single()

        if (docError) {
            setError(docError.message)
            setLoading(false)
            return
        }

        // Fetch its trail rows, oldest first so the timeline reads top-to-bottom
        const { data: trailData, error: trailError } = await supabase
            .from('trail')
            .select('*')
            .eq('document_id', id)
            .order('id', { ascending: true })

        if (trailError) {
            setError(trailError.message)
            setLoading(false)
            return
        }

        // Combine into the same shape the app already expects
        setDocument({
            ...mapDocument(docData),
            trail: trailData.map(mapTrailEntry),
        })

        setLoading(false)
    }

    useEffect(() => {
        fetchDocument()
    }, [id])

    return { document, loading, error, refetch: fetchDocument }
}

// ─── Trail row mapper ─────────────────────────────────────────────────────────
export function mapTrailEntry(row) {
    return {
        date: row.date,
        actor: row.actor,
        action: row.action,
        status: row.status,
    }
}