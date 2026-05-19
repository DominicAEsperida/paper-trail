import { useState, useEffect, useCallback } from 'react'
import { UserPlus, RefreshCw, AlertCircle, Shield, Users as UsersIcon } from 'lucide-react'
import { getUsers, updateUserRole } from '../services/userService.js'
import { useAuth } from '../hooks/useAuth.js'
import { OFFICES, PRIORITIES } from '../data/constants.js'
import CreateUserModal from '../components/CreateUserModal.jsx'

const ROLE_CONFIG = {
    admin: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500', label: 'Admin' },
    clerk: { bg: 'bg-teal-100', text: 'text-teal-800', dot: 'bg-teal-500', label: 'Clerk' },
    officer: { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500', label: 'Officer' },
    viewer: { bg: 'bg-stone-100', text: 'text-stone-600', dot: 'bg-stone-400', label: 'Viewer' },
}

function RoleBadge({ role }) {
    const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.viewer
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    )
}

function SkeletonRow() {
    return (
        <div className="grid grid-cols-[2fr_2fr_1fr_1.5fr_1fr] gap-4 px-5 py-4 border-b border-stone-100 animate-pulse">
            <div className="h-4 bg-stone-100 rounded w-32" />
            <div className="h-4 bg-stone-100 rounded w-40" />
            <div className="h-5 bg-stone-100 rounded-full w-20" />
            <div className="h-4 bg-stone-100 rounded w-36" />
            <div className="h-4 bg-stone-100 rounded w-16" />
        </div>
    )
}

export default function Users() {
    const { profile: currentProfile, isAdmin } = useAuth()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [editRole, setEditRole] = useState('')
    const [savingId, setSavingId] = useState(null)
    const [saveError, setSaveError] = useState('')

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const data = await getUsers()
            setUsers(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchUsers() }, [fetchUsers])

    async function handleRoleUpdate(userId) {
        if (!editRole) { setEditingId(null); return }
        setSavingId(userId)
        setSaveError('')
        try {
            await updateUserRole(userId, { role: editRole })
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: editRole } : u))
            setEditingId(null)
            setEditRole('')
        } catch (err) {
            setSaveError(err.message)
        } finally {
            setSavingId(null)
        }
    }

    const total = users.length
    const admins = users.filter(u => u.role === 'admin').length
    const clerks = users.filter(u => u.role === 'clerk').length
    const officers = users.filter(u => u.role === 'officer').length
    const viewers = users.filter(u => u.role === 'viewer').length

    return (
        <div className="p-6 max-w-5xl mx-auto">

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-stone-800">User Management</h1>
                    <p className="text-sm text-stone-500 mt-0.5">Manage staff accounts and role assignments</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchUsers} disabled={loading}
                        className="p-2 rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 transition-colors disabled:opacity-40"
                        title="Refresh"
                    >
                        <RefreshCw size={15} strokeWidth={2} className={loading ? 'animate-spin' : ''} />
                    </button>
                    {isAdmin && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors"
                        >
                            <UserPlus size={15} strokeWidth={2} />
                            Add Staff
                        </button>
                    )}
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                    { label: 'Total Staff', value: total, color: 'text-stone-800' },
                    { label: 'Admins', value: admins, color: 'text-blue-700' },
                    { label: 'Clerks', value: clerks, color: 'text-teal-700' },
                    { label: 'Officers', value: officers, color: 'text-amber-700' },
                ].map(({ label, value, color }) => (
                    <div key={label} className="bg-white border border-stone-200 rounded-xl px-4 py-3">
                        {loading
                            ? <div className="h-7 w-8 bg-stone-100 rounded animate-pulse mb-1" />
                            : <p className={`text-2xl font-semibold leading-tight ${color}`}>{value}</p>
                        }
                        <p className="text-xs text-stone-500 mt-0.5">{label}</p>
                    </div>
                ))}
            </div>

            {/* Error banner */}
            {(error || saveError) && (
                <div className="flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-lg mb-5">
                    <AlertCircle size={16} className="text-red-500 shrink-0" />
                    <p className="text-sm text-red-700 font-medium">{error || saveError}</p>
                    <button onClick={() => { setError(''); setSaveError('') }} className="ml-auto text-xs text-red-600 hover:underline">Dismiss</button>
                </div>
            )}

            {/* Table */}
            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                <div className="grid grid-cols-[2fr_2fr_1fr_1.5fr_1fr] gap-4 px-5 py-3 bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    <span>Name</span>
                    <span>Email</span>
                    <span>Role</span>
                    <span>Office</span>
                    <span>Joined</span>
                </div>

                {loading && <><SkeletonRow /><SkeletonRow /><SkeletonRow /></>}

                {!loading && users.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-stone-400">
                        <UsersIcon size={32} strokeWidth={1.5} className="mb-3 text-stone-300" />
                        <p className="text-sm font-medium">No staff accounts found</p>
                    </div>
                )}

                {!loading && users.map((user, idx) => {
                    const isEditing = editingId === user.id
                    const isSaving = savingId === user.id
                    const isMe = user.id === currentProfile?.id

                    return (
                        <div
                            key={user.id}
                            className={`grid grid-cols-[2fr_2fr_1fr_1.5fr_1fr] gap-4 px-5 py-3.5 items-center border-b border-stone-100 last:border-b-0
                ${idx % 2 === 0 ? '' : 'bg-stone-50/40'}`}
                        >
                            {/* Name */}
                            <div className="flex items-center gap-2 min-w-0">
                                <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center shrink-0">
                                    <span className="text-stone-600 text-xs font-semibold">
                                        {user.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-stone-800 truncate">{user.full_name}</p>
                                    {isMe && <p className="text-xs text-blue-500">You</p>}
                                </div>
                            </div>

                            {/* Email — fetched separately since profiles don't store it */}
                            <p className="text-sm text-stone-500 truncate">—</p>

                            {/* Role — editable for admins */}
                            {isAdmin && !isMe ? (
                                isEditing ? (
                                    <div className="flex items-center gap-1">
                                        <select
                                            value={editRole}
                                            onChange={e => setEditRole(e.target.value)}
                                            className="text-xs border border-stone-200 rounded px-1.5 py-1 bg-stone-50 focus:outline-none focus:ring-1 focus:ring-stone-300"
                                            autoFocus
                                        >
                                            <option value="">— keep —</option>
                                            {['admin', 'clerk', 'officer', 'viewer'].map(r => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => handleRoleUpdate(user.id)}
                                            disabled={isSaving}
                                            className="text-xs text-green-700 font-medium hover:underline disabled:opacity-50"
                                        >
                                            {isSaving ? '…' : 'Save'}
                                        </button>
                                        <button
                                            onClick={() => { setEditingId(null); setEditRole('') }}
                                            className="text-xs text-stone-400 hover:text-stone-600"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => { setEditingId(user.id); setEditRole(user.role) }}
                                        className="text-left group"
                                        title="Click to change role"
                                    >
                                        <RoleBadge role={user.role} />
                                        <span className="text-xs text-stone-400 group-hover:text-stone-600 ml-1 transition-colors">✎</span>
                                    </button>
                                )
                            ) : (
                                <RoleBadge role={user.role} />
                            )}

                            {/* Office */}
                            <p className="text-xs text-stone-500 truncate">{user.office || '—'}</p>

                            {/* Joined date */}
                            <p className="text-xs text-stone-400">
                                {user.created_at ? new Date(user.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                            </p>
                        </div>
                    )
                })}
            </div>

            <p className="text-xs text-stone-400 mt-3 px-1">
                {total} staff member{total !== 1 ? 's' : ''} · {viewers} viewer{viewers !== 1 ? 's' : ''}
            </p>

            {/* Create user modal */}
            {showModal && (
                <CreateUserModal
                    onClose={() => setShowModal(false)}
                    onSuccess={() => { setShowModal(false); fetchUsers() }}
                />
            )}

        </div>
    )
}