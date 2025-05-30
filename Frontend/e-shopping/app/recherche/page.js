"use client";
import { useState, useEffect } from "react";
import Sidebar from "../components/coposantRecherche/Sidebar";
import ListeRecherche from "../components/coposantRecherche/ListeRecherche";

export default function Recherche() {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const fetchArticles = async () => {
    try {
      const response = await fetch("https://eshop-api-web.up.railway.app/api/Articles");
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSearch = (term) => setSearchTerm(term.toLowerCase());
  const handleCategoryChange = (categories) => setSelectedCategories(categories);

  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(article.categorieId);
    const matchesSearch =
      article.nom.toLowerCase().includes(searchTerm) ||
      article.nom.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container-fluid" style={{ marginTop: "120px" }}>
      <div className="row min-vh-100">
        {/* Sidebar */}
        <div className="col-12 col-md-3 p-0">
          <Sidebar
            onSearch={handleSearch}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Content */}
        <div className="col-12 col-md-9 p-4">
          {articles.length > 0 ? (
            <ListeRecherche articles={filteredArticles} />
          ) : (
            <p>Chargement...</p>
          )}
        </div>
      </div>
    </div>
  );
}
