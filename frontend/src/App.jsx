import React, { useEffect } from 'react';
import { testApi } from './services/auth.service';

function App() {
  useEffect(() => {
    // Test de connexion API au chargement
    testApi()
      .then(data => console.log('✅ API Connection Success:', data))
      .catch(error => console.error('❌ API Connection Failed:', error.message));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>E-Voting System</h1>
      <p>Check console (F12) for API connection status</p>
      <div id="status">Testing API connection...</div>
    </div>
  );
}

export default App;