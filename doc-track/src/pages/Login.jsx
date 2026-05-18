import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileStack, Eye, EyeOff, AlertCircle, RefreshCw } from 'lucide-react'
import { supabase } from '../lib/supabaseClient.js'

export default function Login() {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleLogin(e) {
        e.preventDefault()

        if (!email || !password) {
            setError('Please enter your email and password.')
            return
        }

        try {
            setLoading(true)
            setError('')

            console.log("Attempting login...")

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            console.log("LOGIN RESPONSE:", data, error)

            if (error) {
                throw error
            }

            navigate('/dashboard', { replace: true })

        } catch (err) {
            console.error(err)
            setError(err.message || 'Login failed.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
            <div className="w-full max-w-sm">

                {/* Brand */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-stone-800 flex items-center justify-center mb-3">
                        <FileStack size={22} strokeWidth={1.75} className="text-white" />
                    </div>
                    <h1 className="text-xl font-semibold text-stone-800">PaperTrail</h1>
                    <p className="text-sm text-stone-500 mt-1">Document Tracking System</p>
                </div>

                {/* Card */}
                <div className="bg-white border border-stone-200 rounded-2xl p-7 shadow-sm">
                    <h2 className="text-base font-semibold text-stone-800 mb-1">Sign in to your account</h2>
                    <p className="text-xs text-stone-500 mb-6">Use your institutional email address.</p>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                            <AlertCircle size={14} className="text-red-500 shrink-0" />
                            <p className="text-xs text-red-700">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">

                        {/* Email */}
                        <div>
                            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide block mb-1.5">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="you@doctracker.gov.ph"
                                value={email}
                                onChange={e => { setEmail(e.target.value); setError('') }}
                                className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 bg-stone-50 placeholder:text-stone-400"
                                autoComplete="email"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide block mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => { setPassword(e.target.value); setError('') }}
                                    className="w-full px-3 py-2.5 pr-10 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 bg-stone-50 placeholder:text-stone-400"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                                >
                                    {showPass
                                        ? <EyeOff size={15} strokeWidth={1.75} />
                                        : <Eye size={15} strokeWidth={1.75} />
                                    }
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-stone-800 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                        >
                            {loading
                                ? <><RefreshCw size={14} strokeWidth={2} className="animate-spin" /> Signing in…</>
                                : 'Sign In'
                            }
                        </button>

                    </form>
                </div>

                {/* Footer note */}
                <p className="text-center text-xs text-stone-400 mt-5">
                    Access is restricted to authorized staff only.
                    <br />Contact your administrator for access.
                </p>

            </div>
        </div>
    )
}