import React from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App'
import './styles/styles.css'

const container = document.getElementById('root')
const root = createRoot(container)

// Client ID do Google OAuth - Use o seu próprio em produção
// Este é um Client ID público de desenvolvimento
const GOOGLE_CLIENT_ID = '891068802087-j6om9kl5oiilv9mb01m3mr06jnm24hca.apps.googleusercontent.com'

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
)
