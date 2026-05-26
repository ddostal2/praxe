import { Link } from 'react-router-dom';
import '../styles/PageShared.css';
import './CartPage.css';

const CartPage = () => {
  return (
    <div className="page-container cart-page">
      <header className="page-header">
        <h1>Košík</h1>
        <p>Váš košík je prázdný. Přidejte produkty z katalogu.</p>
      </header>

      <div className="page-panel cart-page__empty">
        <p>Zatím nemáte žádné položky v košíku.</p>
        <Link to="/products" className="page-btn page-btn--primary">
          Prohlédnout produkty
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
