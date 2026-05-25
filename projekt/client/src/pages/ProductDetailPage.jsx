import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_PRODUCTS } from './ProductsPage';
import './Products.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  
  // V reálné aplikaci by se zde udělal fetch na API podle id
  const product = MOCK_PRODUCTS.find(p => p.id === id);

  if (!product) {
    return (
      <div className="product-detail-container not-found">
        <h2>Produkt nenalezen</h2>
        <Link to="/products" className="back-link">
          ← Zpět na produkty
        </Link>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <Link to="/products" className="back-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Zpět na produkty
      </Link>
      
      <div className="product-detail-card">
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-detail-image" 
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x800/eaeaea/666666?text=Obr%C3%A1zek+nedostupn%C3%BD'; }}
        />
        
        <div className="product-detail-info">
          <span className="product-detail-category">{product.category}</span>
          <h1 className="product-detail-name">{product.name}</h1>
          <div className="product-detail-price">${product.price}</div>
          
          <p className="product-detail-description">
            {product.description}
            <br /><br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          
          <button className="add-to-cart-btn">
            Přidat do košíku
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
