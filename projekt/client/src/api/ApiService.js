/**
 * Služba pro komunikaci s Fake Store API.
 * Vrací data nebo vyhodí Error s českou zprávou pro UI.
 */

const FAKESTORE_BASE_URL = "https://fakestoreapi.com";

/**
 * Z odpovědi serveru sestaví srozumitelnou chybovou zprávu v češtině.
 * @param {Response} response
 * @param {string} [fallback]
 * @returns {Promise<string>}
 */
async function getErrorMessage(response, fallback) {
  const defaultMessage =
    fallback ?? "Nepodařilo se načíst data ze serveru.";

  if (response.status >= 500) {
    return "Interní chyba serveru. Zkuste to prosím později.";
  }

  if (response.status === 404) {
    return "Požadovaný zdroj nebyl nalezen.";
  }

  if (response.status === 400) {
    return "Neplatný požadavek.";
  }

  try {
    const body = await response.json();
    if (body && typeof body.error === "string" && body.error.trim()) {
      return body.error;
    }
  } catch {
    // tělo není JSON — použijeme výchozí zprávu
  }

  return defaultMessage;
}

/**
 * Společný wrapper pro HTTP požadavky včetně ošetření výpadku serveru.
 * @param {string} path
 * @param {RequestInit} [options]
 * @returns {Promise<unknown>}
 */
async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${FAKESTORE_BASE_URL}${path}`, options);
  } catch (err) {
    if (err.name === "AbortError") {
      throw err;
    }

    console.error("[ApiService] Síťová chyba:", err);
    throw new Error(
      "Server není dostupný. Zkontrolujte připojení k internetu a zkuste to znovu."
    );
  }

  if (!response.ok) {
    const message = await getErrorMessage(response);
    console.error(
      `[ApiService] HTTP ${response.status} ${path}:`,
      message
    );
    throw new Error(message);
  }

  return response.json();
}

/**
 * Sestaví query string pro limit a řazení.
 * @param {Object} [filters]
 * @returns {string}
 */
function buildProductsQuery(filters = {}) {
  const params = new URLSearchParams();

  if (filters.limit != null) {
    params.set("limit", String(filters.limit));
  }
  if (filters.sort) {
    params.set("sort", filters.sort);
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

/**
 * Vrátí cestu k endpointu produktů podle filtrů.
 * Kategorie jde přes /products/category/{name}, ne přes query parametr.
 * @param {Object} [filters]
 * @returns {string}
 */
function buildProductsPath(filters = {}) {
  const query = buildProductsQuery(filters);

  if (filters.category) {
    const category = encodeURIComponent(filters.category);
    return `/products/category/${category}${query}`;
  }

  return `/products${query}`;
}

/**
 * Načte seznam produktů z Fake Store API.
 * @param {Object} [filters]
 * @param {string} [filters.category] Kategorie produktu (např. "electronics").
 * @param {number} [filters.limit] Maximální počet položek.
 * @param {"asc"|"desc"} [filters.sort] Řazení podle ceny.
 * @param {AbortSignal} [filters.signal] Signál pro zrušení požadavku (AbortController).
 * @returns {Promise<Array>}
 */
export async function getProducts(filters = {}) {
  const { signal, ...queryFilters } = filters;
  const path = buildProductsPath(queryFilters);

  return request(path, { signal });
}

/**
 * Načte detail jednoho produktu podle ID.
 * @param {number|string} id
 * @param {AbortSignal} [signal]
 * @returns {Promise<Object>}
 */
export async function getProduct(id, signal) {
  if (id == null || String(id).trim() === "") {
    throw new Error("Neplatné ID produktu.");
  }

  try {
    return await request(`/products/${encodeURIComponent(String(id))}`, {
      signal,
    });
  } catch (err) {
    if (err.message === "Požadovaný zdroj nebyl nalezen.") {
      throw new Error("Produkt nenalezen.");
    }
    throw err;
  }
}

/**
 * Načte seznam kategorií produktů.
 * @param {AbortSignal} [signal]
 * @returns {Promise<Array<string>>}
 */
export async function getCategories(signal) {
  return request("/products/categories", { signal });
}
