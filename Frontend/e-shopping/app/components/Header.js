'use client';
import { useState } from 'react';
import Link from "next/link";
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaSearch, FaHeart } from 'react-icons/fa';
import { LogOut } from 'lucide-react';
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import styles from '../styles/styles.module.css';
import Image from 'next/image';

const Header = () => {
    const { user, logout } = useAuth();
    const { totalItems, totalItemsFavoris } = useCart();

    const [expanded, setExpanded] = useState(false);

    const handleClose = () => setExpanded(false);

    return (
        <Navbar bg="light" expand="lg" fixed='top' expanded={expanded} onToggle={setExpanded} className="py-3 shadow-sm">
            <Container>
                <Navbar.Brand className={styles.logo + " fw-bold fs-2 text-dark"}>
                    <Link href="/" onClick={handleClose}>
                        <Image className="rounded-pill" src="/images/logo.jpg" alt="Logo" width={50} height={50} />
                    </Link>
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="main-navbar" />
                
                <Navbar.Collapse id="main-navbar" className="justify-content-between">
                    <div></div>
                    <Nav className={styles.nav + " px-3 d-flex justify-content-end align-items-center gap-3"}>
                        <Link href="/recherche" className="rounded-pill btn btn-dark" onClick={handleClose}>
                            <FaSearch />
                        </Link>
                        <Link href="/#categories" className="btn btn-outline-dark" onClick={handleClose}>
                            Catégories
                        </Link>
                        <Link href="/contact" className="btn btn-outline-dark" onClick={handleClose}>
                            Contact
                        </Link>
                        <Link href="/about" className="btn btn-outline-dark text-nowrap" onClick={handleClose}>
                            A Propos
                        </Link>

                        {user ? (
                            <div className="d-flex gap-5 mt-3">
                                <Link href="/favoris" className="text-dark position-relative" onClick={handleClose}>
                                    <FaHeart size={25} />
                                    {totalItemsFavoris > 0 && (
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            {totalItemsFavoris}
                                        </span>
                                    )}
                                </Link>
                                <Link href="/panier" className="text-dark position-relative" onClick={handleClose}>
                                    <FaShoppingCart size={25} />
                                    {totalItems > 0 && (
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            {totalItems}
                                        </span>
                                    )}
                                </Link>
                                <Link href="/user" className="text-dark" onClick={handleClose}>
                                    <FaUser size={25} />
                                </Link>
                                <Button onClick={() => { logout(); handleClose(); }} className="btn btn-danger rounded-pill">
                                    <LogOut size={25} />
                                </Button>
                            </div>
                        ):(
                            <>
                                <Nav.Link href="/inscription" onClick={handleClose}>
                                    <Button className="btn btn-primary rounded-pill">Inscription</Button>
                                </Nav.Link>
                                <Nav.Link href="/connexion" onClick={handleClose}>
                                    <Button className="btn btn-danger px-3 rounded-pill">Connexion</Button>
                                </Nav.Link>
                            </>
                        )
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
