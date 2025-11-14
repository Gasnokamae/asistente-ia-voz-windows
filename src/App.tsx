import React from 'react';

const App: React.FC = () => {

  const appStyle: React.CSSProperties = {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    background: 'linear-gradient(135deg, #0a0a1a, #1a1a2e, #16213e)',
    color: 'white',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    padding: '2rem',
    boxSizing: 'border-box',
    textAlign: 'center',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: 'bold',
    textShadow: '0 0 15px rgba(0, 255, 255, 0.6)',
  };

  const micButtonStyle: React.CSSProperties = {
    width: 'clamp(80px, 20vw, 120px)',
    height: 'clamp(80px, 20vw, 120px)',
    borderRadius: '50%',
    border: '3px solid rgba(0, 255, 255, 0.5)',
    background: 'rgba(0, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'rgba(0, 255, 255, 0.8)',
    padding: 0,
  };
  
  const micIconStyle: React.CSSProperties = {
    width: '50%',
    height: '50%',
    fill: 'currentColor',
  };

  const messagesContainerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '800px',
    height: '30vh',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '15px',
    padding: '1rem',
    background: 'rgba(0, 0, 0, 0.2)',
    color: '#aaa',
    overflowY: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
  };

  return (
    <div style={appStyle}>
      <h1 style={titleStyle}>Asistente de Voz</h1>
      
      <button 
        style={micButtonStyle} 
        aria-label="Activar micrófono"
      >
        <svg style={micIconStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
            <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.75 6.75 0 11-13.5 0v-1.5A.75.75 0 016 10.5z" />
        </svg>
      </button>

      <div style={messagesContainerStyle}>
        <p>Los mensajes aparecerán aquí...</p>
      </div>
    </div>
  );
};

export default App;
