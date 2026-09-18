import { Link } from "react-router-dom";
//import categories from "../data/categories.json";
import type { CategoryType } from "../types/Category";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Button } from "react-bootstrap";

function MyNavbar({ categories }: { categories: CategoryType[] }) {
  return (
    <Navbar
      collapseOnSelect
      expand="sm"
      className="bg-body-tertiary"
      sticky="top"
    >
      <Container>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Button variant="outline">
              <Link style={{ textDecoration: "none" }} to="/all">
                All products
              </Link>
            </Button>
            {categories.map((category) => (
              <Link key={category.id} to={`/products/${category.id}`}>
                <Button variant="outline">{category.name}</Button>
              </Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
