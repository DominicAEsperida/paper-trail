import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutGrid, FilePlus, FileStack, ChevronRight } from 'lucide-react'
import { NAV_LINKS } from '../data/constants.js'

const ICON_MAP = {
    'grid': LayoutGrid,
    'file-plus': FilePlus,
}

function NavItem({ to, label, icon }) {
    const Icon = ICON_MAP[icon] || FileStack

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
                size={13}
                strokeWidth={2}
                className="opacity-0 group-hover:opacity-40 transition-opacity"
            />
        </NavLink>
    )
}

export default function Sidebar() {
    const navigate = useNavigate()

    return (
        <aside className="w-56 h-screen bg-stone-900 flex flex-col shrink-0 border-r border-stone-800">

            {/* Brand / Logo */}
            <div className="px-5 py-5 border-b border-stone-800">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2.5 group cursor-pointer"
                >
                    <div className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center shrink-0">
                        <FileStack size={15} strokeWidth={2} className="text-white" />
                    </div>
                    <div className="text-left">
                        <p className="text-white text-sm font-semibold leading-tight">PaperTrail</p>
                        <p className="text-stone-500 text-xs leading-tight">Document Tracking System</p>
                    </div>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
                <p className="text-stone-600 text-xs font-semibold uppercase tracking-widest px-3 mb-2">
                    Menu
                </p>
                {NAV_LINKS.map((link) => (
                    <NavItem key={link.to} {...link} />
                ))}
            </nav>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-stone-800">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-stone-700 flex items-center justify-center shrink-0">
                        <span className="text-stone-300 text-xs font-semibold">AD</span>
                    </div>
                    <div>
                        <p className="text-stone-300 text-xs font-medium leading-tight">Admin User</p>
                        <p className="text-stone-600 text-xs leading-tight">Front Desk</p>
                    </div>
                </div>
            </div>

        </aside>
    )
}