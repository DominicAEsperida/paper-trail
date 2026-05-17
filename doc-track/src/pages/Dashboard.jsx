import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, FilePlus, FileStack, Clock, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react'
import { MOCK_DOCUMENTS } from '../data/mockDocuments.js'
import { STATUSES } from '../data/constants.js'
import { StatusBadge, PriorityBadge, TypeBadge } from '../components/StatusBadge.jsx'

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, iconColor, iconBg }) {
    return (
        <div className="bg-white rounded-xl border border-stone-200 px-5 py-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
                <Icon size={18} strokeWidth={1.75} className={iconColor} />
            </div>
            <div>
                <p className="text-2xl font-semibold text-stone-800 leading-tight">{value}</p>
                <p className="text-xs text-stone-500 mt-0.5">{label}</p>
            </div>
        </div>
    )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState('All')
    const [filterType, setFilterType] = useState('All')

    // ── Derived stats ──
    const total = MOCK_DOCUMENTS.length
    const inProgress = MOCK_DOCUMENTS.filter(d =>
        ['Received', 'Under Review', 'For Approval'].includes(d.status)
    ).length
    const readyForPickup = MOCK_DOCUMENTS.filter(d => d.status === 'Ready for Pickup').length
    const returned = MOCK_DOCUMENTS.filter(d => d.status === 'Returned').length
    const completed = MOCK_DOCUMENTS.filter(d => d.status === 'Completed').length

    // ── Filter & search ──
    const allStatuses = ['All', ...Object.keys(STATUSES)]
    const allTypes = ['All', ...new Set(MOCK_DOCUMENTS.map(d => d.type))]

    const filtered = MOCK_DOCUMENTS.filter(doc => {
        const matchesSearch =
            doc.id.toLowerCase().includes(search.toLowerCase()) ||
            doc.title.toLowerCase().includes(search.toLowerCase()) ||
            doc.requester.toLowerCase().includes(search.toLowerCase())
        const matchesStatus = filterStatus === 'All' || doc.status === filterStatus
        const matchesType = filterType === 'All' || doc.type === filterType
        return matchesSearch && matchesStatus && matchesType
    })

    return (
        <div className="p-6 max-w-7xl mx-auto">

            {/* ── Header ── */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-stone-800">Dashboard</h1>
                    <p className="text-sm text-stone-500 mt-0.5">
                        Track and manage all incoming documents
                    </p>
                </div>
                <button
                    onClick={() => navigate('/new')}
                    className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors"
                >
                    <FilePlus size={15} strokeWidth={2} />
                    New Document
                </button>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <StatCard
                    label="Total Documents"
                    value={total}
                    icon={FileStack}
                    iconBg="bg-blue-50"
                    iconColor="text-blue-600"
                />
                <StatCard
                    label="In Progress"
                    value={inProgress}
                    icon={Clock}
                    iconBg="bg-amber-50"
                    iconColor="text-amber-600"
                />
                <StatCard
                    label="Ready for Pickup"
                    value={readyForPickup}
                    icon={CheckCircle}
                    iconBg="bg-teal-50"
                    iconColor="text-teal-600"
                />
                <StatCard
                    label="Returned / Issues"
                    value={returned + completed}
                    icon={RotateCcw}
                    iconBg="bg-stone-50"
                    iconColor="text-stone-500"
                />
            </div>

            {/* ── Filters ── */}
            <div className="bg-white border border-stone-200 rounded-xl p-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-3">

                    {/* Search */}
                    <div className="relative flex-1">
                        <Search
                            size={15}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                            strokeWidth={2}
                        />
                        <input
                            type="text"
                            placeholder="Search by ID, title, or requester…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 bg-stone-50 placeholder:text-stone-400"
                        />
                    </div>

                    {/* Status filter */}
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className="px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 bg-stone-50 text-stone-700 cursor-pointer"
                    >
                        {allStatuses.map(s => (
                            <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
                        ))}
                    </select>

                    {/* Type filter */}
                    <select
                        value={filterType}
                        onChange={e => setFilterType(e.target.value)}
                        className="px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 bg-stone-50 text-stone-700 cursor-pointer"
                    >
                        {allTypes.map(t => (
                            <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>
                        ))}
                    </select>

                </div>
            </div>

            {/* ── Document Table ── */}
            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">

                {/* Table header */}
                <div className="grid grid-cols-[1fr_1.6fr_1.2fr_1.1fr_1.1fr_0.7fr] gap-4 px-5 py-3 bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    <span>Doc ID</span>
                    <span>Title</span>
                    <span>Requester</span>
                    <span>Status</span>
                    <span>Office</span>
                    <span>Priority</span>
                </div>

                {/* Table rows */}
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-stone-400">
                        <AlertCircle size={32} strokeWidth={1.5} className="mb-3 text-stone-300" />
                        <p className="text-sm font-medium">No documents found</p>
                        <p className="text-xs mt-1">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    filtered.map((doc, idx) => (
                        <div
                            key={doc.id}
                            onClick={() => navigate(`/documents/${doc.id}`)}
                            className={`grid grid-cols-[1fr_1.6fr_1.2fr_1.1fr_1.1fr_0.7fr] gap-4 px-5 py-3.5 items-center cursor-pointer hover:bg-stone-50 transition-colors border-b border-stone-100 last:border-b-0
                ${idx % 2 === 0 ? '' : 'bg-stone-50/40'}`}
                        >
                            {/* Doc ID */}
                            <span className="text-xs font-mono font-medium text-blue-600 whitespace-nowrap">
                                {doc.id}
                            </span>

                            {/* Title + type */}
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-stone-800 truncate">{doc.title}</p>
                                <TypeBadge type={doc.type} />
                            </div>

                            {/* Requester */}
                            <div className="min-w-0">
                                <p className="text-sm text-stone-700 truncate">{doc.requester}</p>
                                <p className="text-xs text-stone-400 truncate">{doc.contact}</p>
                            </div>

                            {/* Status */}
                            <StatusBadge status={doc.status} />

                            {/* Office */}
                            <p className="text-xs text-stone-500 truncate">{doc.office}</p>

                            {/* Priority */}
                            <PriorityBadge priority={doc.priority} />
                        </div>
                    ))
                )}
            </div>

            {/* ── Result count ── */}
            <p className="text-xs text-stone-400 mt-3 px-1">
                Showing {filtered.length} of {total} documents
            </p>

        </div>
    )
}