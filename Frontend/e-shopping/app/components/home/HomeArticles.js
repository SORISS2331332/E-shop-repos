'use client';
import React, { useState, useEffect } from 'react';
import Category from './Category';
import Banner from './HeaderBanner'; 
import ArticlesList from './ArticlesList';
import FooterArticles from './FooterArticles';
import Loading from '../Loading';
    const HomeArticles = () => {
        const [articles, setArticles] = useState([]);
        const fetchArticles = async () => {
            try {
                const response = await fetch('https://eshop-api-web.up.railway.app/api/Articles');
                const data = await response.json();
                setArticles(data);
            } catch (error) {
                console.error('Error fetching articles:', error);
            }
        }
        useEffect(() => {
            fetchArticles();
        }, []);
        
    const [filteredCategory, setFilteredCategory] = useState(0);

    const handleCategoryClick = (categoryId) => {
        setFilteredCategory(categoryId);
        if(categoryId === 0) {
            setFilteredCategory(0);
        }
    };

    const filteredArticles = filteredCategory
        ? articles.filter((a) => a.categorieId === filteredCategory)
        : articles;

    const footerArticles = articles?.slice(0, 4);
    return (
        <>
            <Banner />
            <Category onCategoryClick={handleCategoryClick} />
            {
                articles ? (
                    <ArticlesList articles={filteredArticles} categorieId={filteredCategory}  />
                ) : (
                    <Loading />
                )
            }
            <FooterArticles footerArticles={footerArticles} />
        </>
    );
};

export default HomeArticles;
