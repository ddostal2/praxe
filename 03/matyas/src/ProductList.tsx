import { useEffect, useState } from 'react';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('https://fakestoreapi.com/products', { signal });
        if (!response.ok) throw new Error(`Načítání selhalo s kódem: ${response.status}`);
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Při načítání produktů došlo k chybě.');
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <p>Načítám produkty...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h3>Došlo k chybě</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="products-container">
      <h1 className="products-title">Naše produkty</h1>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div>
              <div className="product-image-box">
                <img src={product.image} alt={product.title} />
              </div>
              <div style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                {product.category}
              </div>
              <h2 style={{ fontSize: '1rem', margin: '0.5rem 0' }}>{product.title}</h2>
            </div>
            <div>
              <span className="product-price">${product.price.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
