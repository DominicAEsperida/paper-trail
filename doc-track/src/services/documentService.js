import { supabase } from '../lib/supabaseClient.js'

// ─── createDocument ───────────────────────────────────────────────────────────
// Inserts a new document row and its first trail entry in one go.
// Called by NewDocument.jsx on form submit.

export async function createDocument(formData, generatedId) {
    const today = new Date().toISOString().split('T')[0]
    const timeStr = new Date().toLocaleTimeString('en-PH', {
        hour: '2-digit', minute: '2-digit', hour12: false,
    })

    // 1. Insert the document
    const { error: docError } = await supabase
        .from('documents')
        .insert({
            id: generatedId,
            title: formData.title.trim(),
            requester: formData.requester.trim(),
            contact: formData.contact.trim(),
            type: formData.type,
            status: 'Received',
            current_handler: 'Front Desk',
            office: formData.office,
            date_submitted: today,
            last_updated: today,
            priority: formData.priority,
            notes: formData.notes.trim(),
        })

    if (docError) throw new Error(docError.message)

    // 2. Insert the first trail entry
    const { error: trailError } = await supabase
        .from('trail')
        .insert({
            document_id: generatedId,
            date: `${today} ${timeStr}`,
            actor: 'Front Desk',
            action: 'Document received and logged into the system.',
            status: 'Received',
        })

    if (trailError) throw new Error(trailError.message)

    return generatedId
}

// ─── updateDocument ───────────────────────────────────────────────────────────
// Updates a document's status and/or handler, then appends a trail entry.
// Called by DocumentDetail.jsx when staff submits the update form.

export async function updateDocument(documentId, { newStatus, newHandler, updateNote, currentStatus, currentHandler }) {
    const today = new Date().toISOString().split('T')[0]
    const timeStr = new Date().toLocaleTimeString('en-PH', {
        hour: '2-digit', minute: '2-digit', hour12: false,
    })

    const resolvedStatus = newStatus || currentStatus
    const resolvedHandler = newHandler || currentHandler

    // 1. Update the document row
    const { error: docError } = await supabase
        .from('documents')
        .update({
            status: resolvedStatus,
            current_handler: resolvedHandler,
            last_updated: today,
        })
        .eq('id', documentId)

    if (docError) throw new Error(docError.message)

    // 2. Append the trail entry
    const { error: trailError } = await supabase
        .from('trail')
        .insert({
            document_id: documentId,
            date: `${today} ${timeStr}`,
            actor: resolvedHandler,
            action: updateNote || `Status updated to ${resolvedStatus}.`,
            status: resolvedStatus,
        })

    if (trailError) throw new Error(trailError.message)
}