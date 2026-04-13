import { useState } from 'react'
import UploadZone from '../components/UploadZone.jsx'
import ReceiptResults from '../components/ReceiptResults.jsx'
import StatCard from '../components/StatCard.jsx'

/**
 * Dashboard — upload zone + recent results + summary stats.
 *
 * Props:
 *   history: array of result objects (newest first)
 *   apiKey: string
 *   onNewResult: (result) => void
 */
export default function Dashboard({ history, apiKey, onNewResult }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeResult, setActiveResult] = useState(null)

  async function handleUpload(file) {
    if (!apiKey) {
      setError('Please enter your Claude API key in the top bar.')
      return
    }

    setLoading(true)
    setError(null)
    setActiveResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'X-API-Key': apiKey },
        body: formData,
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.detail || 'Upload failed')
      }

      const result = await response.json()
      setActiveResult(result)
      onNewResult(result)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // Compute summary stats from history
  const totalCo2e = history.reduce((sum, r) => sum + (r.emissions?.total_co2e_kg || 0), 0)
  const totalRmSavings = history.reduce(
    (sum, r) => sum + (r.recommendations || []).reduce((s, rec) => s + (rec.rm_saving || 0), 0),
    0,
  )

  return (
    <div style={{ padding: '32px', maxWidth: '900px' }}>

      {/* Page title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Dashboard</h1>
        <p style={{ color: '#555', fontSize: '0.875rem', margin: '4px 0 0' }}>
          Upload a utility bill or receipt to measure your carbon footprint
        </p>
      </div>

      {/* Summary stats — only show once we have data */}
      {history.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          <StatCard
            label="Total CO₂e"
            value={(totalCo2e / 1000).toFixed(2)}
            unit="t"
            subtitle={`from ${history.length} receipt${history.length > 1 ? 's' : ''}`}
          />
          <StatCard
            label="Receipts Processed"
            value={history.length}
            subtitle="this session"
          />
          <StatCard
            label="Savings Found"
            value={`RM ${totalRmSavings.toFixed(2)}`}
            subtitle="per month potential"
          />
        </div>
      )}

      {/* Upload zone */}
      <div style={{ marginBottom: '24px' }}>
        <UploadZone onUpload={handleUpload} loading={loading} />
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.25)', borderRadius: '8px', padding: '12px', color: '#ff6b6b', fontSize: '0.875rem', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {/* Latest analysis result */}
      {activeResult && (
        <div className="gl-card" style={{ padding: '20px' }}>
          <ReceiptResults result={activeResult} />
        </div>
      )}

      {/* Recent uploads list — only show when no active result */}
      {!activeResult && history.length > 0 && (
        <div className="gl-card" style={{ padding: '16px' }}>
          <div className="gl-label" style={{ marginBottom: '12px' }}>Recent Uploads</div>
          {history.slice(0, 5).map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveResult(item)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer',
              }}
            >
              <div>
                <div style={{ color: '#ccc', fontSize: '0.875rem' }}>
                  {item.receipt?.vendor || item.filename}
                </div>
                <div style={{ color: '#555', fontSize: '0.75rem' }}>
                  {item.receipt?.type} · {item.receipt?.date}
                </div>
              </div>
              <div style={{ color: '#00C896', fontSize: '0.875rem', fontWeight: 600 }}>
                {item.emissions?.total_co2e_kg?.toFixed(1)} kg CO₂e
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
