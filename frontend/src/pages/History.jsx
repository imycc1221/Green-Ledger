import { useState } from 'react'
import { Inbox } from 'lucide-react'
import ReceiptResults from '../components/ReceiptResults.jsx'

/**
 * History — full list of all past uploads.
 *
 * Props:
 *   history: array of result objects (newest first)
 */
export default function History({ history }) {
  const [selected, setSelected] = useState(null)

  if (history.length === 0) {
    return (
      <div style={{ padding: '32px' }}>
        <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 600, margin: '0 0 8px' }}>History</h1>
        <div className="gl-card" style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
            <Inbox size={40} color="#333" strokeWidth={1.5} />
          </div>
          <div style={{ color: '#555', fontSize: '0.9rem' }}>No receipts uploaded yet.</div>
          <div style={{ color: '#333', fontSize: '0.8rem', marginTop: '4px' }}>Go to Dashboard to upload your first bill.</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '32px', maxWidth: '900px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>History</h1>
        <p style={{ color: '#555', fontSize: '0.875rem', margin: '4px 0 0' }}>
          {history.length} receipt{history.length > 1 ? 's' : ''} analysed this session
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.5fr' : '1fr', gap: '16px' }}>

        {/* List */}
        <div className="gl-card" style={{ padding: '16px', height: 'fit-content' }}>
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelected(selected?.id === item.id ? null : item)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '4px',
                cursor: 'pointer',
                background: selected?.id === item.id ? 'rgba(0,200,150,0.06)' : 'transparent',
                border: selected?.id === item.id ? '1px solid rgba(0,200,150,0.2)' : '1px solid transparent',
                transition: 'all 150ms',
              }}
            >
              <div>
                <div style={{ color: '#ccc', fontSize: '0.875rem', fontWeight: 500 }}>
                  {item.receipt?.vendor || item.filename}
                </div>
                <div style={{ color: '#555', fontSize: '0.75rem', marginTop: '2px' }}>
                  {item.receipt?.type} · {item.receipt?.date || '—'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#00C896', fontSize: '0.875rem', fontWeight: 600 }}>
                  {item.emissions?.total_co2e_kg?.toFixed(1)} kg
                </div>
                <div style={{ color: '#444', fontSize: '0.7rem' }}>CO₂e</div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="gl-card" style={{ padding: '20px' }}>
            <ReceiptResults result={selected} />
          </div>
        )}
      </div>
    </div>
  )
}
