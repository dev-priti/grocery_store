import products from "../data/products.json";

function FeaturedSection() {
    const featuredProducts = products.filter(product => 
        product.featuredProduct === 1
    );

    return(
        <div className="site__featured-container">
            {featuredProducts.map((product) => (
                <div className="product-container" key={product.id}>
                    <div className="image-container">
                        <img src={product.image} className="product-img" alt={product.name} width="100" height="100" />
                    </div>
                    <div className="product-details">
                        <div className="product-title">{product.name}</div>
                        <div className="product-subtitle">{product.description}</div>
                        <div className="product-unit">
                            <span className="price">{product.price}</span>
                            <span className="product-unit">{product.unit}</span>
                        </div>
                        <div className="product-rating">{product.rating}</div>
                    </div>
                    <div className="product-add-to-cart">
                        {/* <form name="cart">                             */}
                            <button className="add-to-cart-button" value="Add to Cart" product-id={product.id}>Add to Cart</button>
                        {/* </form> */}
                    </div>
                </div>
            ))};
        </div>
    );
}

export default FeaturedSection;
