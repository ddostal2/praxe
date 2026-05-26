import { Link } from 'react-router-dom';
import './HomePage.css';

/**
 * Úvodní stránka obchodu s kávou.
 * @component
 */
const HomePage = () => {
  return (
    <div className="home">
      <section className="home-hero">
        <p className="home-hero__eyebrow">Prémiová káva a vybavení</p>
        <h1>Vaše každodenní kávová zastávka</h1>
        <p className="home-hero__lead">
          Vybíráme zrnkovou kávu z celého světa, kávovary pro domácí baristy i příslušenství,
          které vám pomůže připravit šálek, na který se budete těšit.
        </p>
        <div className="home-hero__actions">
          <Link to="/products" className="home-btn home-btn--primary">
            Prohlédnout produkty
          </Link>
          <Link to="/contact" className="home-btn home-btn--secondary">
            Kontaktujte nás
          </Link>
        </div>
      </section>

      <section className="home-features" aria-label="Proč nakupovat u nás">
        <article className="home-feature">
          <h2>Čerstvě pražená káva</h2>
          <p>Jednodruhové arabiky i směsi s jasným chuťovým profilem a datumem pražení.</p>
        </article>
        <article className="home-feature">
          <h2>Vybavení pro domácí přípravu</h2>
          <p>Od pákových kávovarů po drippery, mlýnky a přesné váhy pro konzistentní výsledek.</p>
        </article>
        <article className="home-feature">
          <h2>Poradenství na místě</h2>
          <p>Rádi vám poradíme s výběrem zrn, hrubostí mletí i nastavením přístroje.</p>
        </article>
      </section>

      <section className="home-cta">
        <h2>Připraveni na další šálek?</h2>
        <p>Prohlédněte si celý katalog — filtrujte podle kategorie a najděte, co vám sedne.</p>
        <Link to="/products" className="home-btn home-btn--primary">
          Do obchodu
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
