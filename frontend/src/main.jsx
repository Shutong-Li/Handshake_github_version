/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css_files/index.css'
import App from './jsx_files/App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
