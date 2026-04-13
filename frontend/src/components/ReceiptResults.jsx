/**
 * ReceiptResults — shows the AI analysis result for one uploaded receipt.
 *
 * Props:
 *   result: {
 *     id: string,
 *     filename: string,
 *     receipt: { vendor, date, type, region, line_items, total_rm },
 *     emissions: { total_co2e_kg, scope, source, line_items },
 *     recommendations: [{ text, co2e_saving_kg, rm_saving }]
 *   }
 */
export default function ReceiptResults({ result }) {
  if (!result) return null

  const { receipt, emissions, recommendations } = result
  const emissionItems = emissions.line_items || []

  return (
    <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="scope-badge">✓ {receipt.vendor || 'Receipt'} Processed</div>
        <div style={{ color: '#555', fontSize: '0.8rem' }}>
          {receipt.date} · {receipt.type}
        </div>
      </div>

      {/* Line items table */}
      <div className="gl-card gl-card-accent" style={{ padding: '16px' }}>
        <div className="gl-label" style={{ marginBottom: '10px' }}>Extracted Line Items</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['Item', 'Qty', 'Emission Factor', 'CO₂e'].map((h) => (
                <th
                  key={h}
                  style={{
                    color: '#555',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '4px 0',
                    textAlign: h === 'Item' ? 'left' : 'right',
                    fontWeight: 600,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {emissionItems.map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ color: '#ccc', fontSize: '0.875rem', padding: '6px 0' }}>
                  {item.description}
                </td>
                <td style={{ color: '#ccc', fontSize: '0.875rem', padding: '6px 0', textAlign: 'right' }}>
                  {item.quantity} {item.unit}
                </td>
                <td style={{ color: '#555', fontSize: '0.75rem', padding: '6px 0', textAlign: 'right' }}>
                  {item.calculable && item.co2e_kg > 0
                    ? `${(item.co2e_kg / item.quantity).toFixed(4)} kg/${item.unit}`
                    : '—'}
                </td>
                <td style={{ color: item.co2e_kg > 0 ? '#00C896' : '#444', fontSize: '0.875rem', padding: '6px 0', textAlign: 'right', fontWeight: item.co2e_kg > 0 ? 600 : 400 }}>
                  {item.co2e_kg > 0 ? `${item.co2e_kg.toFixed(1)} kg` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#888', fontSize: '0.875rem' }}>Total this receipt</span>
          <span style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600 }}>
            {emissions.total_co2e_kg.toFixed(1)} kg CO₂e
          </span>
        </div>
      </div>

      {/* Scope + source */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span className="scope-badge">Scope {emissions.scope}</span>
        <span style={{ color: '#444', fontSize: '0.8rem' }}>Source: {emissions.source}</span>
      </div>

      {/* AI Recommendations */}
      <div className="gl-card" style={{ padding: '14px', background: 'rgba(0,200,150,0.03)', borderColor: 'rgba(0,200,150,0.15)' }}>
        <div style={{ color: '#00C896', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
          AI Recommendations
        </div>
        {recommendations.map((rec, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <div style={{ background: 'rgba(0,200,150,0.2)', borderRadius: '4px', padding: '2px 7px', color: '#00C896', fontSize: '0.7rem', flexShrink: 0, fontWeight: 700 }}>
              {i + 1}
            </div>
            <div style={{ color: '#ccc', fontSize: '0.875rem', lineHeight: 1.5 }}>
              {rec.text}
              {(rec.co2e_saving_kg > 0 || rec.rm_saving > 0) && (
                <span style={{ color: '#00C896', fontWeight: 600, marginLeft: '4px' }}>
                  {rec.co2e_saving_kg > 0 ? ` saves ${rec.co2e_saving_kg} kg CO₂e` : ''}
                  {rec.rm_saving > 0 ? ` & RM ${rec.rm_saving}/month` : ''}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
