import React from 'react';

const App: React.FC = () => {
  const styles: React.CSSProperties = {
    backgroundColor: 'white',
    color: 'black',
    padding: '20px',
    textAlign: 'center',
    fontSize: '24px',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'sans-serif',
  };

  return (
    <div style={styles}>
      Hola Mundo
    </div>
  );
};

export default App;
