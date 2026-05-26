import React from 'react';
import ProductCard from '../components/ProductCard.jsx';
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
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
