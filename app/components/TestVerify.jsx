// app/components/TestVerify.jsx
'use client'
import { useState } from 'react'

export default function TestVerify() {
  const [name, setName] = useState('ACME LTD')
  const [res, setRes]   = useState(null)
  const [loading, setL] = useState(false)

  async function go() {
    setL(true)
    const r = await fetch('/api/cop', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name }),
    })
    setRes(await r.json())
    setL(false)
  }

  return (
    <div style={{padding:20}}>
      <input value={name} onChange={e=>setName(e.target.value)} />
      <button onClick={go} disabled={loading}>
        {loading?'Checking…':'Verify CoP'}
      </button>
      <pre style={{marginTop:10}}>{JSON.stringify(res,null,2)}</pre>
    </div>
  )
}
