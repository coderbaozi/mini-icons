import React, { useState } from 'react'
import ReactLogo from './assets/react.svg'
import Boom from './assets/boom.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <ReactLogo style={{ width: 30, height: 30 }} />
      <Boom style={{ width: 30, height: 30 }} />
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
