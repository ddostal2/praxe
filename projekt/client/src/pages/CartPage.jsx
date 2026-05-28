import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { CATEGORY_TRANSLATIONS } from './ProductsPage.jsx';
import '../styles/PageShared.css';
import '../styles/CartPage.css';

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    products,
    totalItems,
    totalPrice,
    loading,
    error,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const orderItems = useMemo(
    () =>
      cartItems
        .map((item) => {
          const product = products.find(
            (p) => String(p.id) === String(item.productId)
          );
          if (!product) return null;

          return {
            productId: String(product.id),
            name: product.title,
            category:
              CATEGORY_TRANSLATIONS[product.category] || product.category,
            unitPrice: product.price,
            quantity: item.quantity,
            lineTotal: product.price * item.quantity,
          };
        })
        .filter(Boolean),
    [cartItems, products]
  );

  const handleCheckout = () => {
    if (orderItems.length === 0) return;

    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      items: orderItems,
      totalItems,
      totalPrice,
    };

    clearCart();
    navigate('/order-confirmation', { state: { order } });
  };

  if (loading) {
    return (
      <div className="page-container cart-page">
        <header className="page-header">
          <h1>Košík</h1>
          <div className="skeleton" style={{ width: '150px', height: '1.2rem', margin: '0.5rem auto 0' }}></div>
        </header>

        <div className="cart-layout">
          <ul className="cart-list">
            {Array.from({ length: 2 }).map((_, i) => (
              <li key={i} className="cart-item page-panel" style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
                <div className="skeleton" style={{ width: '120px', height: '120px', borderRadius: '12px', flexShrink: 0 }}></div>
                <div className="cart-item__info" style={{ flexGrow: 1 }}>
                  <div className="skeleton" style={{ width: '80px', height: '1rem', marginBottom: '0.5rem' }}></div>
                  <div className="skeleton skeleton-title" style={{ width: '60%', height: '1.5rem', marginBottom: '0.5rem' }}></div>
                  <div className="skeleton" style={{ width: '100px', height: '1.2rem' }}></div>
                </div>
                <div className="cart-item__controls" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <div className="skeleton" style={{ width: '100px', height: '2.5rem', borderRadius: '20px' }}></div>
                  <div className="skeleton" style={{ width: '80px', height: '1.5rem' }}></div>
                  <div className="skeleton" style={{ width: '80px', height: '2rem', borderRadius: '8px' }}></div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="cart-summary page-panel">
            <h2>Shrnutí</h2>
            <dl className="cart-summary__rows">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div className="skeleton" style={{ width: '60px', height: '1.2rem' }}></div>
                <div className="skeleton" style={{ width: '40px', height: '1.2rem' }}></div>
              </div>
              <div className="cart-summary__total-row" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                <div className="skeleton" style={{ width: '80px', height: '1.5rem' }}></div>
                <div className="skeleton" style={{ width: '100px', height: '1.5rem' }}></div>
              </div>
            </dl>
            <div className="skeleton" style={{ width: '100%', height: '3rem', borderRadius: '50px', marginBottom: '1rem' }}></div>
            <div className="cart-summary__actions" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="skeleton" style={{ width: '100%', height: '2.5rem', borderRadius: '50px' }}></div>
              <div className="skeleton" style={{ width: '100%', height: '2.5rem', borderRadius: '50px' }}></div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container cart-page">
        <header className="page-header">
          <h1>Košík</h1>
          <p style={{ color: '#c0392b' }}>{error}</p>
        </header>
      </div>
    );
  }

  if (totalItems === 0) {
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
  }

  return (
    <div className="page-container cart-page">
      <header className="page-header">
        <h1>Košík</h1>
        <p>
          {totalItems}{' '}
          {totalItems === 1
            ? 'položka'
            : totalItems >= 2 && totalItems <= 4
              ? 'položky'
              : 'položek'}{' '}
          · celkem ${totalPrice.toFixed(2)}
        </p>
      </header>

      <div className="cart-layout">
        <ul className="cart-list">
          {cartItems.map((item) => {
            const product = products.find((p) => String(p.id) === String(item.productId));
            if (!product) return null;

            const category =
              CATEGORY_TRANSLATIONS[product.category] || product.category;

            return (
              <li key={item.productId} className="cart-item page-panel">
                <Link
                  to={`/products/${product.id}`}
                  className="cart-item__image-link"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="cart-item__image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        'https://placehold.co/120x120/eaeaea/666666?text=?';
                    }}
                  />
                </Link>

                <div className="cart-item__info">
                  {category && (
                    <span className="cart-item__category">{category}</span>
                  )}
                  <Link to={`/products/${product.id}`} className="cart-item__name">
                    {product.title}
                  </Link>
                  <p className="cart-item__price">${product.price} / ks</p>
                </div>

                <div className="cart-item__controls">
                  <div className="cart-qty" aria-label={`Množství: ${product.title}`}>
                    <button
                      type="button"
                      className="cart-qty__btn"
                      onClick={() =>
                        item.quantity <= 1
                          ? removeFromCart(item.productId)
                          : updateQuantity(item.productId, item.quantity - 1)
                      }
                      aria-label="Snížit množství"
                    >
                      −
                    </button>
                    <span className="cart-qty__value">{item.quantity}</span>
                    <button
                      type="button"
                      className="cart-qty__btn"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      aria-label="Zvýšit množství"
                    >
                      +
                    </button>
                  </div>
                  <p className="cart-item__line-total">
                    ${(product.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    type="button"
                    className="cart-item__remove"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    Odebrat
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="cart-summary page-panel">
          <h2>Shrnutí</h2>
          <dl className="cart-summary__rows">
            <div>
              <dt>Položky</dt>
              <dd>{totalItems}</dd>
            </div>
            <div className="cart-summary__total-row">
              <dt>Celkem</dt>
              <dd>${totalPrice.toFixed(2)}</dd>
            </div>
          </dl>
          <button
            type="button"
            className="page-btn page-btn--primary cart-summary__checkout"
            onClick={handleCheckout}
          >
            Dokončit objednávku
          </button>
          <div className="cart-summary__actions">
            <Link to="/products" className="page-btn page-btn--secondary">
              Pokračovat v nákupu
            </Link>
            <button
              type="button"
              className="page-btn page-btn--ghost"
              onClick={clearCart}
            >
              Vyprázdnit košík
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
