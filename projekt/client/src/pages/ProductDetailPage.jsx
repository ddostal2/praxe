import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../api/ApiService.js';
import { CATEGORY_TRANSLATIONS } from './ProductsPage.jsx';
import { useCart } from '../hooks/useCart.js';
import '../styles/PageShared.css';
import './Products.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProduct(id, controller.signal);
        if (active) {
          if (!data) {
            setError('Produkt nebyl nalezen.');
          } else {
            const mapped = {
              ...data,
              id: String(data.id),
              name: data.title,
              category: CATEGORY_TRANSLATIONS[data.category] || data.category,
            };
            setProduct(mapped);
            setError(null);
          }
        }
      } catch (err) {
        if (active && err.name !== 'AbortError') {
          setError(err.message || 'Nepodařilo se načíst detail produktu.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      active = false;
      controller.abort();
    };
  }, [id]);

  useEffect(() => {
    setJustAdded(false);
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product.id);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="page-container product-detail-container" style={{ textAlign: 'center', padding: '5rem' }}>
        <h2>Načítám detail produktu...</h2>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-container product-detail-container not-found">
        <h2>{error || 'Produkt nenalezen'}</h2>
        <Link to="/products" className="back-link">
          ← Zpět na produkty
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container product-detail-container">
      <Link to="/products" className="back-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Zpět na produkty
      </Link>

      <div className="product-detail-card">
        <img
          src={product.image}
          alt={product.name}
          className="product-detail-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              'https://placehold.co/800x800/eaeaea/666666?text=Obr%C3%A1zek+nedostupn%C3%BD';
          }}
        />

        <div className="product-detail-info">
          <span className="product-detail-category">{product.category}</span>
          <h1 className="product-detail-name">{product.name}</h1>
          <div className="product-detail-price">${product.price}</div>

          <p className="product-detail-description">{product.description}</p>

          <button
            type="button"
            className={`add-to-cart-btn${justAdded ? ' add-to-cart-btn--added' : ''}`}
            onClick={handleAddToCart}
          >
            {justAdded ? 'Přidáno ✓' : 'Přidat do košíku'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
