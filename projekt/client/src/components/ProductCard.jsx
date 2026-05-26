import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Komponenta pro zobrazení karty jednoho produktu v seznamu.
 * Zajišťuje sémantické HTML zabalením do značky <article> a 
 * bezpečné načítání obrázku pomocí fallbacku v React stavu.
 * 
 * @component
 * @param {Object} props - Vlastnosti komponenty
 * @param {Object} props.product - Objekt obsahující detaily produktu
 * @param {string} props.product.id - Unikátní identifikátor produktu
 * @param {string} props.product.name - Název produktu
 * @param {string} props.product.description - Popis produktu
 * @param {number|string} props.product.price - Cena produktu
 * @param {string} [props.product.image] - URL adresa obrázku produktu
 * @param {string} [props.product.category] - Kategorie, do které produkt patří
 * @returns {JSX.Element} Sémantická karta produktu
 */
const ProductCard = ({ product }) => {
  const { id, name, description, price, image, category } = product;

  // React stav pro správu zdroje obrázku a zajištění fallbacku
  const [imageSrc, setImageSrc] = useState(
    image || 'https://placehold.co/600x600/eaeaea/666666?text=Obr%C3%A1zek+nedostupn%C3%BD'
  );

  // Funkce volaná při selhání načítání obrázku ze sítě
  const handleImageError = () => {
    const fallbackUrl = 'https://placehold.co/600x600/eaeaea/666666?text=Obr%C3%A1zek+nedostupn%C3%BD';
    if (imageSrc !== fallbackUrl) {
      setImageSrc(fallbackUrl);
    }
  };

  return (
    <article className="product-card-container">
      <Link to={`/products/${id}`} className="product-card">
        <div className="product-image-container">
          {category && <span className="product-category">{category}</span>}
          <img 
            src={imageSrc} 
            alt={name} 
            className="product-image" 
            onError={handleImageError}
          />
        </div>
        <div className="product-info">
          <h2 className="product-name">{name}</h2>
          <p className="product-description">{description}</p>
          <div className="product-footer">
            <span className="product-price">${price}</span>
            <span className="product-button">Detail</span>
          </div>
        </div>
      </Link>
    </article>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    image: PropTypes.string,
    category: PropTypes.string,
  }).isRequired,
};

export default ProductCard;
