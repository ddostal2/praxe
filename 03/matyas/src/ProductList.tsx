import { useEffect, useState } from 'react';

/**
 * TypeScript interface (typový předpis).
 * Slouží k tomu, aby TypeScript věděl, jakou strukturu mají data, se kterými pracujeme.
 * Pokud se pokusíme přistoupit k vlastnosti, která zde není definovaná (např. product.name),
 * editor nás okamžitě upozorní na chybu.
 */
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
  /**
   * useState je React hook, který vytváří "stav" komponenty.
   * Kdykoliv se hodnota stavu změní pomocí jeho set-funkce, React komponentu automaticky překreslí (re-renderuje).
   * 
   * 1. products: Pole načtených produktů. Výchozí hodnota je prázdné pole [].
   * 2. loading: Boolean hodnota indikující, zda se data právě načítají ze serveru. Výchozí hodnota je true.
   * 3. error: Text chybové zprávy, pokud načítání selže. Výchozí hodnota je null (žádná chyba).
   */
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * useEffect je React hook pro správu tzv. "vedlejších účinků" (side effects),
   * jako je načítání dat, odběr událostí nebo manipulace s DOMem.
   * 
   * První argument je funkce, která se má spustit.
   * Druhý argument je pole závislostí (dependency array).
   * Zde předáváme prázdné pole [], což Reactu říká: "Spusť tuto funkci pouze jednou, hned po prvním vykreslení (mount) komponenty".
   */
  useEffect(() => {
    /**
     * AbortController je vestavěné API v prohlížeči.
     * Umožňuje nám zrušit jeden nebo více běžících asynchronních síťových požadavků (fetch).
     * To je klíčové pro tzv. "cleanup" (čištění) při unmountu komponenty.
     */
    const controller = new AbortController();
    
    // Získáváme signál z kontroléru, který předáme do metody fetch.
    const signal = controller.signal;

    /**
     * Asynchronní funkce pro načtení dat z API.
     * Používáme klíčové slovo async, což nám dovoluje uvnitř používat klíčové slovo await.
     * Kód pak vypadá lineárně a lépe se čte, i když ve skutečnosti běží asynchronně (na pozadí).
     */
    const fetchProducts = async () => {
      // Před začátkem stahování resetujeme chybu a nastavíme loading na true.
      setLoading(true);
      setError(null);

      // Blok try-catch-finally slouží k odchycení a zpracování chyb.
      try {
        /**
         * await fetch(...) pozastaví vykonávání této funkce, dokud server neodpoví.
         * Jako druhý parametr předáváme objekt s naším signalem.
         * Tím říkáme: "Tento fetch naslouchá našemu AbortControlleru".
         */
        const response = await fetch('https://fakestoreapi.com/products', { signal });

        /**
         * response.ok je boolean hodnota. Je true, pokud HTTP status kód je v rozmezí 200-299.
         * Pokud nastane chyba na serveru (např. 404 nebo 500), response.ok bude false.
         * V takovém případě ručně vyhodíme chybu pomocí klíčového slova throw.
         */
        if (!response.ok) {
          throw new Error(`Načítání selhalo s kódem: ${response.status}`);
        }

        /**
         * response.json() převede surovou odpověď serveru (JSON řetězec) na JavaScriptové objekty.
         * Jelikož je to asynchronní operace, musíme před ní použít await.
         */
        const data: Product[] = await response.json();

        // Uložíme úspěšně načtená data do stavu products. To spustí re-render a produkty se vykreslí.
        setProducts(data);
      } catch (err: any) {
        /**
         * Pokud fetch selže (např. výpadek internetu) nebo pokud ho úmyslně zrušíme,
         * skočí kód sem do sekce catch.
         * 
         * Pokud jsme fetch zrušili my sami (přes controller.abort()), prohlížeč vyhodí speciální
         * chybu s názvem 'AbortError'. Nechceme uživateli ukazovat chybu, když se jen odpojila stránka,
         * proto tuto chybu ignorujeme a ukončíme funkci pomocí return.
         */
        if (err.name === 'AbortError') {
          console.log('Fetch byl úspěšně zrušen (abort).');
          return;
        }

        // Pokud jde o jinou chybu (např. špatné URL nebo chyba sítě), uložíme její text do stavu error.
        setError(err.message || 'Při načítání produktů došlo k chybě.');
      } finally {
        /**
         * Sekce finally se provede VŽDY – ať už stahování proběhlo úspěšně, nebo skončilo chybou.
         * 
         * Podmínka !signal.aborted zajišťuje, že se loading vypne pouze tehdy, pokud je komponenta stále na obrazovce.
         * Pokud by uživatel odešel, zrušili bychom fetch a pokus o změnu loading stavu by mohl způsobit
         * varování v konzoli o aktualizaci stavu na neodpojené komponentě (tzv. memory leak).
         */
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    // Spustíme asynchronní funkci pro načítání dat.
    fetchProducts();

    /**
     * Zde vracíme tzv. Cleanup (čistící) funkci.
     * React tuto funkci automaticky spustí ve dvou případech:
     * 1. Předtím, než se useEffect spustí znovu (kdyby měl závislosti).
     * 2. V momentě, kdy komponenta mizí z obrazovky (unmount).
     * 
     * Zavoláním controller.abort() okamžitě zrušíme rozpracovaný fetch request na pozadí,
     * což šetří výkon a data uživatele.
     */
    return () => {
      controller.abort();
    };
  }, []); // Prázdné pole závislostí -> useEffect se spustí pouze při mountu

  // CSS styly definované přímo jako JS objekty (Inline styles)
  const styles = {
    container: {
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      color: '#1a1a1a',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 800,
      marginBottom: '2rem',
      textAlign: 'center' as const,
      background: 'linear-gradient(to right, #2563eb, #3b82f6, #60a5fa)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    loaderContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '300px',
    },
    spinner: {
      width: '50px',
      height: '50px',
      border: '5px solid #f3f3f3',
      borderTop: '5px solid #2563eb',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '1rem',
    },
    errorContainer: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fca5a5',
      color: '#b91c1c',
      padding: '1.5rem',
      borderRadius: '12px',
      margin: '2rem auto',
      maxWidth: '600px',
      textAlign: 'center' as const,
      /* Převod rgba(0, 0, 0, 0.05) na hexadecimální tvar #0000000d */
      boxShadow: '0 10px 15px -3px #0000000d',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '2rem',
      padding: '1rem 0',
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #f3f4f6',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'space-between',
      /* Převod rgba(0, 0, 0, 0.02) na #00000005 a rgba(0, 0, 0, 0.05) na #0000000d */
      boxShadow: '0 4px 6px -1px #00000005, 0 10px 15px -3px #0000000d',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    imageWrapper: {
      height: '220px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '1.25rem',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '1rem',
      border: '1px solid #f9fafb',
    },
    image: {
      maxHeight: '100%',
      maxWidth: '100%',
      objectFit: 'contain' as const,
    },
    productTitle: {
      fontSize: '1.05rem',
      fontWeight: 600,
      color: '#111827',
      marginBottom: '0.5rem',
      lineHeight: '1.5',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical' as const,
      overflow: 'hidden',
    },
    category: {
      fontSize: '0.75rem',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.075em',
      color: '#3b82f6',
      marginBottom: '0.5rem',
      fontWeight: 600,
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 'auto',
      paddingTop: '1.25rem',
      borderTop: '1px solid #f3f4f6',
    },
    price: {
      fontSize: '1.35rem',
      fontWeight: 800,
      color: '#10b981',
    },
    rating: {
      fontSize: '0.875rem',
      color: '#f59e0b',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
    },
  };

  /**
   * PODMÍNĚNÉ VYKRESLOVÁNÍ (Conditional Rendering):
   * Pokud je loading === true, okamžitě vrátíme (vykreslíme) pouze točící se kolečko a dál kód nepokračuje.
   */
  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        {/* Vložený styl pro animaci točení kolečka */}
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <div style={styles.spinner} />
        <p style={{ color: '#4b5563', fontWeight: 500 }}>Načítám produkty...</p>
      </div>
    );
  }

  /**
   * PODMÍNĚNÉ VYKRESLOVÁNÍ pro chybový stav:
   * Pokud se nepodařilo data načíst (error není null), vykreslíme červenou chybovou hlášku.
   */
  if (error) {
    return (
      <div style={styles.errorContainer}>
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '1.25rem' }}>Došlo k chybě</h3>
        <p style={{ margin: 0 }}>{error}</p>
      </div>
    );
  }

  /**
   * HLAVNÍ VYKRESLENÍ PRODUKTŮ:
   * Spustí se až v momentě, kdy loading i error jsou vyřešeny a máme k dispozici data.
   */
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Naše produkty</h1>
      <div style={styles.grid}>
        {/**
         * map() je JavaScriptová metoda pole. Prochází každou položku v poli products
         * a vrací pro ni nový JSX element (kartu produktu).
         */
        products.map((product) => (
          /**
           * U prvků generovaných pomocí map() React VŽDY vyžaduje unikátní vlastnost 'key'.
           * Pomáhá to Reactu identifikovat, které položky se změnily, byly přidány nebo smazány,
           * a díky tomu efektivně aktualizovat pouze konkrétní části DOMu.
           */
          <div key={product.id} style={styles.card} className="product-card">
            <div>
              <div style={styles.imageWrapper}>
                <img
                  src={product.image}
                  alt={product.title}
                  style={styles.image}
                  loading="lazy" // lazy loading obrázků zrychluje načítání stránky (obrázky se stahují až při srolování)
                />
              </div>
              <div style={styles.category}>{product.category}</div>
              {/* Vlastnost title zobrazí název jako tooltip při najetí myší */}
              <h2 style={styles.productTitle} title={product.title}>
                {product.title}
              </h2>
            </div>
            <div style={styles.footer}>
              {/* toFixed(2) zaokrouhlí cenu na dvě desetinná místa */}
              <span style={styles.price}>${product.price.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
