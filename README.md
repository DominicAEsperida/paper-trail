# PaperTrail

PaperTrail is a web-based file and document tracking system designed for institutions to monitor the real-time status and movement of documents throughout internal processing workflows.

The system helps offices and departments efficiently manage, process, and track documents from submission to release while improving transparency, accountability, and processing efficiency.

---

## Features

- User authentication and role-based access
- File and document registration
- Real-time document status tracking
- Office-to-office routing system
- Tracking number generation
- Activity logs and document history
- Search and filtering functionality
- Dashboard monitoring for pending and completed documents
- Queue and processing management

---

## Document Status Workflow

- Received
- Under Review
- For Approval
- Approved
- Ready for Pickup
- Completed

---

## System Workflow

```text
Requester submits document
        ↓
Staff receives and encodes the document
        ↓
Document undergoes review and approval process
        ↓
Authorized personnel update document status
        ↓
Document is approved and prepared for release
        ↓
Requester is notified for pickup
        ↓
Document is marked as completed
```

---

## Tech Stack

### Frontend
- React
- Tailwind CSS
- JavaScript

### Backend / Database
- Supabase

---

## User Roles

### Admin
- Manage users and offices
- Monitor all document transactions
- Access reports and analytics

### Staff / Processor
- Encode and update document records
- Route documents between offices
- Update statuses and remarks

### Requester
- Track document status using tracking number
- View processing progress and history

---

## Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/papertrail.git
cd papertrail
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Start Development Server

```bash
npm run dev
```

---

## Future Improvements

- QR code tracking
- SMS and email notifications
- Digital signatures
- File attachment uploads
- Real-time updates
- Analytics dashboard
- Mobile responsiveness
- Workflow automation

---

## Purpose

PaperTrail was developed to modernize institutional document handling by replacing manual tracking processes with a centralized and transparent digital tracking system.

---

## License

This project is licensed under the MIT License.
