import bagIcon from "../assets/shopping-bag.svg";
import searchIcon from "../assets/search-icon.svg";
import userIcon from "../assets/icon--user.svg";
import { Link } from "react-router-dom";
import type { HeaderProps } from "../types/HeaderProps";
import Search from "./Search";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../util/auth";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

/**
 * Header component for site branding and navigation
 * @param props - Header properties
 */
function Header(props: HeaderProps) {
  // OR function Header({greetings, name}: HeaderProps) {

  const [showSearch, setShowSearch] = useState(false);

  const navigate = useNavigate();
  const handleLogout = () => {
    logoutUser();
    props.setUser(null);
    props.setCart([]);
    navigate("/login");
  };

  const userName = props.user?.name;
  return (
    <Navbar
      collapseOnSelect
      expand="sm"
      className="bg-body-tertiary justify-content-between"
      sticky="top"
    >
      <Nav className="brand-nav">
        <Link to="/" className="brand-link">
          <span className="brand-logo-badge">
            <img
              src={bagIcon}
              alt="Krishna Grocery Store logo"
              className="brand-logo-icon"
            />
          </span>
          <span className="navbar-brand">Krishna Grocery Store</span>
        </Link>
      </Nav>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse
        id="responsive-navbar-nav"
        className="justify-content-end align-self-between"
      >
        <Nav>
          <p>
            {props.greetings} {userName}
          </p>
          {props.user?.name && <button onClick={handleLogout}>Logout</button>}
          <span>
            {showSearch && <Search onSearch={props.setSearchText} />}
            <img
              className="search-icon"
              src={searchIcon}
              alt="Search Icon"
              width="30"
              height="30"
              onClick={() => setShowSearch(!showSearch)}
            />
          </span>
          <span>
            <Link to={props.user ? "/profile" : "/login"}>
              <img
                className="user-icon"
                src={userIcon}
                alt="User Icon"
                width="30"
                height="30"
              />
            </Link>
          </span>
          <span>
            <Link to="/cart">
              <img
                className="bag-icon"
                src={bagIcon}
                alt="Shopping Bag Icon"
                width="35"
                height="35"
              />
            </Link>
            <span className="cart-count">{props.cartCount}</span>
          </span>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
