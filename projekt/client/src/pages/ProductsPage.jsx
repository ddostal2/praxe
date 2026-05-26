import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import productsData from '../../../server/src/db/products.json';
import './Products.css';

const CATEGORY_MAP = {
  1: 'Káva',
  2: 'Kávovary',
  3: 'Příslušenství',
};

const CATEGORY_FILTERS = [
  { id: 'all', label: 'Vše' },
  { id: '1', label: 'Káva' },
  { id: '2', label: 'Kávovary' },
  { id: '3', label: 'Příslušenství' },
];

const SORT_OPTIONS = [
  { value: 'default', label: 'Výchozí řazení' },
  { value: 'price-asc', label: 'Cena: od nejnižší' },
  { value: 'price-desc', label: 'Cena: od nejvyšší' },
  { value: 'name-asc', label: 'Název: A–Z' },
];

export const MOCK_PRODUCTS = productsData.map((p) => ({
  ...p,
  name: p.title,
  id: p.id.toString(),
  category: CATEGORY_MAP[p.categoryId] ?? 'Ostatní',
}));

const ProductsPage = () => {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    let result = [...MOCK_PRODUCTS];

    if (categoryFilter !== 'all') {
      result = result.filter((p) => p.categoryId === Number(categoryFilter));
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name, 'cs'));
        break;
      default:
        result.sort((a, b) => Number(a.id) - Number(b.id));
    }

    return result;
  }, [categoryFilter, sortBy, searchQuery]);

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Naše Produkty</h1>
        <p>Objevte naši prémiovou kolekci navrženou pro vás.</p>
      </div>

      <div className="products-filters" role="search">
        <label className="products-filters__search">
          <span className="visually-hidden">Hledat produkty</span>
          <input
            type="search"
            placeholder="Hledat podle názvu nebo popisu…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>

        <div className="products-filters__categories" role="group" aria-label="Filtrovat podle kategorie">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={
                categoryFilter === cat.id
                  ? 'products-filters__chip products-filters__chip--active'
                  : 'products-filters__chip'
              }
              onClick={() => setCategoryFilter(cat.id)}
              aria-pressed={categoryFilter === cat.id}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <label className="products-filters__sort">
          <span>Řadit</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="products-count" aria-live="polite">
        {filteredProducts.length}{' '}
        {filteredProducts.length === 1
          ? 'produkt'
          : filteredProducts.length >= 2 && filteredProducts.length <= 4
            ? 'produkty'
            : 'produktů'}
      </p>

      {filteredProducts.length === 0 ? (
        <p className="products-empty">Žádné produkty neodpovídají zvoleným filtrům.</p>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <Link to={`/products/${product.id}`} key={product.id} className="product-card">
              <div className="product-image-container">
                <span className="product-category">{product.category}</span>
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      'https://placehold.co/600x600/eaeaea/666666?text=Obr%C3%A1zek+nedostupn%C3%BD';
                  }}
                />
              </div>
              <div className="product-info">
                <h2 className="product-name">{product.name}</h2>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">{product.price} Kč</span>
                  <span className="product-button">Detail</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="products-grid">
        {MOCK_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
