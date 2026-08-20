import logo from '../assets/vite.svg';
import bagIcon from '../assets/shopping-bag.svg';
import searchIcon from '../assets/search-icon.svg';
import userIcon from '../assets/icon--user.svg';
import { Link } from "react-router-dom";
import type { HeaderProps } from "../types/HeaderProps";
import Search from "./Search";
import {useState} from "react";

/**
 * Header component for site branding and navigation
 * @param props - Header properties
 */
function Header(props: HeaderProps) { // OR function Header({greetings, name}: HeaderProps) { 

    const [showSearch, setShowSearch] = useState(false);

    return(
        <div className="site__header-container">
            <div className="site__header-logo">
                <Link to = '/'>
                    <img className="site-logo" src={logo} alt="Brand Logo" width="200" />
                </Link>
                <p>{props.greetings} {props.name}</p>
                <span>
                    {showSearch && <Search onSearch={props.setSearchText} />}
                    <img className="search-icon" src={searchIcon} alt="Search Icon" width="60" height="60" style={{ textAlign: 'right' }} onClick = {() => setShowSearch(!showSearch)} />
                </span>
                <span><img className="user-icon" src={userIcon} alt="User Icon" width="60" height="60" style={{ textAlign: 'right' }} /></span>
                <span>
                    <Link to = '/cart'>
                        <img className="bag-icon" src={bagIcon} alt="Shopping Bag Icon" width="60" height="60" style={{ textAlign: 'right' }} />  
                    </Link>
                <span className="cart-count">
                    {props.cartCount}
                </span>
                </span>
            </div>
            <div className="site__header-title">
                <span className="title">Krishna Grocery Store</span>
            </div>
        </div>
    );
}

export default Header;