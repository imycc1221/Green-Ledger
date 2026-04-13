import { useRef, useState } from 'react'
import { FileUp } from 'lucide-react'

/**
 * UploadZone — drag-and-drop image upload.
 *
 * Props:
 *   onUpload: (file: File) => void   — called when user selects/drops a file
 *   loading: boolean                  — show spinner instead of zone
 */
export default function UploadZone({ onUpload, loading }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  function handleFile(file) {
    if (!file) return
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      alert('Please upload a JPEG, PNG, or WebP image.')
      return
    }
    onUpload(file)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  if (loading) {
    return (
      <div
        style={{
          background: 'rgba(0,200,150,0.04)',
          border: '1.5px dashed rgba(0,200,150,0.3)',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
        }}
      >
        <div
          className="animate-spin"
          style={{
            width: '32px',
            height: '32px',
            border: '2px solid rgba(0,200,150,0.2)',
            borderTopColor: '#00C896',
            borderRadius: '50%',
            margin: '0 auto 12px',
          }}
        />
        <div style={{ color: '#00C896', fontWeight: 600, fontSize: '0.9rem' }}>
          Analysing receipt...
        </div>
        <div style={{ color: '#555', fontSize: '0.8rem', marginTop: '4px' }}>
          Claude is reading your bill
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      style={{
        background: dragging ? 'rgba(0,200,150,0.08)' : 'rgba(0,200,150,0.03)',
        border: `1.5px dashed ${dragging ? 'rgba(0,200,150,0.6)' : 'rgba(0,200,150,0.3)'}`,
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 200ms',
      }}
    >
      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
        <FileUp size={32} color="#00C896" strokeWidth={1.5} />
      </div>
      <div style={{ color: '#00C896', fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>
        Drop TNB bill or receipt here
      </div>
      <div style={{ color: '#555', fontSize: '0.8rem', marginBottom: '16px' }}>
        JPEG · PNG · WebP — AI reads it in seconds
      </div>
      <button className="btn-green" style={{ margin: '0 auto' }}>
        Browse files
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  )
}
