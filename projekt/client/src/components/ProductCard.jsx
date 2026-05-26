import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Komponenta pro zobrazení karty jednoho produktu v seznamu.
 */
const ProductCard = ({ product }) => {
  const { id, name, description, price, image, category } = product;
  const [justAdded, setJustAdded] = useState(false);

  const [imageSrc, setImageSrc] = useState(
    image || 'https://placehold.co/600x600/eaeaea/666666?text=Obr%C3%A1zek+nedostupn%C3%BD'
  );

  const handleImageError = () => {
    const fallbackUrl =
      'https://placehold.co/600x600/eaeaea/666666?text=Obr%C3%A1zek+nedostupn%C3%BD';
    if (imageSrc !== fallbackUrl) {
      setImageSrc(fallbackUrl);
    }
  };

  const handleAddToCart = () => {
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2000);
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
          </div>
        </div>
      </Link>
      <div className="product-card-actions">
        <Link to={`/products/${id}`} className="product-button">
          Detail
        </Link>
        <button
          type="button"
          className={`product-button product-button--cart${justAdded ? ' product-button--cart-added' : ''}`}
          onClick={handleAddToCart}
        >
          {justAdded ? 'Přidáno ✓' : 'Do košíku'}
        </button>
      </div>
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
