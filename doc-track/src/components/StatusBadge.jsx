import { STATUSES, PRIORITIES } from '../data/constants.js'

// ─── StatusBadge ──────────────────────────────────────────────────────────────
// Displays a colored pill for a document's current status.
// Usage: <StatusBadge status="Under Review" />

export function StatusBadge({ status }) {
    const config = STATUSES[status]

    if (!config) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-500">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                {status}
            </span>
        )
    }

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    )
}

// ─── PriorityBadge ────────────────────────────────────────────────────────────
// Displays a small bordered pill for High / Normal / Low priority.
// Usage: <PriorityBadge priority="High" />

export function PriorityBadge({ priority }) {
    const config = PRIORITIES[priority]

    if (!config) {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border bg-stone-50 text-stone-500 border-stone-200">
                {priority}
            </span>
        )
    }

    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
        >
            {config.label}
        </span>
    )
}

// ─── TypeBadge ────────────────────────────────────────────────────────────────
// Displays a neutral pill for the document type (Permit, Certificate, etc.)
// Usage: <TypeBadge type="Permit" />

export function TypeBadge({ type }) {
    return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-stone-100 text-stone-600 border border-stone-200">
            {type}
        </span>
    )
}