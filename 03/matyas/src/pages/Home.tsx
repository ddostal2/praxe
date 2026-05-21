import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import { StarRating } from '../components/StarRating';

export function Home() {
  const { theme, toggleTheme } = useTheme();
  const [userIdInput, setUserIdInput] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleUserSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (userIdInput.trim()) {
      navigate(`/user/${userIdInput.trim()}`);
    }
  };

  const handleSubmitRating = () => {
    if (rating > 0) {
      console.log(`Odesláno hodnocení: ${rating}/5`);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setRating(0);
      }, 3000);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className="card">
      <h1>Vítejte na hlavní stránce!</h1>

      <button className="btn btn-primary" onClick={toggleTheme}>
        Přepnout na {isDark ? 'Světlý režim' : 'Tmavý režim'}
      </button>

      <form onSubmit={handleUserSearch} style={{ marginTop: '2rem' }}>
        <h3>Vyzkoušejte dynamické routování</h3>
        <p>Zadejte libovolné ID uživatele a klikněte na tlačítko Zobrazit.</p>
        <input
          type="text"
          className="input-field"
          placeholder="Např. 42, honza, atd."
          value={userIdInput}
          onChange={(e) => setUserIdInput(e.target.value)}
        />
        <button type="submit" className="btn btn-success">
          Zobrazit uživatele
        </button>
      </form>

      <div style={{ marginTop: '2rem' }}>
        <h3>Jak se ti líbí naše aplikace?</h3>
        <StarRating rating={rating} onRate={setRating} size={32} readOnly={isSubmitted} />
        
        {rating > 0 && !isSubmitted && (
          <button onClick={handleSubmitRating} className="btn btn-warning">
            Odeslat hodnocení ({rating}/5)
          </button>
        )}

        {isSubmitted && (
          <p style={{ color: '#10b981', fontWeight: 'bold', marginTop: '1rem' }}>
            Hodnocení bylo úspěšně odesláno! Děkujeme.
          </p>
        )}
      </div>
    </div>
  );
}
