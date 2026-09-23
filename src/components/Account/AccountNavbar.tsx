import {Link} from "react-router-dom";

function AccountNavbar () {
    return (
        <>
        <Link to="/profile" >Account Profile</Link>
        <Link to="/address-book" >Address book</Link>
        <Link to="/order_history" >Order history</Link>
        </>
    )
}

export default AccountNavbar;
