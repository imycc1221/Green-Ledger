import { NavLink } from 'react-router-dom'
import { Leaf, LayoutDashboard, ClipboardList } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/history', label: 'History', Icon: ClipboardList },
]

export default function Sidebar() {
  return (
    <aside
      style={{
        width: '220px',
        minHeight: '100vh',
        background: 'rgba(255,255,255,0.02)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '0 20px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Leaf size={20} color="#00C896" />
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>
            GreenLedger
          </span>
        </div>
        <div style={{ color: '#555', fontSize: '0.7rem', marginTop: '3px', letterSpacing: '0.05em' }}>
          Carbon · Clarity · Action
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 12px' }}>
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '8px',
              marginBottom: '4px',
              color: isActive ? '#00C896' : '#888',
              background: isActive ? 'rgba(0,200,150,0.08)' : 'transparent',
              border: isActive ? '1px solid rgba(0,200,150,0.2)' : '1px solid transparent',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: isActive ? 600 : 400,
              transition: 'all 200ms',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={16} color={isActive ? '#00C896' : '#888'} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '0 20px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
        <div style={{ color: '#333', fontSize: '0.7rem' }}>Earth Day Hackathon 2026</div>
        <div style={{ color: '#222', fontSize: '0.65rem' }}>The Access Group · KL</div>
      </div>
    </aside>
  )
}
