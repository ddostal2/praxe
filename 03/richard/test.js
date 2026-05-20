import { useEffect, useState } from "react";

export default function ProductsExercise() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("https://fakestoreapi.com/products", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }
        setError(err.message || "Unexpected error");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      controller.abort();
    };
  }, []);

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <section>
      <h2>Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.title} - ${product.price}
          </li>
        ))}
      </ul>
    </section>
  );
}
