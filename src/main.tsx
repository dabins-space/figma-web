// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'           // <- 파일 구조에 따라 './App/App' 일 수도 있음
import './styles/globals.css'              // 필요 시 styles에서 메인 CSS를 import

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)