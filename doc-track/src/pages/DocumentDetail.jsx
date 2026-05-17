import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    ArrowLeft, User, Building2, Phone, Calendar,
    Clock, CheckCircle, Circle, AlertCircle, ChevronRight
} from 'lucide-react'
import { MOCK_DOCUMENTS } from '../data/mockDocuments.js'
import { STATUSES, STATUS_ORDER, PRIORITIES } from '../data/constants.js'
import { StatusBadge, PriorityBadge, TypeBadge } from '../components/StatusBadge.jsx'

// ─── Progress Stepper ─────────────────────────────────────────────────────────
function ProgressStepper({ currentStatus }) {
    const currentIdx = STATUS_ORDER.indexOf(currentStatus)
    const isReturned = currentStatus === 'Returned'

    if (isReturned) {
        return (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle size={16} className="text-red-500 shrink-0" />
                <p className="text-sm text-red-700 font-medium">
                    Document returned — incomplete requirements
                </p>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-1">
            {STATUS_ORDER.map((step, idx) => {
                const isDone = idx < currentIdx
                const isCurrent = idx === currentIdx
                const isLast = idx === STATUS_ORDER.length - 1

                return (
                    <div key={step} className="flex items-center gap-1 flex-1 min-w-0">
                        {/* Step node */}
                        <div className="flex flex-col items-center gap-1 min-w-0">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors
                ${isDone ? 'bg-green-500 border-green-500' :
                                    isCurrent ? 'bg-blue-500 border-blue-500' :
                                        'bg-white border-stone-300'}`}
                            >
                                {isDone
                                    ? <CheckCircle size={12} strokeWidth={2.5} className="text-white" />
                                    : isCurrent
                                        ? <Circle size={8} strokeWidth={3} className="text-white fill-white" />
                                        : null
                                }
                            </div>
                            <span className={`text-[10px] text-center leading-tight hidden sm:block
                ${isCurrent ? 'text-blue-600 font-semibold' :
                                    isDone ? 'text-green-600' : 'text-stone-400'}`}
                            >
                                {step}
                            </span>
                        </div>

                        {/* Connector line */}
                        {!isLast && (
                            <div className={`h-0.5 flex-1 mb-4 rounded-full transition-colors
                ${idx < currentIdx ? 'bg-green-400' : 'bg-stone-200'}`}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

// ─── Audit Trail Entry ────────────────────────────────────────────────────────
function TrailEntry({ entry, isLast }) {
    const config = STATUSES[entry.status] || {}
    return (
        <div className="flex gap-3">
            {/* Timeline spine */}
            <div className="flex flex-col items-center shrink-0">
                <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${config.dot || 'bg-stone-300'}`} />
                {!isLast && <div className="w-px flex-1 bg-stone-200 mt-1" />}
            </div>

            {/* Content */}
            <div className={`pb-5 ${isLast ? '' : ''}`}>
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-sm font-medium text-stone-800">{entry.actor}</span>
                    <StatusBadge status={entry.status} />
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">{entry.action}</p>
                <p className="text-xs text-stone-400 mt-1">{entry.date}</p>
            </div>
        </div>
    )
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={14} strokeWidth={1.75} className="text-stone-500" />
            </div>
            <div>
                <p className="text-xs text-stone-400 leading-tight">{label}</p>
                <p className="text-sm font-medium text-stone-700 leading-tight mt-0.5">{value}</p>
            </div>
        </div>
    )
}

// ─── Document Detail ──────────────────────────────────────────────────────────
export default function DocumentDetail() {
    const { id } = useParams()
    const navigate = useNavigate()

    const doc = MOCK_DOCUMENTS.find(d => d.id === id)

    // Local state — in a real app this would call an API
    const [currentDoc, setCurrentDoc] = useState(doc)
    const [newStatus, setNewStatus] = useState('')
    const [newHandler, setNewHandler] = useState('')
    const [updateNote, setUpdateNote] = useState('')
    const [showUpdateForm, setShowUpdateForm] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')

    if (!currentDoc) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-stone-400 gap-3">
                <AlertCircle size={40} strokeWidth={1.5} className="text-stone-300" />
                <p className="text-sm font-medium">Document not found</p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-sm text-blue-600 hover:underline"
                >
                    Back to Dashboard
                </button>
            </div>
        )
    }

    // ── Handle status update ──
    function handleUpdate(e) {
        e.preventDefault()
        if (!newStatus && !updateNote) return

        const now = new Date()
        const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

        const newEntry = {
            date: dateStr,
            actor: newHandler || currentDoc.currentHandler,
            action: updateNote || `Status updated to ${newStatus}.`,
            status: newStatus || currentDoc.status,
        }

        setCurrentDoc(prev => ({
            ...prev,
            status: newStatus || prev.status,
            currentHandler: newHandler || prev.currentHandler,
            lastUpdated: dateStr.split(' ')[0],
            trail: [...prev.trail, newEntry],
        }))

        setSuccessMsg('Document updated successfully.')
        setNewStatus('')
        setNewHandler('')
        setUpdateNote('')
        setShowUpdateForm(false)
        setTimeout(() => setSuccessMsg(''), 3000)
    }

    const priorityConfig = PRIORITIES[currentDoc.priority] || {}

    return (
        <div className="p-6 max-w-5xl mx-auto">

            {/* ── Back button ── */}
            <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 mb-5 transition-colors group"
            >
                <ArrowLeft size={15} strokeWidth={2} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to Dashboard
            </button>

            {/* ── Page header ── */}
            <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {currentDoc.id}
                        </span>
                        <TypeBadge type={currentDoc.type} />
                        <PriorityBadge priority={currentDoc.priority} />
                    </div>
                    <h1 className="text-xl font-semibold text-stone-800">{currentDoc.title}</h1>
                    <p className="text-sm text-stone-500 mt-0.5">
                        Last updated: {currentDoc.lastUpdated}
                    </p>
                </div>
                <StatusBadge status={currentDoc.status} />
            </div>

            {/* ── Progress stepper ── */}
            <div className="bg-white border border-stone-200 rounded-xl p-5 mb-4">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4">
                    Progress
                </p>
                <ProgressStepper currentStatus={currentDoc.status} />
            </div>

            {/* ── Success message ── */}
            {successMsg && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
                    <CheckCircle size={15} className="text-green-600 shrink-0" />
                    <p className="text-sm text-green-700 font-medium">{successMsg}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* ── Left: Audit trail ── */}
                <div className="lg:col-span-2 space-y-4">

                    {/* Audit trail card */}
                    <div className="bg-white border border-stone-200 rounded-xl p-5">
                        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-5">
                            Audit Trail
                        </p>
                        <div>
                            {currentDoc.trail.map((entry, idx) => (
                                <TrailEntry
                                    key={idx}
                                    entry={entry}
                                    isLast={idx === currentDoc.trail.length - 1}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Update form */}
                    <div className="bg-white border border-stone-200 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                                Update Document
                            </p>
                            <button
                                onClick={() => setShowUpdateForm(v => !v)}
                                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            >
                                {showUpdateForm ? 'Cancel' : 'Add Update'}
                                {!showUpdateForm && <ChevronRight size={13} strokeWidth={2} />}
                            </button>
                        </div>

                        {showUpdateForm && (
                            <form onSubmit={handleUpdate} className="space-y-3">
                                {/* New status */}
                                <div>
                                    <label className="text-xs font-medium text-stone-600 block mb-1">
                                        New Status
                                    </label>
                                    <select
                                        value={newStatus}
                                        onChange={e => setNewStatus(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 bg-stone-50"
                                    >
                                        <option value="">— Keep current status —</option>
                                        {Object.keys(STATUSES).map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Handler */}
                                <div>
                                    <label className="text-xs font-medium text-stone-600 block mb-1">
                                        Handled By
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={currentDoc.currentHandler}
                                        value={newHandler}
                                        onChange={e => setNewHandler(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 bg-stone-50 placeholder:text-stone-400"
                                    />
                                </div>

                                {/* Note */}
                                <div>
                                    <label className="text-xs font-medium text-stone-600 block mb-1">
                                        Remarks / Action Taken
                                    </label>
                                    <textarea
                                        rows={3}
                                        placeholder="Describe what was done or what changed…"
                                        value={updateNote}
                                        onChange={e => setUpdateNote(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 bg-stone-50 placeholder:text-stone-400 resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-2 bg-stone-800 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors"
                                >
                                    Save Update
                                </button>
                            </form>
                        )}

                        {!showUpdateForm && (
                            <p className="text-xs text-stone-400">
                                Click "Add Update" to log a new action or change the document status.
                            </p>
                        )}
                    </div>
                </div>

                {/* ── Right: Document info ── */}
                <div className="space-y-4">

                    {/* Requester info */}
                    <div className="bg-white border border-stone-200 rounded-xl p-5">
                        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4">
                            Requester
                        </p>
                        <div className="space-y-3">
                            <InfoRow icon={User} label="Full Name" value={currentDoc.requester} />
                            <InfoRow icon={Phone} label="Contact" value={currentDoc.contact} />
                        </div>
                    </div>

                    {/* Document info */}
                    <div className="bg-white border border-stone-200 rounded-xl p-5">
                        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4">
                            Document Info
                        </p>
                        <div className="space-y-3">
                            <InfoRow icon={Building2} label="Assigned Office" value={currentDoc.office} />
                            <InfoRow icon={User} label="Current Handler" value={currentDoc.currentHandler} />
                            <InfoRow icon={Calendar} label="Date Submitted" value={currentDoc.dateSubmitted} />
                            <InfoRow icon={Clock} label="Last Updated" value={currentDoc.lastUpdated} />
                        </div>
                    </div>

                    {/* Notes */}
                    {currentDoc.notes && (
                        <div className="bg-white border border-stone-200 rounded-xl p-5">
                            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                                Notes
                            </p>
                            <p className="text-sm text-stone-600 leading-relaxed">{currentDoc.notes}</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}