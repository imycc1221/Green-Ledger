import { useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import History from './pages/History.jsx'

const LS_KEY_HISTORY = 'greenledger_history'
const LS_KEY_APIKEY = 'greenledger_apikey'

export default function App() {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY_HISTORY) || '[]')
    } catch {
      return []
    }
  })

  const [apiKey, setApiKey] = useState(() => localStorage.getItem(LS_KEY_APIKEY) || '')
  const [showApiKey, setShowApiKey] = useState(false)

  // Persist history to localStorage
  useEffect(() => {
    localStorage.setItem(LS_KEY_HISTORY, JSON.stringify(history))
  }, [history])

  // Persist API key to localStorage
  useEffect(() => {
    localStorage.setItem(LS_KEY_APIKEY, apiKey)
  }, [apiKey])

  function handleNewResult(result) {
    setHistory((prev) => [result, ...prev])
  }

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'auto' }}>

          {/* Top bar — API key input */}
          <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '14px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', gap: '12px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 10 }}>
            <div style={{ color: '#555', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Claude API Key
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${apiKey ? 'rgba(0,200,150,0.35)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '6px',
                  padding: '6px 36px 6px 10px',
                  color: '#ccc',
                  fontSize: '0.8rem',
                  width: '240px',
                  outline: 'none',
                }}
              />
              <button
                onClick={() => setShowApiKey((v) => !v)}
                style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: '12px' }}
              >
                {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {apiKey && (
              <div style={{ background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.25)', borderRadius: '4px', padding: '4px 8px', color: '#00C896', fontSize: '0.7rem', fontWeight: 600 }}>
                ✓ Key set
              </div>
            )}
          </header>

          {/* Main content */}
          <main style={{ flex: 1 }}>
            <Routes>
              <Route
                path="/"
                element={<Dashboard history={history} apiKey={apiKey} onNewResult={handleNewResult} />}
              />
              <Route
                path="/history"
                element={<History history={history} />}
              />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
