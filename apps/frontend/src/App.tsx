import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Borrowers from './pages/Borrowers'
import Loans from './pages/Loans'
import Transactions from './pages/Transactions'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/borrowers" element={<Borrowers />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<div style={{padding:16}}><h2>Not Found</h2></div>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
