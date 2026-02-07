import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.tsx'


const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'missing-client-id';
const GOOGLE_ADSENSE_ID = import.meta.env.VITE_GOOGLE_ADSENSE_ID;

if (GOOGLE_CLIENT_ID === 'missing-client-id') {
  console.warn('VITE_GOOGLE_CLIENT_ID is missing from .env file. Google Auth will not work.');
}

// Inject Google AdSense
if (GOOGLE_ADSENSE_ID) {
  const script = document.createElement('script');
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADSENSE_ID}`;
  script.async = true;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
