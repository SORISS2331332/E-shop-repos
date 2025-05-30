'use client';
import React, { useRef } from 'react';
import { Container } from 'react-bootstrap';
import styles from '../../styles/styles.module.css';
import {
    FaMobileAlt, FaLaptop, FaHeadphones, FaCamera,
    FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { MdTabletAndroid, MdTv, MdMonitor, MdWatch } from 'react-icons/md';
import { GiGamepad } from 'react-icons/gi';
import { BiPlug } from 'react-icons/bi';

const Category = ({ onCategoryClick }) => {
    const scrollContainer = useRef(null);

    const scrollLeft = () => {
        if (scrollContainer.current) {
        scrollContainer.current.scrollLeft -= 150;
        }
    };

    const scrollRight = () => {
        if (scrollContainer.current) {
        scrollContainer.current.scrollLeft += 150;
        }
    };

    const categories = [
        {id: 1, name: 'Smartphones', icon: <FaMobileAlt size={40} /> },
        {id: 2, name: 'Ordinateurs', icon: <FaLaptop size={40} /> },
        {id: 3, name: 'Tablettes', icon: <MdTabletAndroid size={40} /> },
        {id: 4, name: 'Casques', icon: <FaHeadphones size={40} /> },
        
        {id: 5, name: 'Télévisions', icon: <MdTv size={40} /> },
        {id: 6, name: 'Ecrans', icon: <MdMonitor size={40} /> },
        {id: 7, name: 'Montres', icon: <MdWatch size={40} /> },
        {id: 8, name: 'Cameras', icon: <FaCamera size={40} /> },
        {id: 9, name: 'Consoles', icon: <GiGamepad size={40} /> },
        {id: 10, name: 'Accessoires', icon: <BiPlug size={40} /> }
    ];

    return (
        <section className={styles.categorySection}>
        <Container className="position-relative">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
            <h2 className="mb-3">Chercher par catégorie</h2>
            <button onClick={() => onCategoryClick(0)} className="btn btn-outline-dark fw-bold mb-3">Voir tous les articles ...</button>
            </div>

            {/* Flèches */}
            <button className={styles.scrollBtnLeft} onClick={scrollLeft}><FaChevronLeft /></button>
            <button className={styles.scrollBtnRight} onClick={scrollRight}><FaChevronRight /></button>

            {/* Scrollable category list */}
            <div ref={scrollContainer} className={styles.categoryScroll}>
            {categories.map((category, index) => (
                <div key={index} className={styles.categoryItem} onClick={() => onCategoryClick(category.id)}>
                <div className="text-center bg-light p-3 rounded">
                    {category.icon}
                    <p className="mt-2">{category.name}</p>
                </div>
                </div>
            ))}
            </div>
        </Container>
        </section>
    );
};

export default Category;
