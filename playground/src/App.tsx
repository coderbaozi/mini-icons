import React, { useState } from 'react'
import ReactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <div>
        <ReactLogo />
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount(count => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  )
}

export default App
