import {useState, useEffect} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import categories from "../src/data/categories.json";
import products from "../src/data/products.json";
import Header from "../src/components/Header";
import Navbar from "../src/components/Navbar";
import Footer from "../src/components/Footer";
import HomePage from "./pages/HomePage";
import ProductListing from "../src/components/ProductListing";
import Product from "../src/components/Product";
import type { CartItem, ProductType } from "../src/types/ProductType";
import CartPopup from "../src/components/Cart/CartPopup";
import Login from "../src/components/Account/Login";
import Profile from "../src/components/Account/Profile";
import Viewcart from "../src/pages/Viewcart";

function App() {
  const [searchText, setSearchText] = useState("");
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : []})
  ;
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [addedProduct, setAddedProduct] = useState<ProductType | null>(null);

  const addToCart = (product: ProductType) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id ? {
            ...item,
            quantity: item.quantity + 1,
          }
          : item
        );
      }
      return [
      ...prevCart, //modify the prop i.e. existing cart
      {
        product: product,
        quantity: 1,
      }
    ];
  });

  setAddedProduct(product);
  setShowCartPopup(true);
  };

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const decreaseQuantity = (productId: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      )
    );
  };

  const increaseQuantity = (productId: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const removeItem = (productId: number) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => item.product.id !== productId
      )
    );
  };

  const cartTotal = cart.reduce(
  (total, item) =>
    total + item.product.price * item.quantity,
  0
  );

  const minStock = 1;
  const maxStock = 8;

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart]);

  const [user, setUser] = useState(() => {
      const savedUser = localStorage.getItem("loggedInUser");
      return savedUser ? JSON.parse(savedUser) : null;
  });

  return(
    <>
    <BrowserRouter>
      <Header greetings="Hello" searchText={searchText} setSearchText={setSearchText} cartCount={cartCount} user={user} setUser={setUser} />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage searchText={searchText} addToCart={addToCart} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Viewcart cart={cart} increaseQuantity={increaseQuantity} decreaseQuantity={decreaseQuantity} removeItem={removeItem} cartTotal={cartTotal} minStock={minStock} maxStock={maxStock} />} />
        <Route path="/all" element={<ProductListing searchText={searchText} addToCart={addToCart} />} /> 
        {   
          categories.map(category => (
            <Route 
              key={category.id}
              path="/products/:categoryId" // :categoryId can be any variable like :id
              element={<ProductListing searchText={searchText} addToCart={addToCart}/>}
            />
          )) 
        }
        {
          products.map(product => (
            <Route 
              key={product.id}
              path="/product/:categoryName/:productId/:productName"
              element={<Product addToCart={addToCart} />}
            />
          )) 
        }
        {   
          // <Route 
          //   key={cart.id}
          //   path="/cart"
          //   element={<Viewcart />}
          // />
        }
      </Routes>

      {showCartPopup && addedProduct && (
        <CartPopup
          product={addedProduct}
          cartCount={cartCount}
          onClose={() => setShowCartPopup(false)}
        />
      )}
    </BrowserRouter>
    <Footer />
    {/* <pre>Product that got added
  {JSON.stringify(cart, null, 2)}
</pre> */}
    </>
  );
}

export default App;
