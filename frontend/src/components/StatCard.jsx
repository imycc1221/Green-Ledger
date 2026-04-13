/**
 * StatCard — a glass metric card.
 *
 * Props:
 *   label: string      — ALL CAPS label above the number
 *   value: string      — the big number/metric
 *   unit?: string      — small unit suffix after value
 *   subtitle?: string  — small text below value (coloured green by default)
 *   accent?: boolean   — if true, applies green gradient top-border
 */
export default function StatCard({ label, value, unit, subtitle, accent = true }) {
  return (
    <div
      className={`gl-card ${accent ? 'gl-card-accent' : ''}`}
      style={{ padding: '16px', textAlign: 'center' }}
    >
      <div className="gl-label" style={{ marginBottom: '6px' }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px' }}>
        <span style={{ color: '#fff', fontSize: '1.75rem', fontWeight: 300, letterSpacing: '-0.02em' }}>
          {value}
        </span>
        {unit && (
          <span style={{ color: '#888', fontSize: '0.875rem' }}>{unit}</span>
        )}
      </div>
      {subtitle && (
        <div style={{ color: '#00C896', fontSize: '0.8rem', marginTop: '4px' }}>
          {subtitle}
        </div>
      )}
    </div>
  )
}
