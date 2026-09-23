import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
// import products from "../data/products.json";
import type { ProductType } from "../types/ProductType";

import ProductDisplayCard from "./ProductDisplayCard";

export type productProps = {
  searchText?: string;
  addToCart?: (product: ProductType) => void;
};

function ProductListing({ searchText = "", addToCart }: productProps) {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [sortBy, setSortBy] = useState("");
  const [products, setProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("http://localhost:3000/api/products");
      const data = await response.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  // Category filtering
  let filteredProducts = categoryId
    ? products.filter((product) => product.categoryId === Number(categoryId))
    : products;

  // if (results && results.length > 0) {
  //     filteredProducts = results;
  // }

  // Search Filtering
  if (searchText.trim() !== "") {
    const search = searchText.toLowerCase().trim();

    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search),
    );
  }

  // Sorting
  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") {
      return a.price - b.price;
    }

    if (sortBy === "price-high") {
      return b.price - a.price;
    }

    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }

    return 0;
  });

  const noProducts = filteredProducts.length === 0 ? 1 : 0;

  return (
    <div>
      {!noProducts ? (
        <select
          className="product-sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </select>
      ) : null}

      <div className="site__product-listing">
        {filteredProducts.map((product) => (
          <ProductDisplayCard
            key={product.id}
            product={product}
            addToCart={addToCart}
          />
        ))}

        {filteredProducts.length === 0 && (
          <p className="no-products">No products found.</p>
        )}
      </div>
    </div>
  );
}

export default ProductListing;
