import {Link} from "react-router-dom";
//import categories from "../data/categories.json";
import type { CategoryType } from "../types/Category";

function Navbar({ categories }: { categories: CategoryType[] }) {
    return(
        <nav className="site__navbar">
            <Link to="/all" className="gnav-item">
                All products
            </Link>
            {   
                categories.map((category) => (
                <Link
                    key={category.id}
                    to={`/products/${category.id}`}
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
