function App() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: '300',
        color: '#1a1a1a',
        marginBottom: '10px'
      }}>
        Čistá stránka
      </h1>
      <p style={{
        color: '#666',
        fontSize: '1.1rem'
      }}>
        Můžete začít psát svůj kód v <code>src/App.jsx</code>.
      </p>
    </div>
  )
}

export default App
