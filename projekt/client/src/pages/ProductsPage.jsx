import React from 'react';
import { Link } from 'react-router-dom';
import productsData from '../../../server/src/db/products.json';
import './Products.css';

// Using data directly from the server's json file
export const MOCK_PRODUCTS = productsData.map(p => ({
  ...p,
  name: p.title, // map title to name for UI
  // ensure string ID since our routing uses string ID
  id: p.id.toString(),
  // category name placeholder since JSON only has categoryId
  category: p.categoryId === 1 ? "Káva" : p.categoryId === 2 ? "Kávovary" : "Příslušenství"
}));

const ProductsPage = () => {
  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Naše Produkty</h1>
        <p>Objevte naši prémiovou kolekci navrženou pro vás.</p>
      </div>
      
      <div className="products-grid">
        {MOCK_PRODUCTS.map((product) => (
          <Link to={`/products/${product.id}`} key={product.id} className="product-card">
            <div className="product-image-container">
              <span className="product-category">{product.category}</span>
              <img 
                src={product.image} 
                alt={product.name} 
                className="product-image" 
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x600/eaeaea/666666?text=Obr%C3%A1zek+nedostupn%C3%BD'; }}
              />
            </div>
            <div className="product-info">
              <h2 className="product-name">{product.name}</h2>
              <p className="product-description">{product.description}</p>
              <div className="product-footer">
                <span className="product-price">${product.price}</span>
                <span className="product-button">Detail</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
