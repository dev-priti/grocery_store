import Header from "../src/components/Header";
import Navbar from "../src/components/Navbar";
import Footer from "../src/components/Footer";
import HomePage from "./pages/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductListing from "../src/components/ProductListing";
import categories from "../src/data/categories.json";

function App() {
  return(
    <>
    <BrowserRouter>
      <Header name="Priti" greetings="Hello" />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/all" element={<ProductListing />} /> 
        {   
          categories.map(category => (
            <Route 
              key={category.id}
              path="/category/:categoryId" // :categoryId can be any variable like :id
              element={<ProductListing />}
            />
          )) 
        }
      </Routes>
    </BrowserRouter>

    <Footer />
    </>
  );
}

export default App;
