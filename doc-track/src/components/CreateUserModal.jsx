import { useState } from 'react'
import { X, UserPlus, RefreshCw, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { createUser } from '../services/userService.js'
import { OFFICES } from '../data/constants.js'

const EMPTY_FORM = {
    full_name: '',
    email: '',
    password: '',
    role: 'viewer',
    office: '',
}

const ROLE_DESCRIPTIONS = {
    admin: 'Full access — can create users and manage everything',
    clerk: 'Can create and update documents',
    officer: 'Can update document status only',
    viewer: 'Read-only access to all documents',
}

function inputClass(hasError) {
    return `w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 bg-stone-50 placeholder:text-stone-400 transition-colors
    ${hasError ? 'border-red-300 focus:ring-red-200 bg-red-50' : 'border-stone-200 focus:ring-stone-300'}`
}

export default function CreateUserModal({ onClose, onSuccess }) {
    const [form, setForm] = useState(EMPTY_FORM)
    const [errors, setErrors] = useState({})
    const [showPass, setShowPass] = useState(false)
    const [saving, setSaving] = useState(false)
    const [saveError, setSaveError] = useState('')
    const [done, setDone] = useState(false)

    function handleChange(field, value) {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
    }

    function validate() {
        const e = {}
        if (!form.full_name.trim()) e.full_name = 'Full name is required.'
        if (!form.email.trim()) e.email = 'Email address is required.'
        if (!form.email.includes('@')) e.email = 'Enter a valid email address.'
        if (!form.password.trim()) e.password = 'Password is required.'
        if (form.password.length < 8) e.password = 'Password must be at least 8 characters.'
        return e
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length > 0) { setErrors(errs); return }

        setSaving(true)
        setSaveError('')

        try {
            await createUser({
                email: form.email.trim(),
                password: form.password,
                full_name: form.full_name.trim(),
                role: form.role,
                office: form.office || null,
            })
            setDone(true)
        } catch (err) {
            setSaveError(err.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        // Backdrop
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
            onClick={e => { if (e.target === e.currentTarget) onClose() }}
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-stone-800 rounded-lg flex items-center justify-center">
                            <UserPlus size={15} strokeWidth={1.75} className="text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-stone-800">Add Staff Account</p>
                            <p className="text-xs text-stone-500">Create a new user with a role</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors">
                        <X size={16} strokeWidth={2} />
                    </button>
                </div>

                {/* Success state */}
                {done ? (
                    <div className="px-6 py-10 flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle size={24} strokeWidth={1.75} className="text-green-600" />
                        </div>
                        <p className="text-base font-semibold text-stone-800 mb-1">Account created</p>
                        <p className="text-sm text-stone-500 mb-1">
                            <span className="font-medium text-stone-700">{form.full_name}</span> can now log in as
                        </p>
                        <p className="text-sm font-medium text-blue-600 mb-6">{form.email}</p>
                        <div className="flex gap-3 w-full">
                            <button
                                onClick={() => { setForm(EMPTY_FORM); setDone(false) }}
                                className="flex-1 py-2.5 border border-stone-200 text-stone-700 text-sm font-medium rounded-lg hover:bg-stone-50 transition-colors"
                            >
                                Add Another
                            </button>
                            <button
                                onClick={onSuccess}
                                className="flex-1 py-2.5 bg-stone-800 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

                        {/* Save error */}
                        {saveError && (
                            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-red-700">{saveError}</p>
                            </div>
                        )}

                        {/* Full name */}
                        <div>
                            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide block mb-1.5">
                                Full Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Maria Santos"
                                value={form.full_name}
                                onChange={e => handleChange('full_name', e.target.value)}
                                className={inputClass(errors.full_name)}
                            />
                            {errors.full_name && <p className="text-xs text-red-500 mt-1">{errors.full_name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide block mb-1.5">
                                Email Address <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="email"
                                placeholder="e.g. msantos@doctracker.gov.ph"
                                value={form.email}
                                onChange={e => handleChange('email', e.target.value)}
                                className={inputClass(errors.email)}
                            />
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide block mb-1.5">
                                Password <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="Min. 8 characters"
                                    value={form.password}
                                    onChange={e => handleChange('password', e.target.value)}
                                    className={inputClass(errors.password) + ' pr-10'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                                >
                                    {showPass ? <EyeOff size={15} strokeWidth={1.75} /> : <Eye size={15} strokeWidth={1.75} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                        </div>

                        {/* Role */}
                        <div>
                            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide block mb-1.5">
                                Role <span className="text-red-400">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {['admin', 'clerk', 'officer', 'viewer'].map(r => (
                                    <button
                                        key={r} type="button"
                                        onClick={() => handleChange('role', r)}
                                        className={`text-left px-3 py-2.5 rounded-lg border text-xs transition-colors
                      ${form.role === r
                                                ? 'bg-stone-800 text-white border-stone-800'
                                                : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-300'
                                            }`}
                                    >
                                        <p className="font-semibold capitalize mb-0.5">{r}</p>
                                        <p className={`leading-tight ${form.role === r ? 'text-stone-300' : 'text-stone-400'}`}>
                                            {ROLE_DESCRIPTIONS[r]}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Office */}
                        <div>
                            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide block mb-1.5">
                                Assigned Office
                            </label>
                            <select
                                value={form.office}
                                onChange={e => handleChange('office', e.target.value)}
                                className={inputClass(false)}
                            >
                                <option value="">— Not assigned —</option>
                                {OFFICES.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-1">
                            <button
                                type="button" onClick={onClose}
                                className="px-4 py-2.5 border border-stone-200 text-stone-600 text-sm font-medium rounded-lg hover:bg-stone-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit" disabled={saving}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-stone-800 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors disabled:opacity-50"
                            >
                                {saving
                                    ? <><RefreshCw size={14} strokeWidth={2} className="animate-spin" /> Creating…</>
                                    : <><UserPlus size={14} strokeWidth={2} /> Create Account</>
                                }
                            </button>
                        </div>

                    </form>
                )}
            </div>
        </div>
    )
}