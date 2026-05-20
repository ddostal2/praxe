/*
 * Prompt: načti produkty a filtruj podle kategorie
 */

import {useEffect, useState} from 'react';

type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
};

type FilterOptions = {
  category: string;
  minPrice: number;
  maxPrice: number;
};

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  const filterOptions: FilterOptions = {
    category: category,
    minPrice: 0,
    maxPrice: 1000,
  };

  useEffect(() => {
    setLoading(true);
    fetch('https://fakestoreapi.com/products')
    .then((res) => res.json())
    .then((data) => {
      const filtered = data.filter((p: Product) => {
        if (filterOptions.category === 'all') return true;
        return p.category === filterOptions.category;
      });
      setProducts(filtered);
      setLoading(false);
    });
  }, [filterOptions]);

  if (loading) return <p>Načítám…</p>;

  return (
      <div>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">Vše</option>
          <option value="electronics">Electronics</option>
          <option value="jewelery">Jewelery</option>
        </select>
        <ul>
          {products.map((p, index) => (
              <li key={index}>{p.title} — ${p.price}</li>
          ))}
        </ul>
      </div>
  );
}
