import {Link} from "react-router-dom";
import categories from "../data/categories.json";


function Navbar() {
    return(
        <nav className="site__navbar">
            <Link to="/all" className="gnav-item">
                All products
            </Link>
            {   
                categories.map((category) => (
                <Link
                    key={category.id}
                    to={`/category/${category.id}`}
                    className="gnav-item"
                >
                    {category.name}
                </Link>
                ))
            }
        </nav>
    );
}

export default Navbar;
