import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { ProductType } from "../types/ProductType";

export type productDisplayCardProps = {
  product: ProductType;
  addToCart?: (product: ProductType) => void;
};

function ProductDisplayCard({ product, addToCart }: productDisplayCardProps) {
  return (
    <Card style={{ width: "18rem" }} className=" p-2 m-2 ">
    <Link
      style={{ textDecoration: "none" }}
      to={`/product/${product.category}/${product.id}/${product.name}`}
    >
        <Card.Img
          style={{ height: "18rem" }}
          variant="top"
          src={product.image}
        />

        <Card.Body>
          <Card.Title>{product.name}</Card.Title>
          <Card.Text style={{ height: "40px" }}>
            {product.description}
          </Card.Text>
          <Card.Body className=" d-flex justify-content-between">
            <div>₹{product.price}</div>
            <div>{product.unit}</div>
            {product.rating}
          </Card.Body>

          {/* <form name="cart">                             */}
        </Card.Body>
          </Link>
        <Card.Footer>
          <Button
            className=" w-100 align-self-end"
            variant="primary"
            value="Add to Cart"
            product-id={product.id}
            onClick={() => addToCart?.(product)}
          >
            Add to Cart
          </Button>
        </Card.Footer>
        {/* </form> */}
      </Card>
  );
}

export default ProductDisplayCard;
