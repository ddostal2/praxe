import React, { useMemo, useState, useEffect, useRef } from 'react';
import { getProducts, getCategories } from '../api/ApiService.js';
import '../styles/Products.css';
import ProductCard from "../components/ProductCard.jsx";

export const CATEGORY_TRANSLATIONS = {
  "electronics": "Elektronika",
  "jewelery": "Šperky",
  "men's clothing": "Pánské oblečení",
  "women's clothing": "Dámské oblečení",
};

const SORT_OPTIONS = [
  { value: 'default', label: 'Výchozí řazení' },
  { value: 'price-asc', label: 'Cena: od nejnižší' },
  { value: 'price-desc', label: 'Cena: od nejvyšší' },
  { value: 'name-asc', label: 'Název: A–Z' },
];

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const didInitPagination = useRef(false);

  const readPaginationFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const rawPage = Number(params.get('page') || 1);
    const rawLimit = Number(params.get('limit') || 12);

    const nextPage = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
    const nextLimit = Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : 12;

    return { nextPage, nextLimit };
  };

  const writePaginationToUrl = (nextPage, nextLimit, { replace = false } = {}) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', String(nextPage));

    if (replace) {
      window.history.replaceState(null, '', url.toString());
    } else {
      window.history.pushState(null, '', url.toString());
    }
  };

  const goToPage = (nextPage) => {
    const safePage = Number.isFinite(nextPage) && nextPage > 0 ? Math.floor(nextPage) : 1;
    setPage(safePage);
    writePaginationToUrl(safePage, limit);
  };

  useEffect(() => {
    const sync = () => {
      const { nextPage, nextLimit } = readPaginationFromUrl();
      setPage(nextPage);
      setLimit(nextLimit);
    };

    sync();
    didInitPagination.current = true;
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts({ signal: controller.signal }),
          getCategories(controller.signal),
        ]);

        if (active) {
          const mapped = productsData.map((p) => ({
            ...p,
            id: String(p.id),
            name: p.title,
            category: CATEGORY_TRANSLATIONS[p.category] || p.category,
            originalCategory: p.category,
          }));
          setProducts(mapped);
          setCategories(categoriesData);
          setError(null);
        }
      } catch (err) {
        if (active && err.name !== 'AbortError') {
          setError(err.message || 'Nepodařilo se načíst produkty. Zkuste to prosím později.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchAllData();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const categoryFilters = useMemo(() => {
    return [
      { id: 'all', label: 'Vše' },
      ...categories.map((cat) => ({
        id: cat,
        label: CATEGORY_TRANSLATIONS[cat] || cat,
      })),
    ];
  }, [categories]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (categoryFilter !== 'all') {
      result = result.filter((p) => p.originalCategory === categoryFilter);
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
  }, [categoryFilter, sortBy, searchQuery, products]);

  const totalPages = useMemo(() => {
    const pages = Math.ceil(filteredProducts.length / limit);
    return pages > 0 ? pages : 1;
  }, [filteredProducts.length, limit]);

  const currentPage = useMemo(() => {
    if (page < 1) return 1;
    if (page > totalPages) return totalPages;
    return page;
  }, [page, totalPages]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return filteredProducts.slice(start, start + limit);
  }, [filteredProducts, currentPage, limit]);

  useEffect(() => {
    if (currentPage !== page) {
      setPage(currentPage);
      writePaginationToUrl(currentPage, limit, { replace: true });
    }
  }, [currentPage, page, limit]);

  useEffect(() => {
    if (!didInitPagination.current) return;
    setPage(1);
    writePaginationToUrl(1, limit, { replace: true });
  }, [categoryFilter, sortBy, searchQuery]);

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '5rem' }}>
        <h2>Načítám produkty...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '5rem', color: 'red' }}>
        <h2>Chyba</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="product-button">
          Zkusit znovu
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Naše Produkty</h1>
        <p>Objevte naši prémiovou kolekci navrženou pro vás.</p>
      </header>

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
          {categoryFilters.map((cat) => (
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
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {filteredProducts.length > 0 && totalPages > 1 ? (
        <nav
          className="products-pagination"
          aria-label="Stránkování"
          style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}
        >
          <button
            type="button"
            className="product-button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Předchozí
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              className="product-button"
              onClick={() => goToPage(p)}
              aria-current={p === currentPage ? 'page' : undefined}
              style={p === currentPage ? { opacity: 0.7, pointerEvents: 'none' } : undefined}
            >
              {p}
            </button>
          ))}

          <button
            type="button"
            className="product-button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Další
          </button>
        </nav>
      ) : null}
    </div>
  );
};

export default ProductsPage;
