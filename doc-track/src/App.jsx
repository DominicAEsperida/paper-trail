import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import DocumentDetail from './pages/DocumentDetail.jsx'
import NewDocument from './pages/NewDocument.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-stone-100 overflow-hidden">

        {/* Sidebar — fixed left navigation */}
        <Sidebar />

        {/* Main content area — scrollable */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/documents/:id" element={<DocumentDetail />} />
            <Route path="/new" element={<NewDocument />} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  )
}