import { Link, useLocation } from 'react-router-dom';
import '../styles/PageShared.css';
import './OrderConfirmationPage.css';

const formatDateTime = (isoString) => {
  if (!isoString) return '-';
  return new Date(isoString).toLocaleString('cs-CZ');
};

const OrderConfirmationPage = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="page-container order-confirmation">
        <header className="page-header">
          <h1>Potvrzení objednávky</h1>
          <p>Objednávka nebyla nalezena. Pravděpodobně jste stránku otevřeli přímo.</p>
        </header>

        <div className="page-panel order-confirmation__fallback">
          <Link to="/cart" className="page-btn page-btn--primary">
            Zpět do košíku
          </Link>
          <Link to="/products" className="page-btn page-btn--secondary">
            Pokračovat v nákupu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container order-confirmation">
      <header className="page-header">
        <h1>Potvrzení objednávky</h1>
        <p>Děkujeme za objednávku. Níže najdete její přehled.</p>
      </header>

      <section className="page-panel order-confirmation__meta">
        <div>
          <h2>Číslo objednávky</h2>
          <p>{order.id}</p>
        </div>
        <div>
          <h2>Datum</h2>
          <p>{formatDateTime(order.createdAt)}</p>
        </div>
        <div>
          <h2>Položky</h2>
          <p>{order.totalItems}</p>
        </div>
        <div>
          <h2>Celkem</h2>
          <p>${order.totalPrice.toFixed(2)}</p>
        </div>
      </section>

      <section className="page-panel order-confirmation__items">
        <h2>Detail objednávky</h2>
        <ul className="order-items">
          {order.items.map((item) => (
            <li key={item.productId} className="order-items__item">
              <div>
                <p className="order-items__name">{item.name}</p>
                <p className="order-items__category">{item.category}</p>
              </div>
              <div className="order-items__pricing">
                <p>{item.quantity}x ${item.unitPrice.toFixed(2)}</p>
                <strong>${item.lineTotal.toFixed(2)}</strong>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="page-actions">
        <Link to="/products" className="page-btn page-btn--primary">
          Dokončit nákup
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
