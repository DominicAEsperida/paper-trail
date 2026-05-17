// ─── Document Statuses ────────────────────────────────────────────────────────
// Each status has a label, a Tailwind bg color, a Tailwind text color,
// and a short description of what it means in the workflow.

export const STATUSES = {
    'Received': {
        label: 'Received',
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        dot: 'bg-blue-400',
        description: 'Document has been logged and is in the queue.',
    },
    'Under Review': {
        label: 'Under Review',
        bg: 'bg-amber-100',
        text: 'text-amber-800',
        dot: 'bg-amber-400',
        description: 'Document is being evaluated by the assigned officer.',
    },
    'For Approval': {
        label: 'For Approval',
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        dot: 'bg-purple-400',
        description: 'Requirements are complete. Awaiting authorized signature.',
    },
    'Approved': {
        label: 'Approved',
        bg: 'bg-green-100',
        text: 'text-green-800',
        dot: 'bg-green-400',
        description: 'Document has been signed and approved.',
    },
    'Ready for Pickup': {
        label: 'Ready for Pickup',
        bg: 'bg-teal-100',
        text: 'text-teal-800',
        dot: 'bg-teal-400',
        description: 'Document is ready. Requester has been notified.',
    },
    'Completed': {
        label: 'Completed',
        bg: 'bg-stone-100',
        text: 'text-stone-600',
        dot: 'bg-stone-400',
        description: 'Document has been released to the requester.',
    },
    'Returned': {
        label: 'Returned',
        bg: 'bg-red-100',
        text: 'text-red-800',
        dot: 'bg-red-400',
        description: 'Document was returned due to incomplete requirements.',
    },
}

// Ordered list used for the status progression stepper in DocumentDetail
export const STATUS_ORDER = [
    'Received',
    'Under Review',
    'For Approval',
    'Approved',
    'Ready for Pickup',
    'Completed',
]

// ─── Priority Levels ──────────────────────────────────────────────────────────

export const PRIORITIES = {
    High: {
        label: 'High',
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
    },
    Normal: {
        label: 'Normal',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
    },
    Low: {
        label: 'Low',
        bg: 'bg-stone-50',
        text: 'text-stone-500',
        border: 'border-stone-200',
    },
}

// ─── Document Types ───────────────────────────────────────────────────────────
// Used to populate the type dropdown in the NewDocument form (Step 9)

export const DOCUMENT_TYPES = [
    'Permit',
    'Certificate',
    'Clearance',
    'Certification',
    'Request',
    'Application',
    'Resolution',
    'Other',
]

// ─── Offices ──────────────────────────────────────────────────────────────────
// Used to populate the office dropdown in the NewDocument form (Step 9)

export const OFFICES = [
    'Business Permits & Licensing Office',
    'Engineering Office',
    'Planning & Development Office',
    'Social Welfare Office',
    'Public Safety Office',
    'Records Management Office',
    'Office of the Secretary',
    'Health Office',
    'Treasurer\'s Office',
    'Human Resources Office',
]

// ─── Navigation Links ─────────────────────────────────────────────────────────
// Used by Sidebar.jsx (Step 5) to render nav items without hardcoding them there

export const NAV_LINKS = [
    {
        to: '/dashboard',
        label: 'Dashboard',
        icon: 'grid',         // maps to a Lucide icon name
    },
    {
        to: '/new',
        label: 'New Document',
        icon: 'file-plus',
    },
]