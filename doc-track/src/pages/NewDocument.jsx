import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FilePlus, CheckCircle, AlertCircle } from 'lucide-react'
import { DOCUMENT_TYPES, OFFICES, PRIORITIES } from '../data/constants.js'

const EMPTY_FORM = {
    title: '',
    requester: '',
    contact: '',
    type: '',
    office: '',
    priority: 'Normal',
    notes: '',
}

function FieldLabel({ children, required }) {
    return (
        <label className="text-xs font-semibold text-stone-600 block mb-1.5 uppercase tracking-wide">
            {children}
            {required && <span className="text-red-400 ml-1">*</span>}
        </label>
    )
}

function inputClass(hasError) {
    return `w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 bg-stone-50 placeholder:text-stone-400 transition-colors
    ${hasError
            ? 'border-red-300 focus:ring-red-200 bg-red-50'
            : 'border-stone-200 focus:ring-stone-300'
        }`
}

export default function NewDocument() {
    const navigate = useNavigate()
    const [form, setForm] = useState(EMPTY_FORM)
    const [errors, setErrors] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const [newDocId, setNewDocId] = useState('')

    function handleChange(field, value) {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
    }

    function validate() {
        const e = {}
        if (!form.title.trim()) e.title = 'Document title is required.'
        if (!form.requester.trim()) e.requester = 'Requester name is required.'
        if (!form.contact.trim()) e.contact = 'Contact info is required.'
        if (!form.type) e.type = 'Please select a document type.'
        if (!form.office) e.office = 'Please select an office.'
        return e
    }

    function generateId() {
        const year = new Date().getFullYear()
        const rand = String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')
        return `DOC-${year}-${rand}`
    }

    function handleSubmit(e) {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length > 0) {
            setErrors(errs)
            return
        }

        const id = generateId()
        const today = new Date().toISOString().split('T')[0]
        const timeStr = new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', hour12: false })

        // In a real app, you would POST this to your API.
        // For now, we log it to the console so you can see the full object.
        const newDocument = {
            id,
            title: form.title.trim(),
            requester: form.requester.trim(),
            contact: form.contact.trim(),
            type: form.type,
            status: 'Received',
            currentHandler: 'Front Desk',
            office: form.office,
            dateSubmitted: today,
            lastUpdated: today,
            priority: form.priority,
            notes: form.notes.trim(),
            trail: [
                {
                    date: `${today} ${timeStr}`,
                    actor: 'Front Desk',
                    action: 'Document received and logged into the system.',
                    status: 'Received',
                },
            ],
        }

        console.log('New document created:', newDocument)

        setNewDocId(id)
        setSubmitted(true)
    }

    function handleReset() {
        setForm(EMPTY_FORM)
        setErrors({})
        setSubmitted(false)
        setNewDocId('')
    }

    // ── Success screen ──
    if (submitted) {
        return (
            <div className="p-6 max-w-lg mx-auto">
                <div className="bg-white border border-stone-200 rounded-xl p-8 text-center mt-12">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={28} strokeWidth={1.75} className="text-green-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-stone-800 mb-1">Document Logged</h2>
                    <p className="text-sm text-stone-500 mb-1">
                        The document has been received and assigned tracking number:
                    </p>
                    <p className="text-lg font-mono font-bold text-blue-600 mb-6">{newDocId}</p>

                    <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 text-left mb-6 space-y-2">
                        <Row label="Title" value={form.title} />
                        <Row label="Requester" value={form.requester} />
                        <Row label="Contact" value={form.contact} />
                        <Row label="Type" value={form.type} />
                        <Row label="Office" value={form.office} />
                        <Row label="Priority" value={form.priority} />
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 py-2.5 bg-stone-800 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors"
                        >
                            Back to Dashboard
                        </button>
                        <button
                            onClick={handleReset}
                            className="flex-1 py-2.5 border border-stone-200 text-stone-700 text-sm font-medium rounded-lg hover:bg-stone-50 transition-colors"
                        >
                            Log Another
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // ── Form ──
    return (
        <div className="p-6 max-w-2xl mx-auto">

            {/* Header */}
            <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 mb-5 transition-colors group"
            >
                <ArrowLeft size={15} strokeWidth={2} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to Dashboard
            </button>

            <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-stone-800 rounded-lg flex items-center justify-center shrink-0">
                    <FilePlus size={17} strokeWidth={1.75} className="text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-semibold text-stone-800">Log New Document</h1>
                    <p className="text-sm text-stone-500">Fill in the intake form to register a new document.</p>
                </div>
            </div>

            {/* Error summary */}
            {Object.keys(errors).length > 0 && (
                <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-lg mb-5">
                    <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-red-700 mb-1">Please fix the following:</p>
                        <ul className="list-disc list-inside space-y-0.5">
                            {Object.values(errors).map((err, i) => (
                                <li key={i} className="text-xs text-red-600">{err}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Section: Document Details */}
                <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                        Document Details
                    </p>

                    {/* Title */}
                    <div>
                        <FieldLabel required>Document Title</FieldLabel>
                        <input
                            type="text"
                            placeholder="e.g. Business Permit Application"
                            value={form.title}
                            onChange={e => handleChange('title', e.target.value)}
                            className={inputClass(errors.title)}
                        />
                        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                    </div>

                    {/* Type + Priority row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <FieldLabel required>Document Type</FieldLabel>
                            <select
                                value={form.type}
                                onChange={e => handleChange('type', e.target.value)}
                                className={inputClass(errors.type)}
                            >
                                <option value="">— Select type —</option>
                                {DOCUMENT_TYPES.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                            {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type}</p>}
                        </div>

                        <div>
                            <FieldLabel>Priority</FieldLabel>
                            <div className="flex gap-2">
                                {Object.keys(PRIORITIES).map(p => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => handleChange('priority', p)}
                                        className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors
                      ${form.priority === p
                                                ? p === 'High' ? 'bg-red-100 text-red-700 border-red-300'
                                                    : p === 'Normal' ? 'bg-blue-100 text-blue-700 border-blue-300'
                                                        : 'bg-stone-100 text-stone-600 border-stone-300'
                                                : 'bg-stone-50 text-stone-400 border-stone-200 hover:border-stone-300'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Office */}
                    <div>
                        <FieldLabel required>Forwarding Office</FieldLabel>
                        <select
                            value={form.office}
                            onChange={e => handleChange('office', e.target.value)}
                            className={inputClass(errors.office)}
                        >
                            <option value="">— Select office —</option>
                            {OFFICES.map(o => (
                                <option key={o} value={o}>{o}</option>
                            ))}
                        </select>
                        {errors.office && <p className="text-xs text-red-500 mt-1">{errors.office}</p>}
                    </div>

                    {/* Notes */}
                    <div>
                        <FieldLabel>Internal Notes</FieldLabel>
                        <textarea
                            rows={3}
                            placeholder="Any remarks about the document, requirements, or special instructions…"
                            value={form.notes}
                            onChange={e => handleChange('notes', e.target.value)}
                            className={inputClass(false) + ' resize-none'}
                        />
                    </div>
                </div>

                {/* Section: Requester Info */}
                <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                        Requester Information
                    </p>

                    {/* Name */}
                    <div>
                        <FieldLabel required>Full Name</FieldLabel>
                        <input
                            type="text"
                            placeholder="e.g. Juan dela Cruz"
                            value={form.requester}
                            onChange={e => handleChange('requester', e.target.value)}
                            className={inputClass(errors.requester)}
                        />
                        {errors.requester && <p className="text-xs text-red-500 mt-1">{errors.requester}</p>}
                    </div>

                    {/* Contact */}
                    <div>
                        <FieldLabel required>Contact (Email or Phone)</FieldLabel>
                        <input
                            type="text"
                            placeholder="e.g. juan@email.com or 09171234567"
                            value={form.contact}
                            onChange={e => handleChange('contact', e.target.value)}
                            className={inputClass(errors.contact)}
                        />
                        {errors.contact && <p className="text-xs text-red-500 mt-1">{errors.contact}</p>}
                    </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pb-6">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="px-5 py-2.5 border border-stone-200 text-stone-600 text-sm font-medium rounded-lg hover:bg-stone-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-stone-800 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors"
                    >
                        <FilePlus size={15} strokeWidth={2} />
                        Log Document
                    </button>
                </div>

            </form>
        </div>
    )
}

// Small helper for the success summary
function Row({ label, value }) {
    return (
        <div className="flex justify-between items-start gap-4">
            <span className="text-xs text-stone-400 shrink-0">{label}</span>
            <span className="text-xs font-medium text-stone-700 text-right">{value}</span>
        </div>
    )
}