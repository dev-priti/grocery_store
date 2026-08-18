import Header from "../src/components/Header";
import Navbar from "../src/components/Navbar";
import Footer from "../src/components/Footer";
import HomePage from "./pages/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductListing from "../src/components/ProductListing";
import categories from "../src/data/categories.json";
import {useState} from "react";

function App() {
  const [searchText, setSearchText] = useState("");

  return(
    <>
    <BrowserRouter>
      <Header name="Priti" greetings="Hello" searchText={searchText} setSearchText={setSearchText}/>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage searchText={searchText} />} />
        <Route path="/all" element={<ProductListing searchText={searchText} />} /> 
        {   
          categories.map(category => (
            <Route 
              key={category.id}
              path="/category/:categoryId" // :categoryId can be any variable like :id
              element={<ProductListing searchText={searchText}/>}
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
