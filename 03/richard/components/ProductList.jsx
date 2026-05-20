import React, { useEffect, useState } from "react";

/**
 * URL adresa API pro načtení seznamu produktů.
 * @type {string}
 */
const PRODUCTS_API_URL = "https://fakestoreapi.com/products";

/**
 * Komponenta ProductList.
 * * Vykresluje seznam produktů načtených z externího API.
 * Obsahuje ošetření stavu načítání (loading), chybového stavu (error)
 * a bezpečné zrušení síťového požadavku při unmountu komponenty.
 * * @component
 * @returns {JSX.Element} Vrací loading text, chybovou hlášku nebo samotný seznam produktů v HTML struktuře.
 */
const ProductList = () => {
  /**
   * Stav pro uložení pole načtených produktů.
   * @type {[Array<Object>, Function]}
   */
  const [products, setProducts] = useState([]);

  /**
   * Stav indikující, zda právě probíhá stahování dat.
   * @type {[boolean, Function]}
   */
  const [loading, setLoading] = useState(true);

  /**
   * Stav pro uložení chybové zprávy, pokud fetch selže.
   * @type {[string|null, Function]}
   */
  const [error, setError] = useState(null);

  useEffect(() => {
    /**
     * Kontroler pro možnost zrušení asynchronního požadavku (fetch).
     * @type {AbortController}
     */
    const controller = new AbortController();

    /**
     * Asynchronní funkce, která provede samotné stažení dat z API,
     * ošetří chybové stavy a aktualizuje lokální stavy komponenty.
     * * @async
     * @function loadProducts
     * @throws {Error} Vyhodí chybu, pokud HTTP odpověď není v rozmezí 200-299 (response.ok).
     * @returns {Promise<void>}
     */
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Odeslání požadavku s propojeným AbortController signálem
        const response = await fetch(PRODUCTS_API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Nepodařilo se načíst produkty.");
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        // Ignorujeme chybu, pokud byl fetch úmyslně přerušen pomocí controller.abort()
        if (err.name !== "AbortError") {
          setError(err.message || "Došlo k chybě při načítání dat.");
        }
      } finally {
        // Stav loading vypínáme pouze v případě, že komponenta stále existuje (nebyl vyvolán abort)
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    // Spuštění načítání dat při mountu komponenty
    loadProducts();

    /**
     * Úklidová funkce (Cleanup), kterou React zavolá při unmountu komponenty.
     * Zruší probíhající síťový požadavek, aby se předešlo úniku paměti.
     */
    return () => {
      controller.abort();
    };
  }, []); // Prázdné pole závislostí zajišťuje spuštění efektu pouze jednou

  // 1. Podmíněné vykreslení pro stav načítání
  if (loading) {
    return <p>Načítám data...</p>;
  }

  // 2. Podmíněné vykreslení pro chybový stav
  if (error) {
    return <p>Chyba: {error}</p>;
  }

  // 3. Vykreslení samotných dat, pokud je vše v pořádku
  return (
      <div>
        <h2>Seznam produktů</h2>
        {products.map((product) => (
            <article key={product.id}>
              <h3>{product.title}</h3>
              <img
                  src={product.image}
                  alt={product.title}
                  width={100}
                  loading="lazy"
              />
              <p>${product.price}</p>
            </article>
        ))}
      </div>
  );
};

export default ProductList;