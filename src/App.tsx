import {useState, useEffect} from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
//import categories from "../src/data/categories.json";
import type { CategoryType } from "./types/Category";
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
import Register from "../src/components/Account/Register";
import Profile from "./pages/Profile";
import Viewcart from "../src/pages/Viewcart";
import type { AuthUser } from "./types/User";

function App() {
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : []})
  ;
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [addedProduct, setAddedProduct] = useState<ProductType | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

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

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:3000/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          localStorage.removeItem("token");
          return;
        }

        const data = await response.json();
        setUser(data.user);
        setAuthLoading(false);
      } catch (error) {
        setAuthLoading(false);
        console.error("Failed to restore login:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
      const fetchCategories = async () => {
          const response = await fetch(
              "http://localhost:3000/api/categories"
          );

          const data = await response.json();

          setCategories(data);
      };

      fetchCategories();
  }, []);

  if (authLoading) {
    return <div>Loading...</div>;
  }
  
  return(
    <>
    <BrowserRouter basename="/grocery_store">
      <Header greetings="Hello" searchText={searchText} setSearchText={setSearchText} cartCount={cartCount} user={user} setUser={setUser} />
      <Navbar categories={categories} />
      <Routes>
        <Route path="/" element={<HomePage searchText={searchText} addToCart={addToCart} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={user ? <Navigate to="/profile" /> : <Register />} />
        <Route
          path="/profile"
          element={user ? <Profile user={user} /> : <Login setUser={setUser} />}
        />
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
