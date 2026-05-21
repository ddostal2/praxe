import { useParams, Link } from 'react-router-dom';

export function UserDetail() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="card">
      <h1>Detail uživatele</h1>
      <p>Byla načtena dynamická routa s parametrem:</p>
      
      <span className="highlight">{id}</span>

      <Link to="/" style={{ display: 'block', marginTop: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>
        ← Zpět na hlavní stránku
      </Link>
    </div>
  );
}
