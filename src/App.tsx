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
import Orders from "../src/components/Account/Orders";
import OrderDetails from "../src/components/Account/OrderDetails";

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

  const addToCart = async (product: ProductType) => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login to add items to cart");
        return;
    }

    try {
        const response = await fetch(
            "http://localhost:3000/api/cart/items",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productId: product.id,
                    quantity: 1,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        await syncCartFromBackend(data.cart.items);
        setAddedProduct(product);
        setShowCartPopup(true);
    } catch (error) {
        console.error("Add to cart error:", error);
    }
} ;

  const syncCartFromBackend = async (backendItems: {
    productId: number;
    quantity: number;
}[]) => {
    const response = await fetch(
        "http://localhost:3000/api/products"
    );

    const products: ProductType[] = await response.json();

    const updatedCart: CartItem[] = backendItems
        .map(item => {
            const product = products.find(
                product => product.id === item.productId
            );

            if (!product) {
                return null;
            }

            return {
                product,
                quantity: item.quantity,
            };
        })
        .filter((item): item is CartItem => item !== null);

    setCart(updatedCart);
  };

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // const decreaseQuantity = async (productId: number) => {
  //     const token = localStorage.getItem("token");

  //     if (!token) {
  //         return;
  //     }

  //     const item = cart.find(
  //         item => item.product.id === productId
  //     );

  //     if (!item) {
  //         return;
  //     }

  //     // If quantity is already 1, don't reduce it to 0.
  //     if (item.quantity <= 1) {
  //         return;
  //     }

  //     const newQuantity = item.quantity - 1;

  //     try {
  //         const response = await fetch(
  //             `http://localhost:3000/api/cart/items/${productId}`,
  //             {
  //                 method: "PATCH",
  //                 headers: {
  //                     "Content-Type": "application/json",
  //                     Authorization: `Bearer ${token}`,
  //                 },
  //                 body: JSON.stringify({
  //                     quantity: newQuantity,
  //                 }),
  //             }
  //         );

  //         const data = await response.json();

  //         if (!response.ok) {
  //             alert(data.message);
  //             return;
  //         }

  //         await syncCartFromBackend(data.cart.items);

  //     } catch (error) {
  //         console.error("Decrease quantity error:", error);
  //     }
  // };

  // const increaseQuantity = async (productId: number) => {
  //     const token = localStorage.getItem("token");

  //     if (!token) {
  //         return;
  //     }

  //     const item = cart.find(
  //         item => item.product.id === productId
  //     );

  //     if (!item) {
  //         return;
  //     }

  //     const newQuantity = item.quantity + 1;

  //     try {
  //         const response = await fetch(
  //             `http://localhost:3000/api/cart/items/${productId}`,
  //             {
  //                 method: "PATCH",
  //                 headers: {
  //                     "Content-Type": "application/json",
  //                     Authorization: `Bearer ${token}`,
  //                 },
  //                 body: JSON.stringify({
  //                     quantity: newQuantity,
  //                 }),
  //             }
  //         );

  //         const data = await response.json();

  //         if (!response.ok) {
  //             alert(data.message);
  //             return;
  //         }

  //         await syncCartFromBackend(data.cart.items);

  //     } catch (error) {
  //         console.error("Increase quantity error:", error);
  //     }
  // };

  const changeQuantity = async (
    productId: number,
    change: number
) => {
    const token = localStorage.getItem("token");

    if (!token) {
        return;
    }

    const item = cart.find(
        item => item.product.id === productId
    );

    if (!item) {
        return;
    }

    const newQuantity = item.quantity + change;

    if (newQuantity < 1) {
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:3000/api/cart/items/${productId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    quantity: newQuantity,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        await syncCartFromBackend(data.cart.items);

    } catch (error) {
        console.error("Change quantity error:", error);
    }
  };
  // const removeItem = (productId: number) => {
  //   setCart((prevCart) =>
  //     prevCart.filter(
  //       (item) => item.product.id !== productId
  //     )
  //   );
  // };

  // Remove item from cart and DB
  const removeItem = async (productId: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:3000/api/cart/items/${productId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        await syncCartFromBackend(data.cart.items);

    } catch (error) {
        console.error("Remove cart item error:", error);
    }
  };

  const cartTotal = cart.reduce(
  (total, item) =>
    total + item.product.price * item.quantity,
  0
  );

  const minStock = 1;
  const maxStock = 8;

  useEffect(() => {
    if (!user) {
        localStorage.removeItem("cart");
        return;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, user]);

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
          setAuthLoading(false);
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
    if (!user) {
        return;
    }

    const fetchCart = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        try {
          const response = await fetch(
              "http://localhost:3000/api/cart",
              {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              }
          );

            const data = await response.json();

            if (!response.ok) {
                console.error(data.message);
                return;
            }

            if (data) {
                await syncCartFromBackend(data.items);
            }
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        }
    };

    fetchCart();
  }, [user]);

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
      <Header greetings="Hello" searchText={searchText} setSearchText={setSearchText} cartCount={cartCount} user={user} setUser={setUser} setCart={setCart} />
      <Navbar categories={categories} />
      <Routes>
        <Route path="/" element={<HomePage searchText={searchText} addToCart={addToCart} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={user ? <Navigate to="/profile" /> : <Register />} />
        <Route
          path="/profile"
          element={user ? <Profile user={user} /> : <Login setUser={setUser} />}
        />
        <Route path="/cart" element={<Viewcart cart={cart} changeQuantity={changeQuantity} removeItem={removeItem} cartTotal={cartTotal} minStock={minStock} maxStock={maxStock} />} />
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
        <Route path="/orders" element={<Orders />} />
        <Route
        path="/orders/:orderId"
        element={user ? <OrderDetails /> : <Login setUser={setUser} />}
        />
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
