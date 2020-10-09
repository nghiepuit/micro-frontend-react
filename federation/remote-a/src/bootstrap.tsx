import React from 'react'
import ReactDOM from 'react-dom'

const App = React.lazy(() => import('host/App'))

ReactDOM.render(
  <React.StrictMode>
    <React.Suspense fallback={'loading app...'}>
      <App />
    </React.Suspense>
  </React.StrictMode>,
  document.querySelector('#app')
)
