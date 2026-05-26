import { Link } from 'react-router-dom';
import '../styles/PageShared.css';
import './HomePage.css';

/**
 * Úvodní stránka obchodu.
 * @component
 */
const HomePage = () => {
  return (
    <div className="page-container home-page">
      <header className="page-header">
        <p className="page-eyebrow">Prémiové produkty online</p>
        <h1>Váš obchod na jednom místě</h1>
        <p>
          Prohlédněte si katalog, filtrujte podle kategorie a objevte produkty
          během pár kliknutí.
        </p>
        <div className="page-actions" style={{ marginTop: '1.5rem' }}>
          <Link to="/products" className="page-btn page-btn--primary">
            Prohlédnout produkty
          </Link>
          <Link to="/contact" className="page-btn page-btn--secondary">
            Kontaktujte nás
          </Link>
        </div>
      </header>

      <section className="home-features page-grid" aria-label="Proč nakupovat u nás">
        <article className="page-panel home-feature">
          <h2>Široký výběr</h2>
          <p>Elektronika, oblečení i doplňky — vše na jednom místě s přehlednými filtry.</p>
        </article>
        <article className="page-panel home-feature">
          <h2>Rychlý nákup</h2>
          <p>Prohlédněte si detaily produktu a přidejte si oblíbené položky jedním kliknutím.</p>
        </article>
        <article className="page-panel home-feature">
          <h2>Podpora zákazníků</h2>
          <p>Máte dotaz? Kontaktujte naše prodejny nebo zákaznickou linku — rádi poradíme.</p>
        </article>
      </section>

      <section className="page-panel home-cta">
        <h2>Připraveni nakupovat?</h2>
        <p>Prohlédněte si celý katalog a vyzkoušejte filtry podle kategorie a ceny.</p>
        <Link to="/products" className="page-btn page-btn--primary">
          Do obchodu
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
