import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { ProductType } from "../types/ProductType";
import { DEFAULT_PRODUCT_IMAGE, getProductImage } from "../util/productImage";

export type productDisplayCardProps = {
  product: ProductType;
  addToCart?: (product: ProductType) => void;
};

function ProductDisplayCard({ product, addToCart }: productDisplayCardProps) {
  const productImage = getProductImage(product.image);

  return (
    <Card className="product-showcase-card">
      <Link
        className="product-showcase-link"
        to={`/product/${product.category}/${product.id}/${product.name}`}
      >
        <div className="product-showcase-image-wrap">
          <Card.Img
            className="product-showcase-image"
            variant="top"
            src={productImage}
            onError={(event) => {
              event.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
            }}
          />
        </div>

        <Card.Body className="product-showcase-body">
          <div className="product-showcase-meta">
            <span className="product-showcase-category">{product.category}</span>
            <span className="product-showcase-rating">★ {product.rating}</span>
          </div>

          <Card.Title className="product-showcase-title">{product.name}</Card.Title>
          <Card.Text className="product-showcase-description">
            {product.description}
          </Card.Text>

          <div className="product-showcase-price-row">
            <div className="product-showcase-price">₹{product.price}</div>
            <div className="product-showcase-unit">{product.unit}</div>
          </div>
        </Card.Body>
      </Link>

      <div className="product-showcase-footer">
        <Button
          className="product-showcase-button"
          variant="primary"
          value="Add to Cart"
          product-id={product.id}
          onClick={() => addToCart?.(product)}
        >
          Add to Cart
        </Button>
      </div>
    </Card>
  );
}

export default ProductDisplayCard;
