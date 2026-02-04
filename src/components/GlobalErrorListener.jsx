'use client';

import { useEffect } from 'react';

export default function GlobalErrorListener() {
  useEffect(() => {
    // Handler for resource loading errors (captured: true)
    const handleResourceError = (event) => {
      // Check if the error is from a script or link tag failing to load
      if (
        event?.target?.tagName === 'SCRIPT' ||
        event?.target?.tagName === 'LINK'
      ) {
        const src = event.target.src || event.target.href;
        if (src && src.includes('_next/static/chunks')) {
          console.error(`Chunk load failed: ${src}. Reloading page...`);
          // Mark in session storage to prevent infinite reload loops if server is truly broken
          const lastReload = sessionStorage.getItem('chunk_reload_ts');
          const now = Date.now();
          
          // Allow 1 reload every 10 seconds to avoid spamming if server is permanently down
          if (!lastReload || now - parseInt(lastReload) > 10000) {
            sessionStorage.setItem('chunk_reload_ts', now.toString());
            window.location.reload(true);
          }
        }
      }
    };

    // Handler for uncaught runtime errors (bubbling)
    const handleWindowError = (event) => {
        // Some browsers report ChunkLoadError as a global error message
        if (event?.message?.includes('Loading chunk') || event?.message?.includes('Cloudflare') || event?.message?.toLowerCase().includes('unexpected token')) {
             const lastReload = sessionStorage.getItem('chunk_reload_ts');
             const now = Date.now();
             if (!lastReload || now - parseInt(lastReload) > 10000) {
                sessionStorage.setItem('chunk_reload_ts', now.toString());
                window.location.reload(true);
             }
        }
    }

    window.addEventListener('error', handleResourceError, true); // Capture phase for resources
    window.addEventListener('error', handleWindowError); // Bubble phase for runtime
    
    return () => {
      window.removeEventListener('error', handleResourceError, true);
      window.removeEventListener('error', handleWindowError);
    };
  }, []);

  return null;
}
