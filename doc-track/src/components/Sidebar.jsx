import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutGrid, FilePlus, FileStack, ChevronRight, LogOut, Users } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import { supabase } from '../lib/supabaseClient.js'

const ROLE_STYLES = {
    admin: { bg: 'bg-blue-500', label: 'Admin' },
    clerk: { bg: 'bg-teal-500', label: 'Clerk' },
    officer: { bg: 'bg-amber-500', label: 'Officer' },
    viewer: { bg: 'bg-stone-500', label: 'Viewer' },
}

function NavItem({ to, label, icon: Icon }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
        ${isActive
                    ? 'bg-stone-800 text-white'
                    : 'text-stone-400 hover:bg-stone-700 hover:text-white'
                }`
            }
        >
            <Icon size={17} strokeWidth={1.75} />
            <span className="flex-1">{label}</span>
            <ChevronRight
                size={13} strokeWidth={2}
                className="opacity-0 group-hover:opacity-40 transition-opacity"
            />
        </NavLink>
    )
}

export default function Sidebar() {
    const navigate = useNavigate()
    const { profile, canCreate, isAdmin } = useAuth()

    const roleStyle = ROLE_STYLES[profile?.role] || ROLE_STYLES.viewer
    const initials = profile?.full_name
        ? profile.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : '??'

    async function handleLogout() {
        await supabase.auth.signOut()
        navigate('/login', { replace: true })
    }

    return (
        <aside className="w-56 h-screen bg-stone-900 flex flex-col shrink-0 border-r border-stone-800">

            {/* Brand */}
            <div className="px-5 py-5 border-b border-stone-800">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2.5 cursor-pointer"
                >
                    <div className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center shrink-0">
                        <FileStack size={15} strokeWidth={2} className="text-white" />
                    </div>
                    <div className="text-left">
                        <p className="text-white text-sm font-semibold leading-tight">DocTracker</p>
                        <p className="text-stone-500 text-xs leading-tight">Gov't Document System</p>
                    </div>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
                <p className="text-stone-600 text-xs font-semibold uppercase tracking-widest px-3 mb-2">
                    Menu
                </p>

                {/* Dashboard — everyone */}
                <NavItem to="/dashboard" label="Dashboard" icon={LayoutGrid} />

                {/* New Document — admin + clerk only */}
                {canCreate && (
                    <NavItem to="/new" label="New Document" icon={FilePlus} />
                )}

                {/* Admin section */}
                {isAdmin && (
                    <>
                        <p className="text-stone-600 text-xs font-semibold uppercase tracking-widest px-3 mt-4 mb-2">
                            Admin
                        </p>
                        <NavItem to="/users" label="Users" icon={Users} />
                    </>
                )}
            </nav>

            {/* User info + logout */}
            <div className="px-4 py-4 border-t border-stone-800 space-y-3">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-stone-700 flex items-center justify-center shrink-0">
                        <span className="text-stone-300 text-xs font-semibold">{initials}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-stone-300 text-xs font-medium leading-tight truncate">
                            {profile?.full_name ?? '—'}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${roleStyle.bg}`} />
                            <p className="text-stone-500 text-xs leading-tight">{roleStyle.label}</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-stone-400 hover:bg-stone-800 hover:text-white text-xs font-medium transition-colors"
                >
                    <LogOut size={14} strokeWidth={1.75} />
                    Sign Out
                </button>
            </div>

        </aside>
    )
}